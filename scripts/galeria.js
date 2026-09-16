(function () {
    'use strict';

    // Datos de la galería: para agregar imágenes, agrega una entrada aquí y coloca el archivo en /img
    const GALLERY_CATEGORIES = [
        {
            label: 'La Familia',
            title: 'Almas de Small Heath',
            items: [
                { src: './img/personajes/tommy.webp', alt: 'Thomas Shelby, el patriarca del imperio' },
                { src: './img/personajes/arthur.webp', alt: 'Arthur Shelby, el músculo de la familia' },
                { src: './img/personajes/polly.webp', alt: 'Polly Gray, la matriarca de Small Heath' },
                { src: './img/personajes/jhon.webp', alt: 'John Shelby, el tercero de los hermanos' },
                { src: './img/personajes/ada.webp', alt: 'Ada Shelby, la voz de la razón' },
                { src: './img/personajes/alfie.webp', alt: 'Alfie Solomons, el rey del contrabando judío' },
                { src: './img/personajes/michael.webp', alt: 'Michael Gray, el heredero ambicioso' },
            ]
        },
        {
            label: 'Seis Entregas',
            title: 'Temporadas',
            items: [
                { src: './img/temporada1/season1.webp', alt: 'Temporada 1 — El Comienzo del Imperio' },
                { src: './img/temporada2/season2.webp', alt: 'Temporada 2 — Londres y el Sur' },
                { src: './img/temporada3/season3.webp', alt: 'Temporada 3 — La Alta Esfera' },
                { src: './img/temporada4/season4.webp', alt: 'Temporada 4 — La Venganza de la Mafia' },
                { src: './img/temporada5/season5.webp', alt: 'Temporada 5 — La Sombra del Fascismo' },
                { src: './img/temporada6/season6.webp', alt: 'Temporada 6 — El Fin de Era' },
            ]
        },
        {
            label: 'Los Decorados',
            title: 'Escenarios de Birmingham',
            items: [
                { src: './img/hero/hero.webp', alt: 'Thomas Shelby, dueño de las calles de Birmingham' },
                { src: './img/pub/pub.webp', alt: 'El pub The Garrison, cuartel de los Peaky Blinders' },
            ]
        }
    ];

    function buildGallery() {
        const galleryEl = document.getElementById('gallery');
        if (!galleryEl) return;

        let itemIndex = 0;
        const totalItems = GALLERY_CATEGORIES.reduce(function (sum, cat) {
            return sum + cat.items.length;
        }, 0);
        let pending = totalItems;
        let lightboxReady = false;

        function initLightbox() {
            if (lightboxReady || typeof PhotoSwipeLightbox === 'undefined') return;
            lightboxReady = true;
            const lightbox = new PhotoSwipeLightbox({
                gallery: '#gallery',
                children: 'a.gallery-item',
                pswpModule: PhotoSwipe,
                bgOpacity: 0.97,
            });
            lightbox.init();
        }

        // PhotoSwipe necesita las dimensiones reales de cada imagen para armar la galería
        function measure(anchor, src) {
            const probe = new Image();
            const done = function () {
                pending -= 1;
                if (pending === 0) {
                    initLightbox();
                }
            };
            probe.onload = function () {
                anchor.dataset.pswpWidth = String(probe.naturalWidth);
                anchor.dataset.pswpHeight = String(probe.naturalHeight);
                done();
            };
            probe.onerror = done;
            probe.src = src;
        }

        GALLERY_CATEGORIES.forEach(function (category) {
            const block = document.createElement('div');
            block.className = 'gallery-category animate-on-scroll';

            const head = document.createElement('header');
            head.className = 'gallery-category-head';

            const label = document.createElement('span');
            label.textContent = category.label;

            const title = document.createElement('h2');
            title.textContent = category.title;

            head.appendChild(label);
            head.appendChild(title);

            const grid = document.createElement('div');
            grid.className = 'gallery-grid';

            category.items.forEach(function (item) {
                const anchor = document.createElement('a');
                anchor.className = 'gallery-item';
                anchor.href = item.src;
                anchor.setAttribute('aria-label', item.alt);
                anchor.dataset.caption = item.alt;
                anchor.style.animationDelay = (itemIndex % 8) * 60 + 'ms';

                const img = document.createElement('img');
                img.src = item.src;
                img.alt = item.alt;
                img.loading = 'lazy';
                img.decoding = 'async';

                const caption = document.createElement('span');
                caption.className = 'gallery-item-caption';
                caption.textContent = item.alt;

                anchor.appendChild(img);
                anchor.appendChild(caption);
                grid.appendChild(anchor);

                measure(anchor, item.src);
                itemIndex += 1;
            });

            block.appendChild(head);
            block.appendChild(grid);
            galleryEl.appendChild(block);
        });

        revealOnScroll(galleryEl);
    }

    // Misma mecánica de aparición que seasons.js, aplicada a las categorías generadas
    function revealOnScroll(container) {
        const elements = container.querySelectorAll('.gallery-category.animate-on-scroll');

        if (window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
            !('IntersectionObserver' in window)) {
            elements.forEach(function (el) {
                el.classList.add('animate-in');
            });
            return;
        }

        const observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -10%' });

        elements.forEach(function (el) {
            observer.observe(el);
        });
    }

    document.addEventListener('DOMContentLoaded', buildGallery);
})();