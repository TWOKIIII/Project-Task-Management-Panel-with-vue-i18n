<template>
  <v-app :theme="currentTheme">
    <v-app-bar app color="primary" elevation="4">
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      
      <v-app-bar-title class="text-h5 font-weight-medium" style="cursor: pointer" @click="goToHome">
        <v-icon icon="mdi-view-dashboard" class="mr-2" />
        {{ t('app.title') }}
      </v-app-bar-title>
      
      <v-spacer></v-spacer>
      
      <!-- Переключение темы -->
      <v-btn @click="toggleTheme">
        <v-icon left>{{ themeIcon }}</v-icon>
        {{ themeText }}
      </v-btn>
      
      <!-- Выпадающее меню для смены языка -->
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn v-bind="props" class="ml-2" style="min-width: 90px;">
            <span :class="getFlagClass(currentLocale)" style="font-size: 18px;"></span>
            <span style="margin-left: 8px; margin-right: 4px;">{{ getLanguageCode(currentLocale) }}</span>
            <v-icon right size="small">mdi-chevron-down</v-icon>
          </v-btn>
        </template>
        <v-list style="min-width: 160px;">
          <v-list-item 
            v-for="lang in languages" 
            :key="lang.value" 
            @click="changeLanguage(lang.value)" 
            style="padding: 8px 16px;"
          >
            <div class="d-flex align-center">
              <span :class="lang.flagClass" style="font-size: 18px; margin-right: 12px;"></span>
              <span>{{ lang.title }}</span>
            </div>
          </v-list-item>
        </v-list>
      </v-menu>
      
      <v-menu offset-y>
        <template v-slot:activator="{ props }">
          <v-btn icon v-bind="props">
            <v-icon>mdi-account-circle</v-icon>
          </v-btn>
        </template>
        <v-list>
          <v-list-item>
            <v-list-item-title>Глеб Лятохов</v-list-item-title>
            <v-list-item-subtitle>admin@ProManagement.com</v-list-item-subtitle>
          </v-list-item>
          <v-divider></v-divider>
          <v-list-item @click="navigateTo('/settings')">
            <v-list-item-title>{{ t('navigation.settings') }}</v-list-item-title>
          </v-list-item>
          <v-list-item>
            <v-list-item-title>{{ t('navigation.logout') }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>

    <v-navigation-drawer v-model="drawer" app temporary>
      <v-list>
        <v-list-item 
          v-for="item in menuItems" 
          :key="item.path"
          :prepend-icon="item.icon"
          :active="currentRoute === item.path"
          @click="navigateTo(item.path)"
        >
          <v-list-item-title>{{ t(item.titleKey) }}</v-list-item-title>
        </v-list-item>
      </v-list>
      
      <template v-slot:append>
        <div class="pa-2">
          <v-btn block color="primary" variant="tonal" prepend-icon="mdi-plus" @click="createNewProject">
            {{ t('navigation.newProject') }}
          </v-btn>
        </div>
      </template>
    </v-navigation-drawer>

    <v-main>
      <router-view />
    </v-main>

    <v-snackbar v-model="snackbar.show" :color="snackbar.color" timeout="3000">
      {{ snackbar.text }}
      <template v-slot:actions>
        <v-btn variant="text" icon @click="snackbar.show = false">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-app>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const router = useRouter()
const route = useRoute()
const store = useStore()
const { t, locale } = useI18n()

const currentTheme = computed(() => store.state.settings.theme)
const currentLocale = computed(() => store.state.settings.locale || 'ru')

const themeIcon = computed(() => {
  return currentTheme.value === 'dark' ? 'mdi-weather-sunny' : 'mdi-weather-night'
})

const themeText = computed(() => {
  return currentTheme.value === 'dark' ? t('settings.lightTheme') : t('settings.darkTheme')
})

const toggleTheme = () => {
  const newTheme = currentTheme.value === 'dark' ? 'light' : 'dark'
  store.dispatch('settings/setTheme', newTheme)
}

// Список доступных языков
const languages = [
  { value: 'ru', title: 'Русский', flagClass: 'fi fi-ru' },
  { value: 'en', title: 'English', flagClass: 'fi fi-gb' },
  { value: 'de', title: 'Deutsch', flagClass: 'fi fi-de' },
  { value: 'fr', title: 'Français', flagClass: 'fi fi-fr' },
  { value: 'be', title: 'Беларуская', flagClass: 'fi fi-by' },
  { value: 'uk', title: 'Українська', flagClass: 'fi fi-ua' },
  { value: 'pl', title: 'Polski', flagClass: 'fi fi-pl' },
  { value: 'kk', title: 'Қазақша', flagClass: 'fi fi-kz' }
]

// Получить класс флага по коду языка
const getFlagClass = (locale) => {
  const lang = languages.find(l => l.value === locale)
  return lang ? lang.flagClass : 'fi fi-ru'
}

// Получить код языка для отображения (RU, EN, DE и т.д.)
const getLanguageCode = (locale) => {
  const codes = {
    ru: 'RU',
    en: 'EN',
    de: 'DE',
    fr: 'FR',
    be: 'BY',
    uk: 'UA',
    pl: 'PL',
    kk: 'KZ'
  }
  return codes[locale] || locale.toUpperCase()
}

// Функция смены языка
const changeLanguage = (newLocale) => {
  if (newLocale && newLocale !== currentLocale.value) {
    store.dispatch('settings/setLocale', newLocale)
    
    // Небольшая задержка для обновления i18n
    setTimeout(() => {
      if (store.getters['settings/notificationsEnabled']) {
        window.dispatchEvent(new CustomEvent('show-snackbar', {
          detail: { textKey: 'settings.saved', color: 'success' }
        }))
      }
    }, 100)
  }
}

// Синхронизация языка из store с i18n
watch(() => store.state.settings.locale, (newLocale) => {
  if (newLocale && newLocale !== locale.value) {
    locale.value = newLocale
  }
}, { immediate: true })

const drawer = ref(false)
const currentRoute = computed(() => route.path)

const menuItems = [
  { titleKey: 'navigation.dashboard', icon: 'mdi-view-dashboard', path: '/' },
  { titleKey: 'navigation.tasks', icon: 'mdi-format-list-checkbox', path: '/tasks' },
  { titleKey: 'navigation.analytics', icon: 'mdi-chart-line', path: '/analytics' },
  { titleKey: 'navigation.team', icon: 'mdi-account-group', path: '/team' },
  { titleKey: 'navigation.settings', icon: 'mdi-cog', path: '/settings' }
]

const navigateTo = (path) => {
  router.push(path)
  drawer.value = false
}

const goToHome = () => {
  router.push('/')
  drawer.value = false
}

const createNewProject = () => {
  if (store.getters['settings/notificationsEnabled']) {
    window.dispatchEvent(new CustomEvent('show-snackbar', {
      detail: { textKey: 'settings.saved', color: 'info' }
    }))
  }
}

const snackbar = ref({
  show: false,
  text: '',
  color: 'success'
})

const handleSnackbar = (event) => {
  const { text, textKey, color } = event.detail
  if (textKey) {
    snackbar.value = { show: true, text: t(textKey), color }
  } else {
    snackbar.value = { show: true, text, color }
  }
}

onMounted(() => {
  window.addEventListener('show-snackbar', handleSnackbar)
})
</script>

<style scoped>
:deep(.v-navigation-drawer) {
  transition: transform 0.2s ease;
}

:deep(.v-list-item--active) {
  background-color: rgba(var(--v-theme-primary), 0.1);
  color: rgb(var(--v-theme-primary));
}

:deep(.v-list-item--active .v-icon) {
  color: rgb(var(--v-theme-primary));
}

:deep(.v-list-item) {
  cursor: pointer;
}

:deep(.v-list-item-title) {
  font-size: 1rem;
  font-weight: 500;
}

:deep(.v-btn) {
  text-transform: none;
}
</style>