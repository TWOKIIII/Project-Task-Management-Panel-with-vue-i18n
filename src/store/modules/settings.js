const loadSettings = () => {
  const saved = localStorage.getItem('appSettings')
  if (saved) {
    try {
      const parsed = JSON.parse(saved)
      return {
        notifications: parsed.notifications !== undefined ? parsed.notifications : true,
        theme: parsed.theme || 'dark',
        locale: parsed.locale || 'ru'
      }
    } catch (e) {
      console.error('Error loading settings:', e)
    }
  }
  return {
    notifications: true,
    theme: 'dark',
    locale: 'ru'
  }
}

const saveSettings = (settings) => {
  localStorage.setItem('appSettings', JSON.stringify(settings))
}

export default {
  namespaced: true,
  
  state: () => loadSettings(),
  
  getters: {
    notificationsEnabled: (state) => state.notifications,
    currentTheme: (state) => state.theme,
    currentLocale: (state) => state.locale
  },
  
  mutations: {
    SET_NOTIFICATIONS(state, value) {
      state.notifications = value
      saveSettings(state)
    },
    SET_THEME(state, value) {
      state.theme = value
      saveSettings(state)
    },
    SET_LOCALE(state, value) {
      state.locale = value
      saveSettings(state)
    }
  },
  
  actions: {
    toggleNotifications({ commit, state }) {
      commit('SET_NOTIFICATIONS', !state.notifications)
    },
    setTheme({ commit }, theme) {
      commit('SET_THEME', theme)
    },
    setLocale({ commit }, locale) {
      commit('SET_LOCALE', locale)
      localStorage.setItem('locale', locale)
    }
  }
}