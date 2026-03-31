<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="pa-4">
            <v-icon icon="mdi-cog" class="mr-2" />
            <span class="text-h6">{{ t('settings.title') }}</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <v-list>
              <v-list-item>
                <v-list-item-title>{{ t('settings.notifications') }}</v-list-item-title>
                <v-list-item-subtitle>{{ t('settings.notificationsDesc') }}</v-list-item-subtitle>
                <template v-slot:append>
                  <v-switch 
                    :model-value="notificationsEnabled" 
                    color="primary" 
                    @update:model-value="toggleNotifications"
                  ></v-switch>
                </template>
              </v-list-item>
              
              <v-divider></v-divider>
              
              <v-list-item>
                <v-list-item-title>{{ t('settings.language') }}</v-list-item-title>
                <v-list-item-subtitle>{{ t('settings.languageDesc') }}</v-list-item-subtitle>
                <template v-slot:append>
                  <v-select
                    :model-value="currentLocaleValue"
                    :items="languageOptions"
                    variant="outlined"
                    density="compact"
                    style="width: 200px"
                    @update:model-value="changeLanguage"
                  >
                    <template v-slot:item="{ item }">
                      <div 
                        class="language-item"
                        @click="changeLanguage(item.raw.value)"
                      >
                        <span :class="item.raw.flagClass" style="font-size: 18px; margin-right: 12px;"></span>
                        <span>{{ item.raw.title }}</span>
                      </div>
                    </template>
                    <template v-slot:selection="{ item }">
                      <div class="d-flex align-center">
                        <span :class="item.raw.flagClass" style="font-size: 18px; margin-right: 12px;"></span>
                        <span>{{ item.raw.title }}</span>
                      </div>
                    </template>
                  </v-select>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const store = useStore()
const { t } = useI18n()

const notificationsEnabled = computed(() => store.getters['settings/notificationsEnabled'])
const currentLocaleValue = computed(() => {
  const locale = store.getters['settings/currentLocale']
  return locale || 'ru'
})

const languageOptions = [
  { value: 'ru', title: 'Русский', flagClass: 'fi fi-ru' },
  { value: 'en', title: 'English', flagClass: 'fi fi-gb' },
  { value: 'de', title: 'Deutsch', flagClass: 'fi fi-de' },
  { value: 'fr', title: 'Français', flagClass: 'fi fi-fr' },
  { value: 'be', title: 'Беларуская', flagClass: 'fi fi-by' },
  { value: 'uk', title: 'Українська', flagClass: 'fi fi-ua' },
  { value: 'pl', title: 'Polski', flagClass: 'fi fi-pl' },
  { value: 'kk', title: 'Қазақша', flagClass: 'fi fi-kz' }
]

const toggleNotifications = async () => {
  console.log('Toggle notifications called') // для отладки
  await store.dispatch('settings/toggleNotifications')
  const enabled = store.getters['settings/notificationsEnabled']
  console.log('Notifications enabled:', enabled) // для отладки
  if (enabled) {
    window.dispatchEvent(new CustomEvent('show-snackbar', {
      detail: { textKey: 'settings.notificationsOn', color: 'success' }
    }))
  }
}

const changeLanguage = (newLocale) => {
  if (newLocale) {
    store.dispatch('settings/setLocale', newLocale)
    
    setTimeout(() => {
      if (store.getters['settings/notificationsEnabled']) {
        window.dispatchEvent(new CustomEvent('show-snackbar', {
          detail: { textKey: 'settings.saved', color: 'success' }
        }))
      }
    }, 100)
  }
}
</script>

<style scoped>
.language-item {
  display: flex;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  width: 100%;
  border-radius: 4px;
}

.language-item:hover {
  background-color: rgba(0, 0, 0, 0.04);
}

:deep(.v-theme--dark .language-item:hover) {
  background-color: rgba(255, 255, 255, 0.08);
}
</style>