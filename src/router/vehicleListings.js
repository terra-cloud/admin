export default[
    {
        path:'/vehicle-listings',
        component: () => import('@/pages/vehicle-listings/index.vue'),
        name:'vehicleListings',
        meta: {
            layout: 'LayoutDefault',
            requiresAuth:true
        }
    },
]
