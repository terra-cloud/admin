<template>
  <div class="bg-white rounded-xl shadow-soft overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-text-primary">Preferences</h2>
    </div>
    <div class="px-6 py-4 space-y-4">
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Preferred Payment Method</span>
        <span class="text-sm font-medium text-text-primary">{{ user.preferred_payment_method || '—' }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Current Location</span>
        <span class="text-sm font-medium text-text-primary">{{ user.current_location || '—' }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Preferred Job Categories</span>
        <span class="text-sm font-medium text-text-primary text-right">{{ user.preferred_job_categories.join(', ') || '—' }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Employment Types</span>
        <span class="text-sm font-medium text-text-primary text-right">{{ td.employmentTypes.join(', ') || '—' }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Payment Types</span>
        <span class="text-sm font-medium text-text-primary text-right">{{ td.paymentTypes.join(', ') ||  '—' }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Time Preferences</span>
        <span class="text-sm font-medium text-text-primary text-right">{{ td.timePreferences.join(', ') || '—' }}</span>
      </div>
      <div class="flex justify-between py-3">
        <span class="text-sm text-text-muted-light">Working Hours</span>
        <span class="text-sm font-medium text-text-primary text-right">{{ td.workingHours.join(', ') || '—' }}</span>
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
    td() {
      return this.user.terran_details || {};
    },
  },
};
</script>
