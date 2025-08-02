import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router'
import auth from './auth'

const routes = [
    ...auth,
]

const router = createRouter({
  history: createWebHistory(),
  routes
})


router.beforeEach((to, from, next) => {
    const baseURL = import.meta.env.VITE_API_SUPPORT_URL;
    // axios.interceptors.request.use(function(config) {
    //   const token = localStorage.getItem('token')
    //   if (token) config.headers.Authorization='Bearer '+token
    //   return config;
    // });
    const excludeRoutes = ['login', 'signup']
    if(excludeRoutes.some(item => item == to.name)) next();
    // axios.get(`${baseURL}/api/admin/auth/check-user`).then(({ data }) => {
    //   if (to.matched.some((record) => record.meta.requiresAuth)) {
    //     if (!data) {
    //       next({
    //         name: "login",
    //         query: { redirect: to.fullPath },
    //       });
    //     } else {
    //       next();
    //     }
    //   } 
    // })
    // .catch(error => {
    //   next({
    //     name: "login",
    //     query: { redirect: to.fullPath },
    //   });
    // });
});

export default router
