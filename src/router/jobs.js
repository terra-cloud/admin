export default[
    {
        path:'/job-postings',
        component: () => import('@/pages/jobs/JobPostings.vue'),
        name:'jobPostings',
        meta: {
            layout: 'LayoutDefault',
            requiresAuth:true
        }
    },
    {
        path:'/jobs/:jobId',
        component: () => import('@/pages/jobs/JobDetails.vue'),
        name:'jobDetails',
        meta: {
            layout: 'LayoutDefault',
            requiresAuth:true
        }
    },
]