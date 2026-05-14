export default[
    {
        path:'/users/:id/edit',
        component: () => import('@/pages/users/edit.vue'),
        name:'userEdit',
        redirect: { name: 'userEditOverview' },
        meta: {
            layout: 'LayoutDefault',
            requiresAuth:true
        },
        children: [
            {
                path: 'overview',
                name: 'userEditOverview',
                component: () => import('@/pages/users/edit/overview.vue'),
            },
            {
                path: 'account',
                name: 'userEditAccount',
                component: () => import('@/pages/users/edit/account.vue'),
            },
            {
                path: 'verification',
                name: 'userEditVerification',
                component: () => import('@/pages/users/edit/verification.vue'),
            },
            {
                path: 'employer',
                name: 'userEditEmployer',
                component: () => import('@/pages/users/edit/employer.vue'),
            },
            {
                path: 'terran',
                name: 'userEditTerran',
                component: () => import('@/pages/users/edit/terran.vue'),
            },
            {
                path: 'payments',
                name: 'userEditPayments',
                component: () => import('@/pages/users/edit/payments.vue'),
            },
            {
                path: 'workbits',
                name: 'userEditWorkbits',
                component: () => import('@/pages/users/edit/workbits.vue'),
            },
            {
                path: 'preferences',
                name: 'userEditPreferences',
                component: () => import('@/pages/users/edit/preferences.vue'),
            },
        ],
    },
]