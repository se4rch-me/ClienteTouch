# 🚀 Guía de Migración: FormCliente a GitHub Pages

**Resumen:** Tu FormCliente.html pasará a GitHub Pages con el mismo diseño profesional que tiene ahora. Sin perder estilo, sin notificaciones de AppScript, sin parecer inseguro.

---

## ⚙️ PASO 1: Configurar el Endpoint en AppScript

### 1.1 Obtén tu URL de deploy

1. Ve a [script.google.com](https://script.google.com)
2. Abre tu proyecto
3. Click **"Implementar"** → **"Nueva implementación"**
4. Tipo: **"Aplicación web"** | Ejecutar como: **tu cuenta** | Acceso: **Cualquiera**
5. **Copia la URL generada** (la necesitarás)

### 1.2 Copia el archivo FormRecepcion.gs a tu proyecto AppScript

1. En AppScript, crea un nuevo archivo `FormRecepcion.gs`
2. Copia el contenido completo del `FormRecepcion.gs` que acabo de crear
3. **Reemplaza el `config.gs` que tienes con este código** (o copia el contenido en un nuevo archivo)

### 1.3 Configura el Token Secreto (⚠️ CRÍTICO)

En `FormRecepcion.gs`, línea 8:

```javascript
const FORM_SECRET_TOKEN = "tu_token_secreto_aqui";
```

**Cámbialo a algo único y largo:**
```javascript
const FORM_SECRET_TOKEN = "sk_live_4d7a9f2e8c1b5h9k3m7p2q8r5t9w2y4z";
```

**Este token DEBE estar en AMBOS lados:**
- En `FormRecepcion.gs` (AppScript)
- En `formCliente_GitHub.html` (GitHub Pages) - línea 266

---

## 🌐 PASO 2: Preparar GitHub Pages

### 2.1 Actualiza el HTML de GitHub Pages

1. Sube `formCliente_GitHub.html` a tu repo de GitHub Pages

### 2.2 Configura los dos valores críticos en HTML

En `formCliente_GitHub.html`:

**Línea 265** - Tu token secreto:
```javascript
const FORM_SECRET_TOKEN = "sk_live_4d7a9f2e8c1b5h9k3m7p2q8r5t9w2y4z"; // IGUAL que en AppScript
```

**Línea 264** - Tu URL de deploy de AppScript:
```javascript
const ENDPOINT_URL = "https://script.google.com/macros/s/TU_DEPLOYMENT_ID/exec";
```

---

## ✅ PASO 3: Prueba

1. Haz **Redeploy** del script AppScript
2. Abre el formulario en GitHub Pages
3. Completa todos los campos y envía
4. Verifica que aparezca en tu Sheets con estado **PRE-INGRESO**

---

## 🐛 Si no funciona

| Problema | Solución |
|----------|----------|
| "Token inválido" | ¿Ambos tokens iguales? Sin espacios extras |
| "Error de conexión" | ¿La URL del endpoint es correcta? ¿Redeploy hecho? |
| No aparece en Sheets | Abre AppScript Tools → Logs para ver qué falla |
| El formulario se ve roto | Asegúrate que Tailwind CDN cargó: `https://cdn.tailwindcss.com` |

---

## 🎯 Lo que conseguiste

✅ **Mismo diseño profesional** que formCliente.html  
✅ **Sin notificaciones de AppScript** (GitHub Pages es limpio)  
✅ **Seguro** - Validaciones + Token + Sanitización  
✅ **Los datos llegan a tu Sheets** normalmente  
✅ **El cliente ve una página profesional** sin avisos de seguridad
