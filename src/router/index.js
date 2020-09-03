import Vue from 'vue'
import VueRouter from 'vue-router'
import StartGame from '../components/StartGame'
import Dashboard from "../components/Dashboard"

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'StartGame',
    component: StartGame
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    props: true,
    component: Dashboard
  }
]

const router = new VueRouter({
  routes
})

export default router
