<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="pa-4">
            <v-icon icon="mdi-chart-line" class="mr-2" />
            <span class="text-h6">{{ t('analytics.title') }}</span>
          </v-card-title>
          <v-divider></v-divider>
          <v-card-text class="pa-4">
            <v-row>
              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4">
                  <div class="text-h6 mb-4">{{ t('analytics.overallStats') }}</div>
                  <v-list>
                    <v-list-item>
                      <v-list-item-title>{{ t('analytics.totalTasks') }}</v-list-item-title>
                      <template v-slot:append>
                        <span class="text-h6">{{ totalTasks }}</span>
                      </template>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>{{ t('analytics.completedTasks') }}</v-list-item-title>
                      <template v-slot:append>
                        <span class="text-h6 text-success">{{ completedTasks }}</span>
                      </template>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>{{ t('analytics.inProgress') }}</v-list-item-title>
                      <template v-slot:append>
                        <span class="text-h6 text-primary">{{ activeTasks }}</span>
                      </template>
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>{{ t('analytics.completionRate') }}</v-list-item-title>
                      <template v-slot:append>
                        <span class="text-h6">{{ completionRate }}%</span>
                      </template>
                    </v-list-item>
                  </v-list>
                  <v-progress-linear 
                    :model-value="completionRate" 
                    color="success"
                    height="10"
                    rounded
                    class="mt-2"
                  />
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card variant="outlined" class="pa-4">
                  <div class="text-h6 mb-4">{{ t('analytics.byPriority') }}</div>
                  <v-list>
                    <v-list-item>
                      <v-list-item-title>{{ t('tasks.high') }}</v-list-item-title>
                      <template v-slot:append>
                        <span class="text-h6 text-error">{{ highPriority }}</span>
                      </template>
                      <v-progress-linear 
                        :model-value="(highPriority / totalTasks) * 100" 
                        color="error"
                        height="6"
                        class="mt-2"
                      />
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>{{ t('tasks.medium') }}</v-list-item-title>
                      <template v-slot:append>
                        <span class="text-h6 text-warning">{{ mediumPriority }}</span>
                      </template>
                      <v-progress-linear 
                        :model-value="(mediumPriority / totalTasks) * 100" 
                        color="warning"
                        height="6"
                        class="mt-2"
                      />
                    </v-list-item>
                    <v-list-item>
                      <v-list-item-title>{{ t('tasks.low') }}</v-list-item-title>
                      <template v-slot:append>
                        <span class="text-h6 text-success">{{ lowPriority }}</span>
                      </template>
                      <v-progress-linear 
                        :model-value="(lowPriority / totalTasks) * 100" 
                        color="success"
                        height="6"
                        class="mt-2"
                      />
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>
            </v-row>

            <v-card variant="outlined" class="pa-4 mt-4">
              <div class="text-h6 mb-4">{{ t('analytics.productivity') }}</div>
              <v-list>
                <v-list-item>
                  <v-list-item-title>{{ t('analytics.tasksLast30Days') }}</v-list-item-title>
                  <template v-slot:append>
                    <span class="text-h6">{{ tasksLastMonth }}</span>
                  </template>
                </v-list-item>
                <v-list-item>
                  <v-list-item-title>{{ t('analytics.avgCompletionTime') }}</v-list-item-title>
                  <template v-slot:append>
                    <span class="text-h6">{{ t('analytics.avgDays', { days: 5 }) }}</span>
                  </template>
                </v-list-item>
              </v-list>
            </v-card>
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

const tasks = computed(() => store.getters['tasks/allTasks'])
const totalTasks = computed(() => store.getters['tasks/totalCount'])
const completedTasks = computed(() => store.getters['tasks/completedCount'])
const activeTasks = computed(() => store.getters['tasks/activeCount'])
const completionRate = computed(() => store.getters['tasks/completionRate'])
const highPriority = computed(() => store.getters['tasks/highPriorityCount'])
const mediumPriority = computed(() => store.getters['tasks/mediumPriorityCount'])
const lowPriority = computed(() => store.getters['tasks/lowPriorityCount'])

const tasksLastMonth = computed(() => {
  const oneMonthAgo = new Date()
  oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1)
  return tasks.value.filter(t => new Date(t.dueDate) > oneMonthAgo).length
})
</script>