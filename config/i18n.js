import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'
import enTranslation from './en.json'
import esTranslation from './es.json'

var idioma = "en"
if (typeof window !== 'undefined') {
  if (localStorage.getItem('idioma') != null) {
    idioma = localStorage.getItem('idioma')
  }
}

const resources = {
  en: {
    translation: enTranslation
  },
  es: {
    translation: esTranslation
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: idioma,
    fallbackLng: "es",
    interpolation: {
      escapeValue: false
    }
  })

export default i18n;