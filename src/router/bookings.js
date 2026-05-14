export default [
  {
    path: '/bookings',
    component: () => import('@/pages/bookings/index.vue'),
    name: 'bookings',
    meta: {
      layout: 'LayoutDefault',
      requiresAuth: true
    }
  }
]
