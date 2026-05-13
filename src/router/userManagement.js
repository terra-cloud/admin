export default[
    {
        path:'/user-management',
        component: () => import('@/pages/user-management/index.vue'),
        name:'userManagement',
        meta: {
            layout: 'LayoutDefault',
            requiresAuth:true
        }
    },
    {
        path:'/users',
        redirect: { name: 'userManagement', query: { tab: 'users' } },
    },
    {
        path:'/admins',
        redirect: { name: 'userManagement', query: { tab: 'admins' } },
    },
]
