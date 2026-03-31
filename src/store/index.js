import { createStore } from 'vuex'
import tasks from './modules/tasks'
import settings from './modules/settings'

export default createStore({
  modules: {
    tasks,
    settings
  }
})