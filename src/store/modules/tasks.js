const defaultTasks = [
  {
    id: 1,
    title: 'Завершить дизайн дашборда',
    completed: false,
    priority: 'high',
    dueDate: '2024-01-20'
  },
  {
    id: 2,
    title: 'Настроить интеграцию API',
    completed: false,
    priority: 'medium',
    dueDate: '2024-01-22'
  },
  {
    id: 3,
    title: 'Провести код-ревью',
    completed: true,
    priority: 'low',
    dueDate: '2024-01-18'
  },
  {
    id: 4,
    title: 'Подготовить презентацию',
    completed: false,
    priority: 'high',
    dueDate: '2024-01-21'
  }
]

const loadTasks = () => {
  const saved = localStorage.getItem('tasks')
  if (saved) {
    return JSON.parse(saved)
  }
  return [...defaultTasks]
}

const saveTasks = (tasks) => {
  localStorage.setItem('tasks', JSON.stringify(tasks))
}

const isNotificationsEnabled = () => {
  const saved = localStorage.getItem('appSettings')
  if (saved) {
    const settings = JSON.parse(saved)
    return settings.notifications !== false
  }
  return true
}

const showNotification = (textKey, color) => {
  if (isNotificationsEnabled()) {
    window.dispatchEvent(new CustomEvent('show-snackbar', {
      detail: { textKey, color }
    }))
  }
}

export default {
  namespaced: true,
  
  state: () => ({
    tasks: loadTasks()
  }),
  
  getters: {
    allTasks: (state) => state.tasks,
    activeTasks: (state) => state.tasks.filter(t => !t.completed),
    completedTasks: (state) => state.tasks.filter(t => t.completed),
    totalCount: (state) => state.tasks.length,
    activeCount: (state) => state.tasks.filter(t => !t.completed).length,
    completedCount: (state) => state.tasks.filter(t => t.completed).length,
    completionRate: (state) => {
      if (state.tasks.length === 0) return 0
      return Math.round((state.tasks.filter(t => t.completed).length / state.tasks.length) * 100)
    },
    highPriorityCount: (state) => state.tasks.filter(t => t.priority === 'high').length,
    mediumPriorityCount: (state) => state.tasks.filter(t => t.priority === 'medium').length,
    lowPriorityCount: (state) => state.tasks.filter(t => t.priority === 'low').length,
    getTaskById: (state) => (id) => state.tasks.find(t => t.id === id)
  },
  
  mutations: {
    ADD_TASK(state, task) {
      state.tasks.unshift(task)
      saveTasks(state.tasks)
    },
    DELETE_TASK(state, taskId) {
      const index = state.tasks.findIndex(t => t.id === taskId)
      if (index !== -1) {
        state.tasks.splice(index, 1)
        saveTasks(state.tasks)
      }
    },
    TOGGLE_TASK(state, taskId) {
      const task = state.tasks.find(t => t.id === taskId)
      if (task) {
        task.completed = !task.completed
        saveTasks(state.tasks)
      }
    }
  },
  
  actions: {
    addTask({ commit }, task) {
      commit('ADD_TASK', task)
      showNotification('tasks.taskCreated', 'success')
    },
    deleteTask({ commit }, taskId) {
      commit('DELETE_TASK', taskId)
      showNotification('tasks.taskDeleted', 'error')
    },
    toggleTask({ commit, getters }, taskId) {
      const task = getters.getTaskById(taskId)
      if (task) {
        commit('TOGGLE_TASK', taskId)
        const textKey = !task.completed ? 'tasks.taskCompleted' : 'tasks.taskResumed'
        showNotification(textKey, 'success')
      }
    }
  }
}