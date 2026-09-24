# Peaky Blinders — Web Fan Page

Sitio web fan de la serie *Peaky Blinders* creado como proyecto de la materia **Programación 4**. La página usa HTML, CSS (Tailwind CDN + CSS propios) y JavaScript vanilla para armar una experiencia tipo "imperio Shelby": estética oscura con dorado, tipografías de época (`Playfair Display` + `Montserrat`) y microinteracciones de scroll.

## Páginas

| Página | Descripción |
| --- | --- |
| `index.html` | Portada con hero, sinopsis, carrusel infinito de personajes, sección "The Garrison" con generador de frases e indicador de progreso de scroll. |
| `seasons/temporada1.html` … `temporada6.html` | Ficha de cada temporada con sinopsis, detalles (año, episodios, antagonista) y trailer de YouTube embebido. |
| `progreso.html` | Rastreador de episodios vistos: marca capítulos por temporada y guarda el progreso en `localStorage`. |
| `galeria.html` | Galería de imágenes organizada por categorías, con lightbox (PhotoSwipe). |
| `contacto.html` | Formulario de contacto (usa `mailto`) más tarjeta con los datos de contacto. |
| `404.html` | Página de error personalizada para enlaces rotos. |

## Arquitectura

- **`css/seasons.css`** — estilos compartidos: navegación (desktop + menú móvil), dropdown de temporadas, barra de progreso de scroll y animaciones de entrada.
- **`css/galeria.css`**, **`css/contacto.css`**, **`css/progreso.css`** — estilos específicos de cada sección.
- **`script.js`** — JS principal del index: activación de las tarjetas de temporadas y personajes por scroll (`IntersectionObserver`), menú desplegable y desplazamiento suave.
- **`scripts/seasons.js`** — navegación global de todas las páginas: menú móvil, dropdown con soporte de teclado (Enter/Espacio/Escape), header que se oculta al bajar y animaciones al hacer scroll.
- **`scripts/galeria.js`** — arma la galería dinámicamente desde un array `GALLERY_CATEGORIES`. Si querés agregar imágenes, solo sumás una entrada al array y el archivo en `img/`.
- **`scripts/progreso.js`** — lógica del rastreador de episodios con persistencia en `localStorage` (clave `peakyBlindersProgress`).
- **`img/`** — imágenes en WebP (personajes, temporadas, hero y logo).
- **`wireframe.svg`** — boceto de la estructura de la página.

## Funcionalidades destacadas

- **Menú desplegable** de temporadas en la navegación, con versión móvil incluida.
- **Carrusel marquee infinito** de personajes en el index, con filtro de escala de grises que se colorea al pasar el mouse.
- **Galería con lightbox** usando [PhotoSwipe](https://photoswipe.com/) vía CDN. El script mide automáticamente las dimensiones reales de cada imagen para que el lightbox funcione.
- **Barra de progreso de scroll** arriba de la página y **header que se oculta** al bajar.
- **Animaciones de entrada al hacer scroll** con `IntersectionObserver`, con soporte para `prefers-reduced-motion`.
- **Rastreador de episodios** que guarda el progreso del usuario en su navegador y lo resume al volver.
- **Accesibilidad**: roles ARIA en dropdowns y menú móvil, soporte de teclado y cierre con `Escape`.

## Cómo correrla

No requiere build ni instalación. Solo abrir `index.html` en el navegador (o servir la carpeta con un servidor estático, por ejemplo `npx serve`). Las librerías externas (Tailwind, Google Fonts, AOS, PhotoSwipe) se cargan por CDN.

## Nota

Proyecto académico con fines de práctica. Las imágenes y textos pertenecen a *Peaky Blinders* (BBC / Steven Knight) y los trailers se embeben desde YouTube.

*"By order of the Peaky Blinders."*
