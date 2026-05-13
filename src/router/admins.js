export default[
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
