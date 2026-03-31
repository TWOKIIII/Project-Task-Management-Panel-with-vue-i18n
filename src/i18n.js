import { createI18n } from 'vue-i18n'
import ru from './locales/ru'
import en from './locales/en'
import de from './locales/de'
import fr from './locales/fr'
import be from './locales/be'
import uk from './locales/uk'
import pl from './locales/pl'
import kk from './locales/kk'

const savedLocale = localStorage.getItem('locale') || 'ru'

const i18n = createI18n({
  legacy: false,
  locale: savedLocale,
  fallbackLocale: 'ru',
  messages: {
    ru,
    en,
    de,
    fr,
    be,
    uk,
    pl,
    kk
  }
})

export default i18n