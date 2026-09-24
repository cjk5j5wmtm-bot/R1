# R1 — Landing page

Landing page de R1, agencia de diseño y desarrollo web. Todo está en un único archivo, `index.html`, con el CSS y el JavaScript incluidos. No usa librerías: solo carga las tipografías Space Grotesk e Inter desde Google Fonts.

## Antes de publicar

1. Al final de `index.html` está el bloque `CONFIG`. Reemplaza estos datos por los reales:
   - `whatsapp`: ya configurado con +54 9 11 3171-5300 (`5491131715300`)
   - `email`: se muestra en la sección de contacto y en el pie de página
   - `calendar`: tu enlace de Calendly, Cal.com o similar
   - `instagram`, `linkedin`, `behance`
2. En el `<head>`, cambia `https://www.tudominio.com/` (canonical y `og:url`) por tu dominio real. Si quieres que se vea una imagen al compartir el enlace, agrega `og:image`.
3. Reemplaza los clientes, proyectos, métricas y testimonios de ejemplo por los reales.

## Formulario

El formulario no necesita servidor. Valida los campos y abre WhatsApp con el mensaje ya escrito. Si prefieres recibirlo por email, puedes conectarlo a Formspree o a tu propio backend.

## Verla en tu computadora

Abre `index.html` en el navegador, o ejecuta:

```bash
python3 -m http.server 8000
```
