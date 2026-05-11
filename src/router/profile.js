export default [
    {
        path: '/profile',
        component: () => import('@/pages/profile/index.vue'),
        name: 'profile',
        meta: {
            layout: 'LayoutDefault',
            requiresAuth: true
        },
        redirect: { name: 'profileInformation' },
        children: [
            {
                path: 'information',
                component: () => import('@/pages/profile/information.vue'),
                name: 'profileInformation',
                meta: {
                    layout: 'LayoutDefault',
                    requiresAuth: true
                }
            },
            {
                path: 'security',
                component: () => import('@/pages/profile/security.vue'),
                name: 'profileSecurity',
                meta: {
                    layout: 'LayoutDefault',
                    requiresAuth: true
                }
            }
        ]
    },
]
