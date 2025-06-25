const traducciones = {
  es: {
    'Registro y envío de fotos': 'Registro y envío de fotos',
    'Ingresa tu e-mail:': 'Ingresa tu e-mail:',
    'Seleccione un campo:': 'Seleccione un campo:',
    'Generación': 'Generación',
    'Personal y extraordinarios': 'Personal y extraordinarios',
    'Elige una opción': 'Elige una opción',
    'Maestros': 'Maestros',
    'Administración': 'Administración',
    'Mantenimiento': 'Mantenimiento',
    'Grupos extraescolares': 'Grupos extraescolares',
    'Ver': 'Ver',
    'ejemplo@correo.com': 'ejemplo@correo.com',
    'YYYY': 'YYYY',
  },
  en: {
    'Registro y envío de fotos': 'Photo registration and delivery',
    'Ingresa tu e-mail:': 'Enter your e-mail:',
    'Seleccione un campo:': 'Select a category:',
    'Generación': 'Generation',
    'Personal y extraordinarios': 'Staff and special groups',
    'Elige una opción': 'Choose an option',
    'Maestros': 'Teachers',
    'Administración': 'Administration',
    'Mantenimiento': 'Maintenance',
    'Grupos extraescolares': 'Extracurricular groups',
    'Ver': 'See',
    'ejemplo@correo.com': 'example@email.com',
    'YYYY': 'YYYY',
  },
  de: {
    'Registro y envío de fotos': 'Foto-Registrierung und Versand',
    'Ingresa tu e-mail:': 'Gib deine E-Mail ein:',
    'Seleccione un campo:': 'Wähle eine Kategorie:',
    'Generación': 'Jahrgang',
    'Personal y extraordinarios': 'Personal und Schul-AGs',
    'Elige una opción': 'Wähle eine Option',
    'Maestros': 'Lehrer',
    'Administración': 'Verwaltung',
    'Mantenimiento': 'Wartung',
    'Grupos extraescolares': 'AGs und Clubs',
    'Ver': 'Ansehen',
    'ejemplo@correo.com': 'beispiel@email.de',
    'YYYY': 'JJJJ',
  },
  fr: {
    'Registro y envío de fotos': 'Enregistrement et envoi de photos',
    'Ingresa tu e-mail:': 'Entrez votre e-mail:',
    'Seleccione un campo:': 'Choisissez une catégorie:',
    'Generación': 'Génération',
    'Personal y extraordinarios': 'Personnel et groupes spéciaux',
    'Elige una opción': 'Choisissez une option',
    'Maestros': 'Enseignants',
    'Administración': 'Administration',
    'Mantenimiento': 'Maintenance',
    'Grupos extraescolares': 'Activités extrascolaires',
    'Ver': 'Voir',
    'ejemplo@correo.com': 'exemple@email.com',
    'YYYY': 'AAAA',
  }
};

function aplicarTraduccion(idioma) {
  const textos = traducciones[idioma];

  // Traducir texto visible
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const clave = el.getAttribute('data-i18n');
    if (textos[clave]) el.innerText = textos[clave];
  });

  // Traducir placeholders
  document.querySelectorAll('[data-placeholder]').forEach(el => {
    const clave = el.getAttribute('data-placeholder');
    if (textos[clave]) el.placeholder = textos[clave];
  });
}
