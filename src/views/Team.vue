<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="pa-4">
            <v-icon icon="mdi-account-group" class="mr-2" />
            <span class="text-h6">{{ t('team.title') }}</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <v-row>
              <v-col v-for="member in team" :key="member.name" cols="12" sm="6" md="4">
                <v-card variant="outlined" class="text-center pa-4">
                  <v-avatar size="80" class="mb-3">
                    <v-icon :icon="member.icon" size="64" :color="member.color" />
                  </v-avatar>
                  <div class="text-h6">{{ member.name }}</div>
                  <div class="text-subtitle-2 text-grey">{{ member.role }}</div>
                  <v-divider class="my-3"></v-divider>
                  <div class="text-caption">{{ t('team.tasksCompleted') }}: {{ member.completedTasks }}</div>
                  <v-progress-linear 
                    :model-value="member.progress" 
                    :color="member.color"
                    height="4"
                    class="mt-2"
                  />
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const store = useStore()
const { t } = useI18n()
const totalTasks = computed(() => store.getters['tasks/totalCount'])
const completedTasks = computed(() => store.getters['tasks/completedCount'])

const team = ref([
  { name: 'Глеб Лятохов', role: 'Team Lead', icon: 'mdi-account-cowboy-hat', color: 'primary', completedTasks: 0, progress: 0 },
  { name: 'Копнин Матвей', role: 'Frontend Developer', icon: 'mdi-account', color: 'success', completedTasks: 0, progress: 0 },
  { name: 'Межов Дмитрий', role: 'Backend Developer', icon: 'mdi-account', color: 'info', completedTasks: 0, progress: 0 },
  { name: 'Карлов Алексей', role: 'UI/UX Designer', icon: 'mdi-account', color: 'warning', completedTasks: 0, progress: 0 },
  { name: 'Корытин Андрей', role: 'QA Engineer', icon: 'mdi-account', color: 'secondary', completedTasks: 0, progress: 0 },
  { name: 'Утенков Иван', role: 'Project Manager', icon: 'mdi-account-tie', color: 'error', completedTasks: 0, progress: 0 }
])

const updateGlebStats = () => {
  const gleb = team.value.find(m => m.name === 'Глеб Лятохов')
  if (gleb) {
    gleb.completedTasks = completedTasks.value
    gleb.progress = totalTasks.value > 0 ? (completedTasks.value / totalTasks.value) * 100 : 0
  }
}

watch([totalTasks, completedTasks], () => {
  updateGlebStats()
})

onMounted(() => {
  updateGlebStats()
})
</script>