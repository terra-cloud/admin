export default[
    {
        path:'/admins',
        component: () => import('@/pages/admins/index.vue'),
        name:'admins',
        meta: {
            layout: 'LayoutDefault',
            requiresAuth:true
        }
    },
]
