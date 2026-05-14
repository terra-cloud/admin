export default [
  {
    path: '/workbits-payments',
    component: () => import('@/pages/workbits-payments/index.vue'),
    name: 'workbitsPayments',
    meta: {
      layout: 'LayoutDefault',
      requiresAuth: true
    }
  },
  {
    path: '/workbits-payments/:id',
    component: () => import('@/pages/workbits-payments/_id.vue'),
    name: 'workbitsPaymentDetails',
    meta: {
      layout: 'LayoutDefault',
      requiresAuth: true
    }
  }
]
