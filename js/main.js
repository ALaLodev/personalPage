// Mobile menu
const menuBtn = document.getElementById('menuBtn');
const closeMenu = document.getElementById('closeMenu');
const mobileMenu = document.getElementById('mobileMenu');
const mobileLinks = document.querySelectorAll('.mobile-link');

menuBtn.addEventListener('click', () => mobileMenu.classList.remove('hidden'));
closeMenu.addEventListener('click', () => mobileMenu.classList.add('hidden'));
mobileLinks.forEach(link => {
    link.addEventListener('click', () => mobileMenu.classList.add('hidden'));
});

// Scroll animations + skill bars
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            const bars = entry.target.querySelectorAll('.skill-bar-fill');
            bars.forEach(bar => {
                const width = bar.getAttribute('data-width');
                setTimeout(() => { bar.style.width = width; }, 200);
            });
        }
    });
}, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });

document.querySelectorAll('.fade-in').forEach(el => {
    el.classList.add('animate');
    observer.observe(el);
});

// Header scroll effect
const mainHeader = document.getElementById('mainHeader');
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        mainHeader.classList.add('scrolled');
    } else {
        mainHeader.classList.remove('scrolled');
    }
});

// Contact form (mailto fallback)
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = contactForm.querySelector('[name="name"]').value;
    const email = contactForm.querySelector('[name="email"]').value;
    const message = contactForm.querySelector('[name="message"]').value;

    const mailtoLink = `mailto:antonio.lafuente@outlook.com?subject=Contacto desde portfolio de ${encodeURIComponent(name)}&body=${encodeURIComponent(`Nombre: ${name}\nEmail: ${email}\n\nMensaje:\n${message}`)}`;
    window.location.href = mailtoLink;

    toast.classList.add('show');
    contactForm.reset();

    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
});

// Video Modal
const videoModal = document.getElementById('videoModal');
const projectVideo = document.getElementById('projectVideo');
const closeVideoBtn = document.getElementById('closeVideoBtn');
const videoBtns = document.querySelectorAll('.open-video-btn');

if (videoModal && projectVideo && closeVideoBtn) {
    videoBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const videoSrc = btn.getAttribute('data-video');
            if (videoSrc) {
                projectVideo.src = videoSrc;
                videoModal.classList.remove('hidden');
                setTimeout(() => {
                    videoModal.classList.remove('opacity-0');
                }, 10);
                projectVideo.play().catch(err => console.log('Autoplay prevented:', err));
            }
        });
    });

    const closeModal = () => {
        videoModal.classList.add('opacity-0');
        setTimeout(() => {
            videoModal.classList.add('hidden');
            projectVideo.pause();
            projectVideo.src = '';
        }, 300);
    };

    closeVideoBtn.addEventListener('click', closeModal);
    videoModal.addEventListener('click', (e) => {
        if (e.target === videoModal) {
            closeModal();
        }
    });
}

// Image Gallery Modal
const imageModal = document.getElementById('imageModal');
const projectImage = document.getElementById('projectImage');
const closeImageBtn = document.getElementById('closeImageBtn');
const prevImageBtn = document.getElementById('prevImageBtn');
const nextImageBtn = document.getElementById('nextImageBtn');
const imageCounter = document.getElementById('imageCounter');
const galleryBtns = document.querySelectorAll('.open-gallery-btn');

let currentGalleryImages = [];
let currentImageIndex = 0;

if (imageModal && projectImage && closeImageBtn) {
    galleryBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const galleryData = btn.getAttribute('data-gallery');
            if (galleryData) {
                const [folder, countStr] = galleryData.split(',');
                const count = parseInt(countStr, 10);
                
                currentGalleryImages = Array.from({ length: count }, (_, i) => 
                    `screenshots/${folder}/Screenshot_${String(i + 1).padStart(2, '0')}.png`
                );
                currentImageIndex = 0;
                
                updateGalleryImage();
                
                imageModal.classList.remove('hidden');
                setTimeout(() => {
                    imageModal.classList.remove('opacity-0');
                }, 10);
            }
        });
    });

    const updateGalleryImage = () => {
        if (currentGalleryImages.length === 0) return;
        
        projectImage.style.opacity = '0';
        setTimeout(() => {
            projectImage.src = currentGalleryImages[currentImageIndex];
            imageCounter.textContent = `${currentImageIndex + 1} / ${currentGalleryImages.length}`;
            projectImage.style.opacity = '1';
        }, 150);
    };

    const nextImage = (e) => {
        if(e) e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % currentGalleryImages.length;
        updateGalleryImage();
    };

    const prevImage = (e) => {
        if(e) e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + currentGalleryImages.length) % currentGalleryImages.length;
        updateGalleryImage();
    };

    nextImageBtn.addEventListener('click', nextImage);
    prevImageBtn.addEventListener('click', prevImage);

    const closeImageGallery = () => {
        imageModal.classList.add('opacity-0');
        setTimeout(() => {
            imageModal.classList.add('hidden');
            currentGalleryImages = [];
            projectImage.src = '';
        }, 300);
    };

    closeImageBtn.addEventListener('click', closeImageGallery);
    imageModal.addEventListener('click', (e) => {
        if (e.target === imageModal) {
            closeImageGallery();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!imageModal.classList.contains('hidden')) {
            if (e.key === 'ArrowRight') nextImage();
            if (e.key === 'ArrowLeft') prevImage();
            if (e.key === 'Escape') closeImageGallery();
        }
    });
}


// Language toggle
let currentLang = 'es';

const translations = {
    navAbout: { es: 'Sobre mí', en: 'About' },
    navSkills: { es: 'Skills', en: 'Skills' },
    navProjects: { es: 'Proyectos', en: 'Projects' },
    navExperience: { es: 'Experiencia', en: 'Experience' },
    navEducation: { es: 'Formación', en: 'Education' },
    navContact: { es: 'Contacto', en: 'Contact' },
    heroSubtitle: { es: 'Software Developer', en: 'Software Developer' },
    heroAvailable: { es: 'Disponible para proyectos', en: 'Available for projects' },
    heroDesc1: { es: 'Especializado en Kotlin, Flutter y Java.', en: 'Specialized in Kotlin, Flutter and Java.' },
    heroDesc2: { es: 'Creo aplicaciones escalables con Clean Architecture, MVVM y TDD.', en: 'I build scalable apps with Clean Architecture, MVVM and TDD.' },
    scroll: { es: 'Scroll', en: 'Scroll' },
    aboutLabel: { es: 'Sobre mí', en: 'About' },
    aboutTitle: { es: 'Software que escala.', en: 'Software that scales.' },
    aboutP1: { es: 'Desarrollador de software orientado a resultados, especializado en Kotlin (Jetpack Compose), Flutter y Java (Spring Boot). Busco crear aplicaciones escalables y de alta calidad mediante Clean Architecture, MVVM y TDD.', en: 'Results-oriented software developer, specialized in Kotlin (Jetpack Compose), Flutter and Java (Spring Boot). I aim to create scalable, high-quality applications using Clean Architecture, MVVM and TDD.' },
    aboutP2: { es: 'Aporto madurez profesional y un firme compromiso con el rigor técnico forjado en entornos internacionales. Mi experiencia abarca desde el desarrollo nativo Android hasta backend con microservicios, pasando por soluciones multiplataforma con Flutter.', en: 'I bring professional maturity and a firm commitment to technical rigor forged in international environments. My experience spans from native Android development to backend with microservices, through cross-platform solutions with Flutter.' },
    locationLabel: { es: 'Ubicación', en: 'Location' },
    location: { es: 'Barcelona', en: 'Barcelona' },
    educationLabel: { es: 'Formación', en: 'Education' },
    education: { es: 'DAM', en: 'DAM' },
    phoneLabel: { es: 'Teléfono', en: 'Phone' },
    emailLabel: { es: 'Email', en: 'Email' },
    languagesLabel: { es: 'Idiomas', en: 'Languages' },
    languages1: { es: 'Español y Catalán (nativo)', en: 'Spanish and Catalan (native)' },
    languages2: { es: 'Alemán B2 · Inglés B1', en: 'German B2 · English B1' },
    talkBtn: { es: 'Hablemos', en: "Let's talk" },
    skillsLabel: { es: 'Stack técnico', en: 'Tech stack' },
    skillsTitle: { es: 'Herramientas que domino.', en: 'Tools I master.' },
    kotlinDesc: { es: 'Android nativo con Jetpack Compose, Coroutines, State Flow.', en: 'Native Android with Jetpack Compose, Coroutines, State Flow.' },
    kotlinDesc2: { es: 'Arquitectura MVVM, Clean Architecture y Firebase Realtime Database.', en: 'MVVM Architecture, Clean Architecture and Firebase Realtime Database.' },
    flutterDesc: { es: 'Apps multiplataforma iOS/Android. State management con BLoC/Cubit y Riverpod. Clean Architecture, fpdart, Drift/SQLite.', en: 'Cross-platform iOS/Android apps. State management with BLoC/Cubit and Riverpod. Clean Architecture, fpdart, Drift/SQLite.' },
    javaDesc: { es: 'Spring Boot 3, Hibernate/JPA, Spring Cloud (microservicios).', en: 'Spring Boot 3, Hibernate/JPA, Spring Cloud (microservices).' },
    javaDesc2: { es: 'Spring WebFlux. TDD con JUnit 5 y Mockito.', en: 'Spring WebFlux. TDD with JUnit 5 and Mockito.' },
    projectsLabel: { es: 'Proyectos', en: 'Projects' },
    projectsTitle: { es: 'Trabajo reciente.', en: 'Recent work.' },
    psicaidTitle: { es: 'Psicaid — SaaS HealthTech', en: 'Psicaid — HealthTech SaaS' },
    psicaidDesc: { es: 'Plataforma B2B completa para psicólogos. Lideré el desarrollo full-stack: experiencia mobile en Flutter con Riverpod (invalidación reactiva de datos, interfaz para resúmenes clínicos generados por LLMs, modo oscuro, layouts tablet) y backend en Java 17/Spring Boot 3 (APIs RESTful, JWT multi-tenant, integración con microservicio Python/FastAPI para IA, trazabilidad RGPD). Despliegue en Render.', en: 'Complete B2B platform for psychologists. I led the full-stack development: mobile experience in Flutter with Riverpod (reactive data invalidation, interface for LLM-generated clinical summaries, dark mode, tablet layouts) and backend in Java 17/Spring Boot 3 (RESTful APIs, multi-tenant JWT, integration with Python/FastAPI microservice for AI, GDPR traceability). Deployed on Render.' },
    psicaidVer: { es: 'Ver proyecto', en: 'View project' },
    taskflowTitle: { es: 'Task Flow', en: 'Task Flow' },
    taskflowDesc: { es: 'Sistema Full Stack completo con backend en Node.js/Express y frontend en Flutter. Backend construido con TypeScript, Prisma ORM y PostgreSQL, contenedorizado con Docker. Autenticación JWT y sincronización CRUD en tiempo real. Clean Architecture y programación funcional (fpdart) para manejo robusto de errores.', en: 'Complete Full Stack system with Node.js/Express backend and Flutter frontend. Backend built with TypeScript, Prisma ORM and PostgreSQL, containerized with Docker. JWT authentication and real-time CRUD synchronization. Clean Architecture and functional programming (fpdart) for robust error handling.' },
    taskflowVer: { es: 'Ver proyecto', en: 'View project' },
    pennyTitle: { es: 'Penny Track', en: 'Penny Track' },
    pennyDesc: { es: 'Aplicación de gestión financiera escalable implementando Clean Architecture y el patrón BLoC/Cubit. Sincronización híbrida con persistencia local (Drift/SQLite) y Firebase Auth, garantizando el aislamiento de datos multiusuario. Más de 5 pantallas interactivas con gráficos avanzados de visualización.', en: 'Scalable financial management app implementing Clean Architecture and BLoC/Cubit pattern. Hybrid synchronization with local persistence (Drift/SQLite) and Firebase Auth, ensuring multi-user data isolation. Over 5 interactive screens with advanced visualization charts.' },
    pennyVer: { es: 'Ver proyecto', en: 'View project' },
    chatAndroid: { es: 'Android Nativo', en: 'Native Android' },
    chatTitle: { es: 'ChatApp — Mensajería', en: 'ChatApp — Messaging' },
    chatDesc: { es: 'Aplicación de chat moderna para Android con mensajería instantánea fluida. Diseño limpio, arquitectura sólida y tecnologías modernas para una experiencia de comunicación confiable.', en: 'Modern Android chat application with smooth instant messaging. Clean design, solid architecture, and modern technologies for a reliable communication experience.' },
    guessAndroid: { es: 'Android Nativo', en: 'Native Android' },
    guessTitle: { es: 'Guess Wars — Cartas', en: 'Guess Wars — Cards' },
    guessDesc: { es: 'Juego de cartas multijugador para Android con pistas dinámicas, música de fondo adaptativa, notificaciones push, captura de pantalla, autenticación Firebase, clasificación global e interfaz multilingüe.', en: 'Multiplayer card game for Android with dynamic clues, adaptive background music, push notifications, screen capture, Firebase authentication, global leaderboard, and multilingual interface.' },
    horosAndroid: { es: 'Android Nativo', en: 'Native Android' },
    horosTitle: { es: 'HoroscoApp — Astrología', en: 'HoroscoApp — Astrology' },
    horosDesc: { es: 'App nativa de horóscopo con predicciones diarias, caché offline, MVVM con Dagger/Hilt, Retrofit, Room, Coroutines, StateFlow y tests completos (JUnit, Mockito, Espresso).', en: 'Native horoscope app with daily predictions, offline cache, MVVM with Dagger/Hilt, Retrofit, Room, Coroutines, StateFlow, and full tests (JUnit, Mockito, Espresso).' },
    expLabel: { es: 'Experiencia profesional', en: 'Professional experience' },
    expTitle: { es: 'Trayectoria.', en: 'Career path.' },
    exp1Role: { es: 'Mobile & Backend Developer', en: 'Mobile & Backend Developer' },
    exp1Company: { es: 'Psicaid — SaaS HealthTech B2B', en: 'Psicaid — HealthTech SaaS B2B' },
    exp1Location: { es: 'Valencia, España', en: 'Valencia, Spain' },
    exp1Date: { es: 'Feb 2026 — Abr 2026', en: 'Feb 2026 — Apr 2026' },
    exp1Bullet1: { es: 'Arquitectura Full Stack:', en: 'Full Stack Architecture:' },
    exp1Bullet1Desc: { es: 'Lideré el desarrollo integral de la experiencia mobile (Flutter + Riverpod) y diseñé la API de soporte en Java/Spring Boot.', en: 'Led the integral development of the mobile experience (Flutter + Riverpod) and designed the support API in Java/Spring Boot.' },
    exp1Bullet2: { es: 'Gestión de Estado Avanzada:', en: 'Advanced State Management:' },
    exp1Bullet2Desc: { es: 'Implementé arquitectura robusta con Riverpod garantizando reactividad e invalidación eficiente de datos tras creación de sesiones y generación de resúmenes por IA.', en: 'Implemented robust architecture with Riverpod ensuring reactivity and efficient data invalidation after session creation and AI summary generation.' },
    exp1Bullet3: { es: 'Integración con IA:', en: 'AI Integration:' },
    exp1Bullet3Desc: { es: 'Comunicación con microservicio Python (FastAPI) para procesamiento de notas clínicas mediante LLMs, con generación dinámica de prompts y filtrado inteligente.', en: 'Communication with Python microservice (FastAPI) for clinical note processing via LLMs, with dynamic prompt generation and intelligent filtering.' },
    exp1Bullet4: { es: 'Seguridad y Multitenancy:', en: 'Security & Multitenancy:' },
    exp1Bullet4Desc: { es: 'JWT con aislamiento estricto de datos multi-tenant. Cumplimiento RGPD con trazabilidad y logs con clasificación de criticidad.', en: 'JWT with strict multi-tenant data isolation. GDPR compliance with traceability and logs with criticality classification.' },
    exp1Bullet5: { es: 'DevOps:', en: 'DevOps:' },
    exp1Bullet5Desc: { es: 'Despliegue en Render, orquestación de arquitectura distribuida y gestión de entornos para alta disponibilidad.', en: 'Deployment on Render, distributed architecture orchestration and environment management for high availability.' },
    exp2Role: { es: 'Junior Software Developer', en: 'Junior Software Developer' },
    exp2Company: { es: 'Pukkas S.L.', en: 'Pukkas S.L.' },
    exp2Location: { es: 'Barcelona, España', en: 'Barcelona, Spain' },
    exp2Date: { es: 'Mar 2025 — Jun 2025', en: 'Mar 2025 — Jun 2025' },
    exp2Bullet1: { es: 'Entrega de Funcionalidades:', en: 'Feature Delivery:' },
    exp2Bullet1Desc: { es: 'Desarrollé más de 25 nuevas funcionalidades Frontend y Backend para sitios web corporativos, con 100% de alineación con especificaciones.', en: 'Developed over 25 new Frontend and Backend features for corporate websites, with 100% alignment with specifications.' },
    exp2Bullet2: { es: 'Desarrollo de APIs:', en: 'API Development:' },
    exp2Bullet2Desc: { es: 'Arquitecté e implementé 5 endpoints RESTful con PHP para consumo de datos fluido desde aplicaciones móviles.', en: 'Architected and implemented 5 RESTful endpoints with PHP for seamless data consumption from mobile applications.' },
    exp2Bullet3: { es: 'Eficiencia Ágil:', en: 'Agile Efficiency:' },
    exp2Bullet3Desc: { es: '12 ciclos completos de Scrum, completando el 100% de tickets de Jira asignados dentro de los plazos.', en: '12 complete Scrum cycles, completing 100% of assigned Jira tickets within deadlines.' },
    exp2Bullet4: { es: 'Calidad de Código:', en: 'Code Quality:' },
    exp2Bullet4Desc: { es: 'Revisiones de código por pares y documentación técnica para 6 proyectos corporativos diferentes.', en: 'Peer code reviews and technical documentation for 6 different corporate projects.' },
    eduLabel: { es: 'Formación y certificaciones', en: 'Education & certifications' },
    eduTitle: { es: 'Credenciales.', en: 'Credentials.' },
    cert1Type: { es: 'Certificación', en: 'Certification' },
    cert1Title: { es: 'Certified Agile Digital Product Practitioner™', en: 'Certified Agile Digital Product Practitioner™' },
    cert1Org: { es: 'Igrowker ISA — Delaware, USA', en: 'Igrowker ISA — Delaware, USA' },
    cert1Date: { es: 'Marzo 2026', en: 'March 2026' },
    certVer: { es: 'Ver certificado', en: 'View certificate' },
    cert1Desc: { es: '75h de entrenamiento práctico. Metodologías ágiles (Scrum/Kanban), equipos multidisciplinarios y desarrollo de productos con IA integrada.', en: '75h of practical training. Agile methodologies (Scrum/Kanban), multidisciplinary teams and product development with integrated AI.' },
    cert2Type: { es: 'Máster', en: 'Master' },
    cert2Title: { es: 'Java Masterclass — 160h', en: 'Java Masterclass — 160h' },
    cert2Org: { es: 'Udemy', en: 'Udemy' },
    cert2Date: { es: '2026', en: '2026' },
    cert2Desc: { es: 'Java 21, Spring Boot 3, Hibernate, microservicios, Spring Cloud y Spring WebFlux.', en: 'Java 21, Spring Boot 3, Hibernate, microservices, Spring Cloud and Spring WebFlux.' },
    cert3Type: { es: 'Título Oficial', en: 'Official Degree' },
    cert3Title: { es: 'Grado Superior DAM', en: 'Higher Degree DAM' },
    cert3Org: { es: 'Jesuïtes El Clot — Barcelona', en: 'Jesuïtes El Clot — Barcelona' },
    cert3Date: { es: '2025', en: '2025' },
    cert3Desc: { es: 'Desarrollo de Aplicaciones Multiplataforma. Android, iOS, bases de datos, programación y diseño de interfaces.', en: 'Cross-Platform Application Development. Android, iOS, databases, programming and interface design.' },
    cert4Type: { es: 'Especialización', en: 'Specialization' },
    cert4Title: { es: 'Apps Android/iOS con Flutter — 250h', en: 'Android/iOS Apps with Flutter — 250h' },
    cert4Org: { es: 'CIFO-La Violeta — Barcelona', en: 'CIFO-La Violeta — Barcelona' },
    cert4Date: { es: '2025', en: '2025' },
    cert5Type: { es: 'Curso', en: 'Course' },
    cert5Title: { es: 'Kotlin + Jetpack Compose + Firebase — 54h', en: 'Kotlin + Jetpack Compose + Firebase — 54h' },
    cert5Org: { es: 'AppCademy', en: 'AppCademy' },
    cert5Date: { es: '2024', en: '2024' },
    cert6Type: { es: 'Oracle Academy', en: 'Oracle Academy' },
    cert6Title: { es: 'Diseño y Programación de Bases de Datos', en: 'Database Design & Programming' },
    cert6Org: { es: 'Oracle Academy', en: 'Oracle Academy' },
    cert6Date: { es: '2023', en: '2023' },
    contactLabel: { es: 'Contacto', en: 'Contact' },
    contactTitle: { es: '¿Tienes un proyecto?', en: 'Have a project?' },
    contactDesc: { es: 'Si necesitas una app móvil, un backend robusto con Spring Boot, o una solución full-stack, me encantaría escuchar tu idea.', en: 'If you need a mobile app, a robust backend with Spring Boot, or a full-stack solution, I would love to hear your idea.' },
    nameLabel: { es: 'Nombre', en: 'Name' },
    namePlaceholder: { es: 'Tu nombre', en: 'Your name' },
    emailPlaceholder: { es: 'tu@email.com', en: 'you@email.com' },
    messageLabel: { es: 'Mensaje', en: 'Message' },
    messagePlaceholder: { es: 'Cuéntame sobre tu proyecto...', en: 'Tell me about your project...' },
    sendBtn: { es: 'Enviar mensaje', en: 'Send message' },
    secure: { es: 'Tu info está segura', en: 'Your info is safe' },
    footerCopy: { es: '© 2026 Antonio Lafuente. Todos los derechos reservados.', en: '© 2026 Antonio Lafuente. All rights reserved.' },
    footerMade: { es: 'Hecho con Kotlin y mucho Spring Boot', en: 'Made with Kotlin and lots of Spring Boot' },
    psicaidFeatured: { es: 'Destacado', en: 'Featured' },
    taskflowFullStack: { es: 'Full Stack', en: 'Full Stack' },
    pennyMobile: { es: 'Mobile', en: 'Mobile' },
    ticAndroid: { es: 'Android Nativo', en: 'Native Android' },
    toastMsg: { es: 'Mensaje enviado correctamente', en: 'Message sent successfully' },
};

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;

    const t = translations;

    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key][lang];
        }
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
        const key = el.getAttribute('data-i18n-placeholder');
        if (t[key]) {
            el.placeholder = t[key][lang];
        }
    });

    const newLabel = lang === 'es' ? 'EN' : 'ES';
    document.getElementById('langToggle').textContent = newLabel;
    document.getElementById('langToggleMobile').textContent = newLabel;
}

document.getElementById('langToggle').addEventListener('click', () => {
    setLanguage(currentLang === 'es' ? 'en' : 'es');
});

document.getElementById('langToggleMobile').addEventListener('click', () => {
    setLanguage(currentLang === 'es' ? 'en' : 'es');
});
