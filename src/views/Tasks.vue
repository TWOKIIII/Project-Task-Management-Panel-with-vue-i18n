<template>
  <v-container fluid class="pa-6">
    <v-row>
      <v-col cols="12">
        <v-card elevation="2">
          <v-card-title class="d-flex align-center justify-space-between pa-4">
            <div>
              <v-icon icon="mdi-format-list-checkbox" class="mr-2" />
              <span class="text-h6">{{ t('tasks.myTasks') }}</span>
            </div>
            <v-btn color="primary" variant="flat" prepend-icon="mdi-plus" @click="openTaskDialog">
              {{ t('tasks.addTask') }}
            </v-btn>
          </v-card-title>
          
          <v-divider></v-divider>
          
          <v-list lines="two">
            <v-list-item 
              v-for="task in tasks" 
              :key="task.id"
              :class="{ 'completed-task': task.completed }"
              class="task-item"
            >
              <template v-slot:prepend>
                <v-checkbox 
                  :model-value="task.completed"
                  :color="task.priority === 'high' ? 'error' : 'primary'"
                  hide-details
                  @change="toggleTask(task.id)"
                />
              </template>
              
              <v-list-item-title :class="{ 'text-decoration-line-through': task.completed }" class="font-weight-medium">
                {{ task.title }}
              </v-list-item-title>
              
              <v-list-item-subtitle>
                <div class="d-flex align-center mt-1">
                  <v-chip :color="getPriorityColor(task.priority)" size="small" class="mr-2">
                    {{ getPriorityText(task.priority) }}
                  </v-chip>
                  <span class="text-caption">
                    <v-icon icon="mdi-calendar" size="12" class="mr-1" />
                    {{ task.dueDate }}
                  </span>
                </div>
              </v-list-item-subtitle>
              
              <template v-slot:append>
                <v-btn icon variant="text" size="small" @click="deleteTask(task.id)">
                  <v-icon icon="mdi-delete" size="18" />
                </v-btn>
              </template>
            </v-list-item>
          </v-list>
          
          <v-card-actions v-if="tasks.length === 0" class="justify-center pa-4">
            <div class="text-center text-grey">
              <v-icon icon="mdi-check-all" size="48" />
              <div class="mt-2">{{ t('tasks.noTasks') }}</div>
              <v-btn color="primary" variant="text" class="mt-2" @click="openTaskDialog">
                {{ t('tasks.createFirst') }}
              </v-btn>
            </div>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

    <v-dialog v-model="dialog" max-width="500px">
      <v-card>
        <v-card-title class="bg-primary pa-4 d-flex align-center justify-space-between">
          <span class="text-h6">{{ t('tasks.createTask') }}</span>
          <v-btn icon variant="text" @click="dialog = false">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-card-title>
        
        <v-card-text class="pa-4">
          <v-text-field
            v-model="newTask.title"
            :label="t('tasks.taskTitle')"
            variant="outlined"
            :rules="[v => !!v || t('tasks.taskTitle') + ' обязательно']"
          />
          
          <v-select
            v-model="newTask.priority"
            :label="t('tasks.priority')"
            :items="priorityOptions"
            variant="outlined"
            @update:model-value="updatePriorityOptions"
          />
          
          <v-text-field
            v-model="newTask.dueDate"
            :label="t('tasks.dueDate')"
            type="date"
            variant="outlined"
          />
        </v-card-text>
        
        <v-card-actions class="pa-4">
          <v-spacer></v-spacer>
          <v-btn variant="text" @click="dialog = false">{{ t('tasks.cancel') }}</v-btn>
          <v-btn color="primary" @click="addTask">{{ t('tasks.create') }}</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
import { useI18n } from 'vue-i18n'

const store = useStore()
const { t, locale } = useI18n()
const tasks = computed(() => store.getters['tasks/allTasks'])

const dialog = ref(false)

const newTask = ref({
  title: '',
  priority: 'medium',
  dueDate: ''
})

// Приоритеты с динамическими названиями
const priorityOptions = computed(() => [
  { title: t('tasks.high'), value: 'high' },
  { title: t('tasks.medium'), value: 'medium' },
  { title: t('tasks.low'), value: 'low' }
])

// Обновляем options при смене языка
const updatePriorityOptions = () => {
  // Просто вызываем для реактивности
}

// Следим за сменой языка и обновляем выбранный приоритет
watch(locale, () => {
  // Принудительно обновляем options через пересоздание
  const currentPriority = newTask.value.priority
  newTask.value.priority = currentPriority
})

const getPriorityColor = (priority) => {
  const colors = { high: 'error', medium: 'warning', low: 'success' }
  return colors[priority]
}

const getPriorityText = (priority) => {
  const texts = { high: t('tasks.high'), medium: t('tasks.medium'), low: t('tasks.low') }
  return texts[priority]
}

const toggleTask = (taskId) => {
  store.dispatch('tasks/toggleTask', taskId)
}

const deleteTask = (taskId) => {
  store.dispatch('tasks/deleteTask', taskId)
}

const openTaskDialog = () => {
  newTask.value = { title: '', priority: 'medium', dueDate: '' }
  dialog.value = true
}

const addTask = () => {
  if (!newTask.value.title) return
  
  const task = {
    id: Date.now(),
    title: newTask.value.title,
    completed: false,
    priority: newTask.value.priority,
    dueDate: newTask.value.dueDate || new Date().toISOString().split('T')[0]
  }
  
  store.dispatch('tasks/addTask', task)
  dialog.value = false
}
</script>

<style scoped>
.task-item {
  transition: background-color 0.2s ease;
}

.task-item:hover {
  background-color: rgba(var(--v-theme-primary), 0.05);
}

.completed-task {
  opacity: 0.7;
}

:deep(.v-list-item__prepend) {
  margin-right: 16px;
}

:deep(.v-chip) {
  font-size: 11px;
}
</style>