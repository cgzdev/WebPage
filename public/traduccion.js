const traducciones = {
  es: {
    'Bienvenido a Klassenfotos': 'Bienvenido a Klassenfotos',
    'Nombre completo:': 'Nombre completo:',
    'Seleccione su categoría:': 'Seleccione su categoría:',
    'Alumno': 'Alumno',
    'Personal': 'Personal',
    'Familia': 'Familia',
    'Otro': 'Otro',
    'Continuar': 'Continuar',
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
    'Nombre(s), Apellido': 'Nombre(s), Apellido',
    'YYYY': 'YYYY',
  },
  en: {
    'Bienvenido a Klassenfotos': 'Welcome to Klassenfotos',
    'Nombre completo:': 'Full name:',
    'Seleccione su categoría:': 'Select your category:',
    'Alumno': 'Student',
    'Personal': 'Staff',
    'Familia': 'Family',
    'Otro': 'Other',
    'Continuar': 'Continue',
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
    'Nombre(s), Apellido': 'First Name(s), Last Name',
    'YYYY': 'YYYY',
  },
  de: {
    'Bienvenido a Klassenfotos': 'Willkommen bei Klassenfotos',
    'Nombre completo:': 'Vollständiger Name:',
    'Seleccione su categoría:': 'Wählen Sie Ihre Kategorie:',
    'Alumno': 'Schüler',
    'Personal': 'Personal',
    'Familia': 'Familie',
    'Otro': 'Andere',
    'Continuar': 'Weiter',
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
    'Nombre(s), Apellido': 'Vorname(n), Nachname',
    'YYYY': 'JJJJ',
  },
  fr: {
    'Bienvenido a Klassenfotos': 'Bienvenue à Klassenfotos',
    'Nombre completo:': 'Nom complet:',
    'Seleccione su categoría:': 'Sélectionnez votre catégorie:',
    'Alumno': 'Élève',
    'Personal': 'Personnel',
    'Familia': 'Famille',
    'Otro': 'Autre',
    'Continuar': 'Continuer',
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
    'Nombre(s), Apellido': 'Prénom(s), Nom de famille',
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
