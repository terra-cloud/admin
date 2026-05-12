import { createRouter, createWebHashHistory } from 'vue-router'
import { apiCheckUser } from '@/apis/auth'
import { getAccessToken, clearAuth, setAdmin } from '@/stores/auth'

import auth from './auth'
import dashboard from './dashboard';
import users from './users';
import admins from './admins';
import jobs from './jobs';
import news from './news';
import profile from './profile';
const routes = [
    ...auth,
    ...dashboard,
    ...users,
    ...admins,
    ...jobs,
    ...news,
    ...profile
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})


router.beforeEach(async (to, from, next) => {
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const isAuthPage = ['login', 'signup'].includes(to.name)
    const token = getAccessToken()

    if (requiresAuth) {
        if (!token) {
            return next({ name: 'login' })
        }
        try {
            const { data } = await apiCheckUser()
            if (data?.success) {
                setAdmin(data.admin)
                return next()
            }
            throw new Error('Auth check failed')
        } catch {
            clearAuth()
            return next({ name: 'login' })
        }
    }

    if (isAuthPage && token) {
        try {
            const { data } = await apiCheckUser()
            if (data?.success) {
                setAdmin(data.admin)
                return next({ name: 'dashboard' })
            }
        } catch {
            // Token invalid, stay on auth page
        }
    }

    next()
});

export default router
