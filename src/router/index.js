import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Outreach from '../views/Outreach.vue'
import Positions from '../views/Positions.vue'
import AllCandidates from '../views/AllCandidates.vue'
import login from '../views/login.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'login',
    component: login
  },
  {
    path: '/dashboard',
    name: 'Home',
    component: Home
  },
  {
    path: '/outreach',
    name: 'outreach',
    component: Outreach
  },
  {
    path: '/positions',
    name: 'Positions',
    component: Positions
  },
  {
    path: '/candidates',
    name: 'Candidates',
    component: AllCandidates
  },
  {
    path: '*',
    name: 'error',
    component: Home
  }
  // {
  //   path: '/about',
  //   name: 'About',
  //   // route level code-splitting
  //   // this generates a separate chunk (about.[hash].js) for this route
  //   // which is lazy-loaded when the route is visited.
  //   component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  // }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
