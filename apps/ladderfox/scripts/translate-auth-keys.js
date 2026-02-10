#!/usr/bin/env node

/**
 * Script to translate authentication keys to French, German, and Spanish
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = 'src/translations';

const authTranslations = {
  // French
  "auth.back_to_login": {
    fr: "Retour à la connexion",
    de: "Zurück zur Anmeldung",
    es: "Volver al inicio de sesión"
  },
  "auth.benefits.ai_suggestions": {
    fr: "Suggestions IA",
    de: "KI-gestützte Vorschläge",
    es: "Sugerencias con IA"
  },
  "auth.benefits.instant_download": {
    fr: "Téléchargement PDF instantané",
    de: "Sofortiger PDF-Download",
    es: "Descarga PDF instantánea"
  },
  "auth.benefits.templates": {
    fr: "Accès à tous les modèles",
    de: "Zugriff auf alle Vorlagen",
    es: "Acceso a todas las plantillas"
  },
  "auth.benefits.unlimited_cvs": {
    fr: "Créez des CV professionnels illimités",
    de: "Erstellen Sie unbegrenzt professionelle Lebensläufe",
    es: "Crea CVs profesionales ilimitados"
  },
  "auth.check_email": {
    fr: "Vérifiez votre e-mail",
    de: "Überprüfen Sie Ihre E-Mail",
    es: "Revisa tu correo electrónico"
  },
  "auth.confirm_new_password": {
    fr: "Confirmer le nouveau mot de passe",
    de: "Neues Passwort bestätigen",
    es: "Confirmar nueva contraseña"
  },
  "auth.confirm_password": {
    fr: "Confirmer le mot de passe",
    de: "Passwort bestätigen",
    es: "Confirmar contraseña"
  },
  "auth.continue_with_google": {
    fr: "Continuer avec Google",
    de: "Mit Google fortfahren",
    es: "Continuar con Google"
  },
  "auth.create_account": {
    fr: "Créez votre compte",
    de: "Erstellen Sie Ihr Konto",
    es: "Crea tu cuenta"
  },
  "auth.create_account_button": {
    fr: "Créer un compte",
    de: "Konto erstellen",
    es: "Crear cuenta"
  },
  "auth.creating_account": {
    fr: "Création du compte...",
    de: "Konto wird erstellt...",
    es: "Creando cuenta..."
  },
  "auth.dont_have_account": {
    fr: "Pas encore de compte?",
    de: "Noch kein Konto?",
    es: "¿No tienes cuenta?"
  },
  "auth.email": {
    fr: "E-mail",
    de: "E-Mail",
    es: "Correo electrónico"
  },
  "auth.error.fill_fields": {
    fr: "Veuillez remplir tous les champs",
    de: "Bitte füllen Sie alle Felder aus",
    es: "Por favor completa todos los campos"
  },
  "auth.error.google_failed": {
    fr: "Connexion Google échouée. Veuillez réessayer.",
    de: "Google-Anmeldung fehlgeschlagen. Bitte versuchen Sie es erneut.",
    es: "Error al iniciar sesión con Google. Inténtalo de nuevo."
  },
  "auth.error.login_failed": {
    fr: "Connexion échouée. Vérifiez vos identifiants.",
    de: "Anmeldung fehlgeschlagen. Überprüfen Sie Ihre Anmeldedaten.",
    es: "Error al iniciar sesión. Verifica tus credenciales."
  },
  "auth.error.password_length": {
    fr: "Le mot de passe doit contenir au moins 8 caractères",
    de: "Das Passwort muss mindestens 8 Zeichen enthalten",
    es: "La contraseña debe tener al menos 8 caracteres"
  },
  "auth.error.passwords_match": {
    fr: "Les mots de passe doivent correspondre",
    de: "Die Passwörter müssen übereinstimmen",
    es: "Las contraseñas deben coincidir"
  },
  "auth.error.reset_failed": {
    fr: "Échec de l'envoi de l'e-mail de réinitialisation. Veuillez réessayer.",
    de: "Fehler beim Senden der Zurücksetzungs-E-Mail. Bitte versuchen Sie es erneut.",
    es: "Error al enviar el correo de restablecimiento. Inténtalo de nuevo."
  },
  "auth.error.signup_failed": {
    fr: "Inscription échouée. Veuillez réessayer.",
    de: "Registrierung fehlgeschlagen. Bitte versuchen Sie es erneut.",
    es: "Error al registrarse. Inténtalo de nuevo."
  },
  "auth.forgot_password": {
    fr: "Mot de passe oublié?",
    de: "Passwort vergessen?",
    es: "¿Olvidaste tu contraseña?"
  },
  "auth.invalid_token": {
    fr: "Jeton invalide ou manquant. Veuillez demander une nouvelle réinitialisation de mot de passe.",
    de: "Ungültiges oder fehlendes Token. Bitte fordern Sie eine neue Passwortzurücksetzung an.",
    es: "Token inválido o faltante. Por favor solicita un nuevo restablecimiento de contraseña."
  },
  "auth.name": {
    fr: "Nom",
    de: "Name",
    es: "Nombre"
  },
  "auth.new_password": {
    fr: "Nouveau mot de passe",
    de: "Neues Passwort",
    es: "Nueva contraseña"
  },
  "auth.or": {
    fr: "ou",
    de: "oder",
    es: "o"
  },
  "auth.password": {
    fr: "Mot de passe",
    de: "Passwort",
    es: "Contraseña"
  },
  "auth.placeholder.confirm_password": {
    fr: "Confirmer le nouveau mot de passe",
    de: "Neues Passwort bestätigen",
    es: "Confirmar nueva contraseña"
  },
  "auth.placeholder.email": {
    fr: "vous@exemple.fr",
    de: "du@beispiel.de",
    es: "tu@ejemplo.es"
  },
  "auth.placeholder.name": {
    fr: "Votre nom",
    de: "Ihr Name",
    es: "Tu nombre"
  },
  "auth.placeholder.new_password": {
    fr: "Entrez le nouveau mot de passe",
    de: "Neues Passwort eingeben",
    es: "Ingresa la nueva contraseña"
  },
  "auth.placeholder.password": {
    fr: "••••••••",
    de: "••••••••",
    es: "••••••••"
  },
  "auth.remember_me": {
    fr: "Se souvenir de moi",
    de: "Angemeldet bleiben",
    es: "Recuérdame"
  },
  "auth.reset_email_sent": {
    fr: "Si un compte existe pour {email}, vous recevrez sous peu un e-mail pour réinitialiser votre mot de passe.",
    de: "Wenn ein Konto für {email} existiert, erhalten Sie in Kürze eine E-Mail zum Zurücksetzen Ihres Passworts.",
    es: "Si existe una cuenta para {email}, recibirás un correo para restablecer tu contraseña en breve."
  },
  "auth.reset_link_sent": {
    fr: "Lien de réinitialisation envoyé",
    de: "Zurücksetzungslink gesendet",
    es: "Enlace de restablecimiento enviado"
  },
  "auth.reset_password": {
    fr: "Réinitialiser le mot de passe",
    de: "Passwort zurücksetzen",
    es: "Restablecer contraseña"
  },
  "auth.reset_password_button": {
    fr: "Réinitialiser le mot de passe",
    de: "Passwort zurücksetzen",
    es: "Restablecer contraseña"
  },
  "auth.reset_success": {
    fr: "Mot de passe réinitialisé avec succès!",
    de: "Passwort erfolgreich zurückgesetzt!",
    es: "¡Contraseña restablecida con éxito!"
  },
  "auth.resetting": {
    fr: "Réinitialisation...",
    de: "Zurücksetzen...",
    es: "Restableciendo..."
  },
  "auth.send_reset_link": {
    fr: "Envoyer le lien de réinitialisation",
    de: "Zurücksetzungslink senden",
    es: "Enviar enlace de restablecimiento"
  },
  "auth.sending": {
    fr: "Envoi...",
    de: "Senden...",
    es: "Enviando..."
  },
  "auth.sign_in": {
    fr: "Se connecter",
    de: "Anmelden",
    es: "Iniciar sesión"
  },
  "auth.sign_in_subtitle": {
    fr: "Connectez-vous pour continuer à bâtir votre carrière",
    de: "Melden Sie sich an, um Ihre Karriere weiter aufzubauen",
    es: "Inicia sesión para continuar construyendo tu carrera"
  },
  "auth.signing_in": {
    fr: "Connexion...",
    de: "Anmelden...",
    es: "Iniciando sesión..."
  },
  "auth.start_building": {
    fr: "Commencez gratuitement à créer des CV professionnels",
    de: "Beginnen Sie kostenlos mit der Erstellung professioneller Lebensläufe",
    es: "Comienza a crear CVs profesionales gratis"
  },
  "auth.success.account_created": {
    fr: "Compte créé avec succès!",
    de: "Konto erfolgreich erstellt!",
    es: "¡Cuenta creada con éxito!"
  },
  "auth.success.logged_in": {
    fr: "Connexion réussie!",
    de: "Erfolgreich angemeldet!",
    es: "¡Sesión iniciada con éxito!"
  },
  "auth.welcome_back": {
    fr: "Bon retour",
    de: "Willkommen zurück",
    es: "Bienvenido de nuevo"
  }
};

function loadJSON(lang) {
  const filePath = path.join(TRANSLATIONS_DIR, `${lang}.json`);
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function saveJSON(lang, data) {
  const filePath = path.join(TRANSLATIONS_DIR, `${lang}.json`);
  const sorted = {};
  Object.keys(data).sort().forEach(key => {
    sorted[key] = data[key];
  });
  fs.writeFileSync(filePath, JSON.stringify(sorted, null, 2) + '\n', 'utf8');
}

function main() {
  console.log('🔄 Translating authentication keys...\n');

  const languages = ['fr', 'de', 'es'];
  
  languages.forEach(lang => {
    console.log(`🌐 Updating ${lang.toUpperCase()}...`);
    const data = loadJSON(lang);
    let updated = 0;

    Object.keys(authTranslations).forEach(key => {
      if (authTranslations[key][lang]) {
        data[key] = authTranslations[key][lang];
        updated++;
      }
    });

    saveJSON(lang, data);
    console.log(`  ✅ Updated ${updated} authentication keys\n`);
  });

  console.log('✨ Done! Authentication pages are now fully translated.');
}

main();
