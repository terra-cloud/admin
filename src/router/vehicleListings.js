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
    {
        path:'/vehicle-listings/:id',
        component: () => import('@/pages/vehicle-listings/_id.vue'),
        name:'vehicleListingDetails',
        meta: {
            layout: 'LayoutDefault',
            requiresAuth:true
        }
    },
]
