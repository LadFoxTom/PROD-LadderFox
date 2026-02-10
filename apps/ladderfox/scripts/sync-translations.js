#!/usr/bin/env node

/**
 * Script to sync all translations to match Dutch (most complete)
 * Uses Dutch as reference and adds missing keys to other languages
 */

const fs = require('fs');
const path = require('path');

const TRANSLATIONS_DIR = 'src/translations';

// Simple translation mappings for common words
const quickTranslations = {
  // Common words that can be auto-translated
  'common': {
    fr: {
      'Yes': 'Oui',
      'No': 'Non',
      'Save': 'Enregistrer',
      'Cancel': 'Annuler',
      'Delete': 'Supprimer',
      'Edit': 'Modifier',
      'Close': 'Fermer',
      'Open': 'Ouvrir',
      'Back': 'Retour',
      'Next': 'Suivant',
      'Previous': 'Précédent',
      'Search': 'Rechercher',
      'Filter': 'Filtrer',
      'Sort': 'Trier',
      'Download': 'Télécharger',
      'Upload': 'Téléverser',
      'Loading': 'Chargement',
      'Error': 'Erreur',
      'Success': 'Succès',
      'Warning': 'Avertissement',
      'Info': 'Info',
    },
    de: {
      'Yes': 'Ja',
      'No': 'Nein',
      'Save': 'Speichern',
      'Cancel': 'Abbrechen',
      'Delete': 'Löschen',
      'Edit': 'Bearbeiten',
      'Close': 'Schließen',
      'Open': 'Öffnen',
      'Back': 'Zurück',
      'Next': 'Weiter',
      'Previous': 'Vorherige',
      'Search': 'Suchen',
      'Filter': 'Filtern',
      'Sort': 'Sortieren',
      'Download': 'Herunterladen',
      'Upload': 'Hochladen',
      'Loading': 'Laden',
      'Error': 'Fehler',
      'Success': 'Erfolg',
      'Warning': 'Warnung',
      'Info': 'Info',
    },
    es: {
      'Yes': 'Sí',
      'No': 'No',
      'Save': 'Guardar',
      'Cancel': 'Cancelar',
      'Delete': 'Eliminar',
      'Edit': 'Editar',
      'Close': 'Cerrar',
      'Open': 'Abrir',
      'Back': 'Volver',
      'Next': 'Siguiente',
      'Previous': 'Anterior',
      'Search': 'Buscar',
      'Filter': 'Filtrar',
      'Sort': 'Ordenar',
      'Download': 'Descargar',
      'Upload': 'Subir',
      'Loading': 'Cargando',
      'Error': 'Error',
      'Success': 'Éxito',
      'Warning': 'Advertencia',
      'Info': 'Info',
    }
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

function autoTranslate(dutchValue, enValue, targetLang) {
  // If we have English, try to use common translations
  if (enValue) {
    const commonWords = quickTranslations.common[targetLang];
    for (const [en, translated] of Object.entries(commonWords)) {
      if (enValue === en) {
        return translated;
      }
    }
  }
  
  // Return English value as fallback (better than nothing)
  return enValue || `[NL: ${dutchValue}]`;
}

function main() {
  console.log('🔄 Syncing translations to match Dutch...\n');

  // Load all translations
  const nl = loadJSON('nl');
  const en = loadJSON('en');
  const fr = loadJSON('fr');
  const de = loadJSON('de');
  const es = loadJSON('es');

  const nlKeys = Object.keys(nl);
  console.log(`📊 Dutch has ${nlKeys.length} keys (reference)\n`);

  // Sync each language
  const languages = [
    { code: 'fr', name: 'French', data: fr },
    { code: 'de', name: 'German', data: de },
    { code: 'es', name: 'Spanish', data: es }
  ];

  languages.forEach(({ code, name, data }) => {
    console.log(`🌐 Syncing ${name}...`);
    let added = 0;

    nlKeys.forEach(key => {
      if (!data[key]) {
        // Try to get English version first
        const enValue = en[key];
        const nlValue = nl[key];
        
        // Auto-translate or use English as fallback
        data[key] = autoTranslate(nlValue, enValue, code);
        added++;
      }
    });

    saveJSON(code, data);
    console.log(`  ✅ Added ${added} keys to ${code}.json`);
    console.log(`  📊 Total keys: ${Object.keys(data).length}\n`);
  });

  console.log('✨ Done! All languages now have the same keys as Dutch.');
  console.log('\n⚠️  Note: Some translations are auto-generated or use English as fallback.');
  console.log('📝 Review and improve these translations manually if needed.');
}

main();
