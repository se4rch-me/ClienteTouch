# 🚀 Touch Center - Formulario Web

Formulario profesional de ingreso de dispositivos, desplegado en GitHub Pages.

---

## 📋 Estructura del Proyecto

```
ClienteTouch/
├── index.html                 ← Punto de entrada principal (formulario)
├── formCliente_GitHub.html    ← Copia del formulario (alternativa)
├── .nojekyll                  ← Archivo vacío (le dice a GitHub Pages que no use Jekyll)
├── FormRecepcion.gs           ← Código del endpoint en AppScript (cópialo en AppScript)
├── MIGRACION_GUIA.md         ← Esta guía
└── ... otros archivos
```

---

## ⚙️ INSTALACIÓN (3 PASOS)

### **PASO 1: Generar Token Secreto**

Usa algo único como:
```
sk_live_4d7a9f2e8c1b5h9k3m7p2q8r5t9w2y4z
```

**Anota este token, lo usarás en 2 lugares.**

---

### **PASO 2: Configurar en AppScript**

1. Ve a [script.google.com](https://script.google.com)
2. **Crea un nuevo archivo** llamado `FormRecepcion.gs`
3. **Copia todo el contenido** del archivo `FormRecepcion.gs` de este repo
4. En la **línea 8**, busca:
   ```javascript
   const FORM_SECRET_TOKEN = "tu_token_secreto_aqui";
   ```
   **Reemplaza con tu token:**
   ```javascript
   const FORM_SECRET_TOKEN = "sk_live_4d7a9f2e8c1b5h9k3m7p2q8r5t9w2y4z";
   ```

5. **Redeploy el script:**
   - Click **"Implementar"** → **"Nueva implementación"**
   - Tipo: **"Aplicación web"**
   - Ejecutar como: **tu cuenta**
   - Acceso: **Cualquiera**
   - Click **"Implementar"**
   - **Copia la URL que genera** (se verá así: `https://script.google.com/macros/s/AKfyc...`)

---

### **PASO 3: Configurar en GitHub Pages**

1. **Abre `index.html`** (o `formCliente_GitHub.html`)
2. Busca la **línea 264** (aproximadamente):
   ```javascript
   const ENDPOINT_URL = "https://script.google.com/macros/s/...";
   ```
   **Reemplaza con tu URL de AppScript**

3. Busca la **línea 265**:
   ```javascript
   const FORM_SECRET_TOKEN = "tu_token_secreto_aqui";
   ```
   **Reemplaza con tu token** (el MISMO que pusiste en AppScript)

4. **Haz commit y push** a GitHub:
   ```bash
   git add .
   git commit -m "Configurar formulario para GitHub Pages"
   git push
   ```

5. **Activa GitHub Pages:**
   - Ve a **Settings** → **Pages**
   - **Source:** main branch
   - **Folder:** root
   - Guarda

6. **Accede al formulario** en:
   ```
   https://se4rch-me.github.io/ClienteTouch/
   ```

---

## ✅ Qué debería pasar

| Acción | Resultado esperado |
|--------|-------------------|
| El cliente completa el formulario | Ve el diseño profesional completo |
| El cliente hace click en "FINALIZAR REGISTRO" | Muestra "Procesando..." |
| Envío exitoso | Aparece "✅ ¡Registro enviado!" con ID de seguimiento |
| Vuelves a tu Sheets | Aparece una nueva fila con status "PRE-INGRESO" |

---

## 🐛 Troubleshooting

### "Token inválido"
- ❌ Los tokens NO coinciden entre AppScript y HTML
- ✅ Verifica que sean exactamente iguales (sin espacios)

### "Error de conexión"
- ❌ La URL del endpoint está mal o no se redeploy AppScript
- ✅ Verifica que la URL sea exacta
- ✅ Haz un nuevo redeploy en AppScript

### El formulario se ve vacío/roto
- ❌ Tailwind CSS no cargó
- ✅ Espera 5 segundos, recarga (Ctrl+F5)
- ✅ Verifica que tengas conexión a internet

### No aparece en Sheets
- ❌ SPREADSHEET_ID o SHEET_NAME incorrectos en FormRecepcion.gs
- ✅ Verifica que el sheet existe en tu Google Drive

---

## 📱 Acceso desde el cliente

El cliente accede mediante:
```
https://se4rch-me.github.io/ClienteTouch/
```

O directamente a index.html si prefieres otra URL.

---

## 🔒 Seguridad Implementada

✅ **Token secreto** - Valida que la solicitud viene de tu sitio  
✅ **Validación de datos** - Cada campo se valida según formato esperado  
✅ **Sanitización** - Se elimina HTML malicioso  
✅ **Rate limiting** - Máximo 1 solicitud por minuto por IP  
✅ **CORS configurado** - Solo acepta requests de tu dominio  

---

## 📞 Soporte

Si algo no funciona:
1. Abre F12 (consola del navegador) y busca errores rojos
2. En AppScript: Tools → Logs para ver errores del servidor
3. Verifica que AMBOS archivos tengan la misma configuración

---

**Última actualización:** 27 de abril de 2026
