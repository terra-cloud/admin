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
    {
        path:'/admins/:id/edit',
        component: () => import('@/pages/admins/edit.vue'),
        name:'adminEdit',
        meta: {
            layout: 'LayoutDefault',
            requiresAuth:true
        }
    },
]
