<template>
  <div class="bg-white rounded-xl shadow-soft overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-text-primary">Employer Details</h2>
    </div>
    <div class="px-6 py-4 space-y-4">
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Employer Type</span>
        <span class="text-sm font-medium text-text-primary capitalize">{{ emp.employerType || '—' }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Business Category</span>
        <span class="text-sm font-medium text-text-primary capitalize">{{ emp.businessCategory || '—' }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Badge</span>
        <span class="text-sm font-medium text-text-primary capitalize">{{ emp.employerBadge || '—' }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Average Rating</span>
        <span class="text-sm font-medium text-text-primary">{{ emp.averageRating ?? 0 }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Completed Jobs</span>
        <span class="text-sm font-medium text-text-primary">{{ emp.completedJobs ?? 0 }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Review Count</span>
        <span class="text-sm font-medium text-text-primary">{{ emp.reviewCount ?? 0 }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Payment Reliability</span>
        <span class="text-sm font-medium text-text-primary capitalize">{{ emp.paymentReliability || '—' }}</span>
      </div>
      <div class="flex justify-between py-3">
        <span class="text-sm text-text-muted-light">Preferred Payment Method</span>
        <span class="text-sm font-medium text-text-primary">{{ emp.preferredPaymentMethod || '—' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: { type: Object, required: true },
  },
  computed: {
    emp() {
      return this.user.employer_details || {};
    },
  },
};
</script>
