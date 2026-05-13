export default[
    {
        path:'/service-bookings',
        component: () => import('@/pages/service-bookings/index.vue'),
        name:'serviceBookings',
        meta: {
            layout: 'LayoutDefault',
            requiresAuth:true
        }
    },
    {
        path:'/service-bookings/:id',
        component: () => import('@/pages/service-bookings/_id.vue'),
        name:'serviceBookingDetails',
        meta: {
            layout: 'LayoutDefault',
            requiresAuth:true
        }
    },
]
