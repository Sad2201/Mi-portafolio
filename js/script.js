document.addEventListener('DOMContentLoaded', () => {

    // =====================================
    // 1. Animaciones al Hacer Scroll (AOS básico con Intersection Observer)
    // =====================================

    // Selecciona todos los elementos que deberían animarse al entrar en vista.
    const animatedElements = document.querySelectorAll(
        '.hero-content, .profile-picture, .about-text-wrapper, .btn-about-cv, ' +
        '.project-card, .skill-tag, .contact-intro, .contact-form, .btn-submit, ' +
        '.social-links, .site-footer'
    );

    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.2 // Porcentaje del elemento que debe ser visible para activar la animación
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Cuando el elemento entra en la vista, se asegura que la animación se dispare.
                // El CSS ya tiene 'animation: fadeInUp ... forwards; animation-delay: X;'
                // Para elementos que ya tienen 'animation' propiedad en CSS con 'forwards',
                // el navegador los animará una vez que se vuelvan visibles.
                // Si quieres que la animación SÓLO se dispare cuando entra en vista
                // y NO al cargar la página si ya está visible, la forma más robusta
                // es añadir la propiedad 'animation' aquí, o una clase que la active.
                // Sin embargo, para mantenerlo simple y aprovechando tu CSS existente,
                // aseguramos que el elemento tenga 'opacity: 0' inicialmente.
                // La animación con 'forwards' se encargará del resto al volverse visible.
                // No necesitamos añadir una clase 'is-visible' aquí si la animación
                // está directamente en el CSS del elemento con 'forwards'.
                // Solo necesitamos unobserve para optimizar.
                observer.unobserve(entry.target); // Deja de observar una vez que se ha animado
            }
        });
    }, observerOptions);

    animatedElements.forEach(element => {
        // Asegúrate de que los elementos tengan su estado inicial para animarse
        // Esto ya debería estar en tu CSS: opacity: 0; transform: translateY(Xpx);
        observer.observe(element);
    });


    // =====================================
    // 2. Lightbox para Proyectos
    // =====================================

    const projectImageWrappers = document.querySelectorAll('.project-image-wrapper');
    const body = document.body;

    // Crear el modal del lightbox dinámicamente
    const lightbox = document.createElement('div');
    lightbox.classList.add('lightbox-overlay');
    lightbox.innerHTML = `
        <div class="lightbox-content">
            <img src="" alt="Imagen de Proyecto Ampliada" class="lightbox-image">
            <button class="lightbox-close">&times;</button>
        </div>
    `;
    body.appendChild(lightbox);

    const lightboxImage = lightbox.querySelector('.lightbox-image');
    const lightboxCloseBtn = lightbox.querySelector('.lightbox-close');

    projectImageWrappers.forEach(wrapper => {
        wrapper.addEventListener('click', () => {
            const imgSrc = wrapper.querySelector('.project-image').src;
            lightboxImage.src = imgSrc;
            lightbox.classList.add('active'); // Muestra el lightbox
            body.classList.add('no-scroll'); // Evita el scroll del fondo
        });
    });

    // Cerrar el lightbox al hacer clic en el botón de cerrar
    lightboxCloseBtn.addEventListener('click', () => { // CORRECCIÓN: Sintaxis correcta de función de flecha
        lightbox.classList.remove('active');
        body.classList.remove('no-scroll');
    });

    // Cerrar el lightbox al hacer clic fuera de la imagen
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) { // Solo si se hace clic directamente en el overlay
            lightbox.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });

    // Cerrar con la tecla Escape
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            lightbox.classList.remove('active');
            body.classList.remove('no-scroll');
        }
    });

    // =====================================
    // 3. Suavizar Scroll para Enlaces de Navegación
    // =====================================

    document.querySelectorAll('.main-nav a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            
            // Si el elemento existe, procede con el scroll
            if (targetElement) {
                const header = document.querySelector('.site-header');
                const headerOffset = header ? header.offsetHeight : 0; // Obtiene la altura del header si existe
                
                // Calcula la posición objetivo teniendo en cuenta el header fijo
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset - 20; // 20px extra de padding

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

});