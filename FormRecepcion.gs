/**
 * ARCHIVO: FormRecepcion.gs
 * ENDPOINT SEGURO: Recepción de formularios desde GitHub Pages
 * Objetivo: Recibir datos del formulario web y crear PRE-INGRESO en Sheets
 * Versión: 2.1 - Completo con variables del Sheets
 */

// === 1. CONFIGURACIÓN DEL ENDPOINT ===
const GITHUB_PAGES_DOMAIN = "se4rch-me.github.io";
const FORM_SECRET_TOKEN = "tu_token_secreto_aqui"; // ⚠️ CAMBIA ESTO A UN VALOR ÚNICO
const MAX_REQUEST_SIZE = 1024;
const RATE_LIMIT = 60;

// === 2. CONFIGURACIÓN DEL SPREADSHEET ===
// ⚠️ COPIA ESTOS VALORES DE TU config.gs ORIGINAL
const SPREADSHEET_ID = "19cwOCoRBH8V5j_Jgivha511EG2JcykDxweI4Ij4XKAQ";
const SHEET_NAME = "TCK";

const COLUMNS = {
  LEAD_ID: 0,       
  DATE_ADDED: 1,
  STATUS: 2,
  CLIENT_NAME: 3,
  CEDULA_NIT: 4,
  CONTACT: 5,
  CORREO: 6,
  DIRECCION: 7,
  EQUIPO: 8,
  INGRESO: 9,
  PASSWORD: 10,
  NOTA_CLIENTE: 11
};

const STATUS_OBJ = {
  PRE_INGRESO: "PRE-INGRESO"
};

// Validadores
const VALIDATORS = {
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  phone: /^[\d\-\(\)\+\s]{7,20}$/,
  cedula: /^[\d\-]{6,20}$/,
  nombre: /^[a-záéíóúñA-ZÁÉÍÓÚ\s]{3,100}$/,
  texto: (str, maxLen = 500) => str && str.length > 0 && str.length <= maxLen
};

// === 2. CONTROL DE RATE LIMIT ===
function verificarRateLimit(ip) {
  const cache = CacheService.getScriptCache();
  const key = `RATE_LIMIT_${ip}`;
  const count = parseInt(cache.get(key) || "0");
  
  if (count >= RATE_LIMIT) {
    return false;
  }
  
  cache.put(key, String(count + 1), 60);
  return true;
}

// === 3. SANITIZACIÓN DE DATOS ===
function sanitizar(texto) {
  if (!texto) return "";
  
  return String(texto)
    .trim()
    .slice(0, 500)
    .replace(/<[^>]*>/g, "")
    .replace(/['"]/g, "");
}

// === 4. VALIDACIÓN COMPLETA DEL PAYLOAD ===
function validarPayload(payload) {
  const errores = [];

  if (!payload || typeof payload !== "object") {
    return { valido: false, errores: ["Estructura inválida"] };
  }

  if (payload.token !== FORM_SECRET_TOKEN) {
    return { valido: false, errores: ["Token inválido"] };
  }

  const datos = payload.datos || {};

  // Validaciones por campo
  if (!datos.nombre || !VALIDATORS.nombre.test(sanitizar(datos.nombre))) {
    errores.push("Nombre inválido (3-100 caracteres, letras/espacios)");
  }

  if (!datos.id_cliente || !VALIDATORS.cedula.test(sanitizar(datos.id_cliente))) {
    errores.push("Cédula/NIT inválida");
  }

  if (!datos.telefono || !VALIDATORS.phone.test(sanitizar(datos.telefono))) {
    errores.push("Teléfono inválido");
  }

  if (!datos.email || !VALIDATORS.email.test(sanitizar(datos.email).toLowerCase())) {
    errores.push("Email inválido");
  }

  if (!VALIDATORS.texto(sanitizar(datos.direccion), 150)) {
    errores.push("Dirección inválida (máx 150 caracteres)");
  }

  if (!VALIDATORS.texto(sanitizar(datos.equipo), 100)) {
    errores.push("Equipo inválido (máx 100 caracteres)");
  }

  if (!VALIDATORS.texto(sanitizar(datos.falla), 200)) {
    errores.push("Falla inválida (máx 200 caracteres)");
  }

  if (datos.accesorios && !VALIDATORS.texto(sanitizar(datos.accesorios), 200)) {
    errores.push("Accesorios inválido (máx 200 caracteres)");
  }

  if (datos.clave && !VALIDATORS.texto(sanitizar(datos.clave), 100)) {
    errores.push("Clave inválida (máx 100 caracteres)");
  }

  if (datos.nota_cliente && !VALIDATORS.texto(sanitizar(datos.nota_cliente), 300)) {
    errores.push("Nota inválida (máx 300 caracteres)");
  }

  return {
    valido: errores.length === 0,
    errores: errores,
    datos: {
      nombre: sanitizar(datos.nombre),
      id_cliente: sanitizar(datos.id_cliente),
      telefono: sanitizar(datos.telefono),
      email: sanitizar(datos.email).toLowerCase(),
      direccion: sanitizar(datos.direccion),
      equipo: sanitizar(datos.equipo),
      falla: sanitizar(datos.falla),
      accesorios: sanitizar(datos.accesorios || ""),
      clave: sanitizar(datos.clave || ""),
      nota_cliente: sanitizar(datos.nota_cliente || "")
    }
  };
}

// === 5. ENDPOINT PRINCIPAL ===
function doPost(e) {
  const lock = LockService.getScriptLock();
  
  try {
    lock.waitLock(5000);

    const ip = e.parameter.ip || "unknown";

    if (!verificarRateLimit(ip)) {
      return responder(
        { success: false, error: "Demasiadas solicitudes. Intenta más tarde." },
        429
      );
    }

    if (!e || !e.postData || !e.postData.contents) {
      return responder(
        { success: false, error: "Solicitud vacía" },
        400
      );
    }

    if (e.postData.length > MAX_REQUEST_SIZE) {
      return responder(
        { success: false, error: "Datos demasiado grandes" },
        413
      );
    }

    let payload;
    try {
      payload = JSON.parse(e.postData.contents);
    } catch (err) {
      return responder(
        { success: false, error: "JSON inválido" },
        400
      );
    }

    const validacion = validarPayload(payload);
    if (!validacion.valido) {
      return responder(
        { 
          success: false, 
          error: "Datos inválidos",
          detalles: validacion.errores 
        },
        400
      );
    }

    const datos = validacion.datos;
    const sheet = SpreadsheetApp.openById(SPREADSHEET_ID).getSheetByName(SHEET_NAME);
    
    const newRow = new Array(31).fill("");
    const tempId = "TEMP-" + new Date().getTime();

    // GRUPO 1: Control
    newRow[COLUMNS.LEAD_ID] = tempId;
    newRow[COLUMNS.DATE_ADDED] = new Date().toLocaleDateString('es-CO');
    newRow[COLUMNS.STATUS] = STATUS_OBJ.PRE_INGRESO;

    // GRUPO 2: Cliente
    newRow[COLUMNS.CLIENT_NAME] = datos.nombre;
    newRow[COLUMNS.CEDULA_NIT] = datos.id_cliente;
    newRow[COLUMNS.CONTACT] = datos.telefono;
    newRow[COLUMNS.CORREO] = datos.email;
    newRow[COLUMNS.DIRECCION] = datos.direccion;

    // GRUPO 3: Solicitud
    newRow[COLUMNS.EQUIPO] = datos.equipo;
    newRow[COLUMNS.INGRESO] = datos.falla + (datos.accesorios ? " | Accesorios: " + datos.accesorios : "");
    newRow[COLUMNS.PASSWORD] = datos.clave;
    newRow[COLUMNS.NOTA_CLIENTE] = datos.nota_cliente;

    sheet.appendRow(newRow);

    return responder(
      { 
        success: true, 
        tempId: tempId,
        mensaje: "Solicitud recibida exitosamente" 
      },
      200
    );

  } catch (error) {
    Logger.log("ERROR EN ENDPOINT: " + error.message + " | Stack: " + error.stack);
    return responder(
      { success: false, error: "Error del servidor" },
      500
    );
  } finally {
    lock.releaseLock();
  }
}

// === 6. RESPUESTA CON CORS HEADERS ===
function responder(data, statusCode = 200) {
  return ContentService
    .createTextOutput(JSON.stringify(data))
    .setMimeType(ContentService.MimeType.JSON)
    .setHeader("Access-Control-Allow-Origin", "https://" + GITHUB_PAGES_DOMAIN)
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type")
    .setHeader("Access-Control-Max-Age", "3600")
    .setHeader("X-Content-Type-Options", "nosniff")
    .setHeader("X-Frame-Options", "DENY");
}

// === 7. MANEJO DE PREFLIGHT (OPTIONS) ===
function doOptions(e) {
  return ContentService
    .createTextOutput("")
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeader("Access-Control-Allow-Origin", "https://" + GITHUB_PAGES_DOMAIN)
    .setHeader("Access-Control-Allow-Methods", "POST, OPTIONS")
    .setHeader("Access-Control-Allow-Headers", "Content-Type")
    .setHeader("Access-Control-Max-Age", "3600");
}
