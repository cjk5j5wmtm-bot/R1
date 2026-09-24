# R1 — Página web

Página web moderna, adaptable y sin dependencias, hecha con HTML, CSS y JavaScript.

## Secciones

- **Inicio**: presentación con llamada a la acción y contadores animados.
- **Servicios**: tarjetas con los servicios ofrecidos.
- **Nosotros**: descripción del equipo y ventajas.
- **Testimonios**: carrusel automático de opiniones.
- **Contacto**: formulario con validación.

## Características

- Diseño responsive (móvil, tablet y escritorio) con menú hamburguesa.
- Modo claro / oscuro (recuerda tu preferencia).
- Animaciones al hacer scroll (respetan `prefers-reduced-motion`).
- Sin frameworks ni proceso de compilación.

## Cómo verla

Abre `index.html` directamente en el navegador, o levanta un servidor local:

```bash
python3 -m http.server 8000
# luego visita http://localhost:8000
```

## Personalización

- Textos y secciones: `index.html`
- Colores y estilos: variables en `:root` dentro de `styles.css`
- Comportamiento: `script.js` (el formulario todavía no envía datos a ningún servidor; conéctalo a tu backend o a un servicio como Formspree).
