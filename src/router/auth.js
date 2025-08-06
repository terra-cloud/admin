export default[
    {
        path:'/',
        component: () => import('@/pages/auth/login.vue'),
        name:'home',
        meta: {
            layout: 'LayoutAuth',
            requiresAuth:true
        }
    },
    {
        path:'/login',
        component: () => import('@/pages/auth/login.vue'),
        name:'login',
        meta: {layout: 'LayoutAuth'}
    },
    {
        path:'/signup',
        component: () => import('@/pages/auth/signup.vue'),
        name:'signup',
        meta: {layout: 'LayoutAuth'}
    },
]