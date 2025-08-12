export default[
    {
        path:'/news',
        component: () => import('@/pages/news/index.vue'),
        name:'news',
        meta: {
            layout: 'LayoutDefault',
            requiresAuth:true
        }
    },
]