# Agency Conejo

Panel interno de agencia (ingresos, pipeline de leads, automatizaciones, notas) empaquetado como app instalable (PWA), con su propio logo e icono.

## Archivos

- `index.html` — la app (todo en un solo archivo, sin dependencias de backend; guarda los datos en el `localStorage` de tu navegador).
- `manifest.json` — metadatos de la app (nombre, iconos, modo standalone) para que el navegador la reconozca como instalable.
- `service-worker.js` — permite que la app funcione offline una vez instalada.
- `icons/` — logo de Agency Conejo en varios tamaños (favicon, icono de app, icono para iOS, icono "maskable" para Android).

## Instalar como aplicación en tu ordenador

**Opción recomendada — Chrome / Edge (Windows, macOS, Linux):**

1. Abre `index.html` en Chrome o Edge (doble clic, o arrástralo a una pestaña).
2. En la barra de direcciones aparecerá un icono de instalación (⊕ o un icono de pantalla), o usa el botón **"Instalar app"** que aparece arriba a la derecha dentro de la propia app.
3. Haz clic en instalar. Se creará un acceso directo en tu escritorio / menú de aplicaciones, y la app se abrirá en su propia ventana (sin la barra del navegador), con el icono de Agency Conejo.

**Si el botón de instalación no aparece** (algunos navegadores exigen servir el sitio por `http(s)://` en vez de abrir el archivo directamente):

1. Sirve la carpeta con un servidor local, por ejemplo:
   ```bash
   cd agency-conejo
   python3 -m http.server 8080
   ```
2. Abre `http://localhost:8080` en Chrome/Edge e instala desde ahí (icono ⊕ en la barra de direcciones, o menú ⋮ → "Instalar Agency Conejo…").

**Alternativa universal (cualquier navegador, sin PWA):**

En Chrome: menú ⋮ → **Más herramientas → Crear acceso directo…** → marca "Abrir como ventana". Esto crea un icono en el escritorio que abre `index.html` en su propia ventana de aplicación, usando el icono de la página.

## Notas

- Todos los datos (ingresos, leads, notas, etc.) se guardan localmente en el navegador donde abras/instales la app. No se sincronizan entre dispositivos ni se suben a ningún servidor.
- El botón "Reiniciar panel" borra esos datos guardados.
