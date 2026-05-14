export default [
  {
    path: '/vehicle-bookings',
    component: () => import('@/pages/vehicle-bookings/index.vue'),
    name: 'vehicleBookings',
    meta: {
      layout: 'LayoutDefault',
      requiresAuth: true
    }
  },
  {
    path: '/vehicle-bookings/:id',
    component: () => import('@/pages/vehicle-bookings/_id.vue'),
    name: 'vehicleBookingDetails',
    meta: {
      layout: 'LayoutDefault',
      requiresAuth: true
    }
  }
]
