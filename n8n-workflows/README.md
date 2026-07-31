# Workflows de n8n

## Gestión de clientes — Formulario → Google Sheets + email personalizado

Archivo: [`gestion-clientes-formulario.json`](gestion-clientes-formulario.json)

Flujo:

1. **Formulario de contacto** (Form Trigger) — recoge Nombre, Email, Teléfono, Empresa y el mensaje del cliente.
2. **Clasificar y preparar datos** (Code) — analiza el mensaje por palabras clave y asigna una categoría (`Presupuesto / Cotización`, `Soporte técnico`, `Reclamación`, `Información general`) y una prioridad (`Alta`/`Media`/`Baja`), y genera el asunto y cuerpo del email de respuesta según esa categoría.
3. **Guardar en Google Sheets** — añade una fila con todos los datos ya clasificados.
4. **Enviar email personalizado** (Gmail) — responde al cliente con el texto correspondiente a su categoría.

### Cómo importarlo

1. En n8n: **Workflows → Import from File** y selecciona `gestion-clientes-formulario.json` (o pega el JSON con **Import from URL/Clipboard**).
2. Abre el nodo **Guardar en Google Sheets**, conecta tu credencial de Google Sheets OAuth2 y selecciona la hoja de cálculo y pestaña de destino. Crea antes las columnas: `Fecha, Nombre, Email, Teléfono, Empresa, Categoría, Prioridad, Mensaje`.
3. Abre el nodo **Enviar email personalizado**, conecta tu credencial de Gmail OAuth2 (o sustitúyelo por el nodo `Send Email`/SMTP si no usas Gmail).
4. Ajusta los campos y el texto del formulario a tu negocio si lo necesitas.
5. Pulsa **Test workflow** con un envío de prueba antes de activar.
6. Activa el workflow.

### Personalizar la clasificación

La lógica de categorías vive en el nodo `Clasificar y preparar datos` (Code), en los arrays `kwQueja`, `kwSoporte`, `kwPresupuesto` y `kwUrgente`. Añade o quita palabras clave según el vocabulario real de tus clientes. Las plantillas de email (asunto + cuerpo) están en el objeto `plantillas` del mismo nodo.
