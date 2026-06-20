// Default site content. Mirrors what's currently hardcoded in the React
// components — used as the seed for the Blob store and as a fallback when
// the blob is unreachable. Edits via /admin overwrite the blob copy only.
export const defaultContent = {
  hero: {
    eyebrow: { en: 'Italian | Mediterranean Cuisine', es: 'Cocina Italiana | Mediterránea' },
    titleLine1: { en: 'Refined Mediterranean', es: 'Experiencia Culinaria' },
    titleLine2: { en: 'Culinary Experience', es: 'Mediterránea Refinada' },
    p1: {
      en: 'Culinary style focused on fresh, high-quality ingredients, simplicity, and Italian and Mediterranean influences. Emphasis on seasonal products, clean flavors, and balanced dishes — creating food that is both comforting and refined.',
      es: 'Estilo culinario enfocado en ingredientes frescos y de alta calidad, simplicidad e influencias italianas y mediterráneas. Énfasis en productos de estación, sabores limpios y platos equilibrados — creando comida reconfortante y refinada al mismo tiempo.',
    },
    p2: {
      en: 'Passionate professional with experience in both kitchen and front-of-house roles. Trained in Argentina and developed professionally in the United States within high-level hospitality environments.',
      es: 'Profesional apasionado con experiencia tanto en cocina como en salón. Formado en Argentina y desarrollado profesionalmente en Estados Unidos dentro de entornos de hospitalidad de alto nivel.',
    },
    p3: {
      en: 'Highly motivated to grow as a Private Chef, bringing creativity, dedication, and a strong work ethic. Committed to delivering exceptional culinary experiences while continuously learning and evolving.',
      es: 'Altamente motivado para crecer como Chef Privado, aportando creatividad, dedicación y una sólida ética de trabajo. Comprometido a brindar experiencias culinarias excepcionales mientras continúa aprendiendo y evolucionando.',
    },
    videoUrl: '/videos/hero-desktop.mp4',
    bioVideoUrl: '/videos/bio-background.mp4',
    audioEn: '',
    audioEs: '',
  },
  services: {
    title: { en: 'Services', es: 'Servicios' },
    items: [
      {
        id: 'private-dinners',
        icon: 'dinner',
        title: { en: 'Private Dinners', es: 'Cenas Privadas' },
        text: {
          en: 'Intimate and exclusive dining experiences crafted just for you.',
          es: 'Experiencias gastronómicas íntimas y exclusivas creadas para vos.',
        },
      },
      {
        id: 'weekly-meal-prep',
        icon: 'prep',
        title: { en: 'Weekly Meal Prep', es: 'Viandas Semanales' },
        text: {
          en: 'Healthy, personalized meals prepared for your week.',
          es: 'Comidas saludables y personalizadas preparadas para tu semana.',
        },
      },
      {
        id: 'events-celebrations',
        icon: 'events',
        title: { en: 'Events & Celebrations', es: 'Eventos y Celebraciones' },
        text: {
          en: 'Custom menus for special occasions and gatherings.',
          es: 'Menús a medida para ocasiones especiales y reuniones.',
        },
      },
      {
        id: 'healthy-customized',
        icon: 'healthy',
        title: { en: 'Healthy & Customized', es: 'Saludable y Personalizado' },
        text: {
          en: 'Nutritious, balanced menus adapted to your diet and lifestyle.',
          es: 'Menús nutritivos y equilibrados adaptados a tu dieta y estilo de vida.',
        },
      },
      {
        id: 'in-home-chef',
        icon: 'home',
        title: { en: 'In-Home Chef Service', es: 'Chef a Domicilio' },
        text: {
          en: 'Professional service in the comfort of your home.',
          es: 'Servicio profesional en la comodidad de tu hogar.',
        },
      },
    ],
  },
  experiences: {
    title: { en: 'Experiences', es: 'Experiencias' },
    items: [
      {
        id: 'intimate',
        imageUrl: '/images/experiences/intimate-dinners.jpg',
        title: { en: 'Intimate Dinners', es: 'Cenas Íntimas' },
        text: {
          en: 'A refined dining experience for two, designed around your tastes.',
          es: 'Una experiencia gastronómica refinada para dos, diseñada según tus gustos.',
        },
      },
      {
        id: 'family',
        imageUrl: '/images/experiences/family-gatherings.jpg',
        title: { en: 'Family Gatherings', es: 'Reuniones Familiares' },
        text: {
          en: 'Warm, shared meals that bring everyone around the table.',
          es: 'Comidas cálidas y compartidas que reúnen a todos en la mesa.',
        },
      },
      {
        id: 'celebrations',
        imageUrl: '/images/experiences/special-celebrations.jpg',
        title: { en: 'Special Celebrations', es: 'Celebraciones Especiales' },
        text: {
          en: 'Custom menus to make milestones and occasions unforgettable.',
          es: 'Menús a medida para hacer inolvidables tus momentos y ocasiones.',
        },
      },
      {
        id: 'wellness',
        imageUrl: '/images/experiences/wellness-cuisine.jpg',
        title: { en: 'Wellness Cuisine', es: 'Cocina Saludable' },
        text: {
          en: 'Nutritious, balanced dishes tailored to your lifestyle and goals.',
          es: 'Platos nutritivos y equilibrados adaptados a tu estilo de vida y objetivos.',
        },
      },
    ],
  },
  finalCta: {
    titleLine1: { en: 'Ready to Create Your', es: '¿Listo para Crear tu' },
    titleLine2: { en: 'Exclusive Experience?', es: 'Experiencia Exclusiva?' },
    description: {
      en: "Let's design a menu that's perfect for you and an experience your guests will never forget.",
      es: 'Diseñemos un menú perfecto para vos y una experiencia que tus invitados nunca olvidarán.',
    },
    cta: { en: 'Contact Me', es: 'Contactame' },
  },
  contact: {
    email: 'privatechefexperiences@gmail.com',
    phoneDisplay: '+1 (347) 219-5650',
    phoneTel: '+13472195650',
    phoneWhatsApp: '13472195650',
    instagram: '@privatechef_experiences',
    instagramUrl: 'https://instagram.com/privatechef_experiences',
    location: 'New Jersey, USA',
    whatsappMessage: "Hi Chef! I'd like to book a private chef experience. Could we talk?",
  },
  contactForm: {
    title: { en: 'Get in Touch', es: 'Contactame' },
    subtitle: {
      en: 'Tell me about your event and I will get back to you soon.',
      es: 'Contame sobre tu evento y te respondo a la brevedad.',
    },
  },
  // Gallery seed: photos live in public/images/gallery (gallery-1.jpg …
  // gallery-46.jpg). Populating this here makes them show on the site AND
  // appear in the /admin Gallery editor, where each can be reordered,
  // re-captioned, or deleted. A saved Blob gallery overrides this list.
  gallery: Array.from({ length: 46 }, (_, i) => ({
    url: `/images/gallery/gallery-${i + 1}.jpg`,
    alt: `Emanuel Aciar private chef — gallery photo ${i + 1}`,
  })),
}
