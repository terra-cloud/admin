export default[
    {
        path:'/users',
        component: () => import('@/pages/users/index.vue'),
        name:'users',
        meta: {
            layout: 'LayoutDefault',
            requiresAuth:true
        }
    },
]