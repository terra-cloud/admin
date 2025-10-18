import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import axios from "axios";

import auth from './auth'
import dashboard from './dashboard';
import users from './users';
import jobs from './jobs';
import news from './news';
const routes = [
    ...auth,
    ...dashboard,
    ...users,
    ...jobs,
    ...news
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach(async (to, from, next) => {
  const baseURL = import.meta.env.VITE_API_SUPPORT_URL;

  // Add token interceptor only once (not on every route change)
  if (!axios.interceptors.request.handlers.length) {
    axios.interceptors.request.use(function (config) {
      const token = localStorage.getItem("token");
      if (token) config.headers.Authorization = "Bearer " + token;
      return config;
    });
  }

  const excludeRoutes = ["login", "signup"];

  // ✅ Skip auth check for excluded routes
  if (excludeRoutes.includes(to.name)) {
    return next();
  }

  try {
    const { data } = await axios.get(`${baseURL}/api/auth/check-user`);

    // If the route requires auth and user is not authenticated
    if (to.matched.some((record) => record.meta.requiresAuth) && !data) {
      return next({
        name: "login",
        query: { redirect: to.fullPath },
      });
    }

    // Otherwise proceed
    return next();
  } catch (error) {
    // If check-user API fails, redirect to login
    return next({
      name: "login",
      query: { redirect: to.fullPath },
    });
  }
});

export default router
