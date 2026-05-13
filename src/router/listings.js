export default[
    {
        path:'/listings',
        component: () => import('@/pages/listings/index.vue'),
        name:'listings',
        meta: {
            layout: 'LayoutDefault',
            requiresAuth:true
        }
    },
    {
        path:'/job-postings',
        redirect: { name: 'listings', query: { tab: 'jobs' } },
    },
    {
        path:'/vehicle-listings',
        redirect: { name: 'listings', query: { tab: 'vehicle-listings' } },
    },
]
