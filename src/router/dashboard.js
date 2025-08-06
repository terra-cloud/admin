export default[
    {
        path:'/dashboard',
        component: () => import('@/pages/dashboard/index.vue'),
        name:'dashboard',
        meta: {
            layout: 'LayoutDefault',
            requiresAuth:true
        }
    },
]