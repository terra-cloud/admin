import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import axios from "axios";

import auth from './auth'
import dashboard from './dashboard';
import users from './users';
import jobs from './jobs';
const routes = [
    ...auth,
    ...dashboard,
    ...users,
    ...jobs
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach((to, from, next) => {
    const baseURL = import.meta.env.VITE_API_SUPPORT_URL;
    axios.interceptors.request.use(function(config) {
      const token = localStorage.getItem('token')
      if (token) config.headers.Authorization='Bearer '+token
      return config;
    });
    const excludeRoutes = ['login', 'signup']
    if(excludeRoutes.some(item => item == to.name)) next();
    axios.get(`${baseURL}/api/auth/check-user`).then(({ data }) => {
      if (to.matched.some((record) => record.meta.requiresAuth)) {
        if (!data) {
          next({
            name: "login",
            query: { redirect: to.fullPath },
          });
        } else {
          next();
        }
      } 
    })
    .catch(error => {
      next({
        name: "login",
        query: { redirect: to.fullPath },
      });
    });
});

export default router
