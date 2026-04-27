# 🔧 SOLUCIONAR ERROR DE CORS - Instrucciones Exactas

## 🚨 El Problema

```
Access to fetch at 'https://script.google.com/...' from origin 
'https://se4rch-me.github.io' has been blocked by CORS policy
```

**Causa:** AppScript no está configurado para aceptar requests desde GitHub Pages.

---

## ✅ Solución (4 pasos)

### **PASO 1: Ve a AppScript**

1. Abre [script.google.com](https://script.google.com)
2. Abre tu proyecto de ClienteTouch
3. En la izquierda, **elimina todos los archivos** (Code.gs, API_Ingresos.gs, etc.)
4. Crea un **nuevo archivo** llamado exactamente `FormRecepcion.gs`

---

### **PASO 2: Copia el código**

1. En este repo, abre el archivo **`FormRecepcion.gs`**
2. **Copia TODO el contenido** (Ctrl+A, Ctrl+C)
3. En AppScript, abre el archivo `FormRecepcion.gs` que creaste
4. **Elimina todo lo que hay** (Ctrl+A, Delete)
5. **Pega el código nuevo** (Ctrl+V)
6. **Guarda** (Ctrl+S)

---

### **PASO 3: Configura dos valores en FormRecepcion.gs**

**Línea 8** - Busca:
```javascript
const GITHUB_PAGES_DOMAIN = "se4rch-me.github.io";
```
**Debe estar EXACTAMENTE así** (se4rch-me es tu usuario)

**Línea 9** - Busca:
```javascript
const FORM_SECRET_TOKEN = "tu_token_secreto_aqui";
```
**Reemplaza con tu token** (usa el mismo de siempre):
```javascript
const FORM_SECRET_TOKEN = "sk_live_4d7a9f2e8c1b5h9k3m7p2q8r5t9w2y4z";
```

**Guarda** (Ctrl+S)

---

### **PASO 4: Redeploy el Script**

1. Click en **"Implementar"** (arriba a la derecha)
2. Click **"Nueva implementación"**
3. **Tipo:** "Aplicación web"
4. **Ejecutar como:** tu cuenta
5. **Quién tiene acceso:** Cualquiera
6. Click **"Implementar"**
7. **COPIA LA URL que aparece** (algo como `https://script.google.com/macros/s/AKfyc...`)

---

### **PASO 5: Actualiza index.html**

En tu repo:

1. Abre **`index.html`**
2. Ve a la **línea 264** (aproximadamente)
3. Busca:
   ```javascript
   const ENDPOINT_URL = "https://script.google.com/macros/s/...";
   ```
   **Reemplaza la URL completa con la que copiaste en PASO 4**

4. Ve a la **línea 265**
5. Busca:
   ```javascript
   const FORM_SECRET_TOKEN = "tu_token_secreto_aqui";
   ```
   **Reemplaza con tu token** (el MISMO que pusiste en FormRecepcion.gs):
   ```javascript
   const FORM_SECRET_TOKEN = "sk_live_4d7a9f2e8c1b5h9k3m7p2q8r5t9w2y4z";
   ```

6. **Guarda** (Ctrl+S)

---

### **PASO 6: Sube a GitHub**

```bash
cd /Users/sergio/Documents/GitHub/ClienteTouch
git add .
git commit -m "Corregir CORS - Actualizar endpoint y token"
git push
```

---

## ✅ Verifica que funcione

1. Abre tu navegador
2. Ve a `https://se4rch-me.github.io/ClienteTouch/`
3. **Recarga la página** (Ctrl+Shift+R para limpiar caché)
4. Completa el formulario y envía
5. Deberías ver: `✅ ¡Registro enviado con éxito!`

---

## 🐛 Si sigue sin funcionar

**En la consola del navegador (F12):**

| Error | Solución |
|-------|----------|
| "Token inválido" | ¿Los tokens en AppScript e index.html son iguales? |
| "CORS policy" | ¿Hiciste Redeploy en AppScript? ¿La URL es correcta? |
| "Error del servidor" | Abre AppScript Tools → Logs para ver qué pasó |

---

## ⚠️ Errores comunes

❌ **NO:** Copiar la URL vieja del endpoint  
✅ **SÍ:** Copiar la URL NUEVA después de Redeploy

❌ **NO:** Olvidar cambiar `GITHUB_PAGES_DOMAIN`  
✅ **SÍ:** Cambiar a `se4rch-me.github.io`

❌ **NO:** Tokens diferentes en AppScript vs index.html  
✅ **SÍ:** Usar el MISMO token en ambos lados

---

**Si después de esto sigue fallando, avísame qué dice la consola (F12).**
