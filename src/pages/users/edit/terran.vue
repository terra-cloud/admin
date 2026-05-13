<template>
  <div class="bg-white rounded-xl shadow-soft overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-text-primary">Terran Details</h2>
    </div>
    <div class="px-6 py-4 space-y-4">
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Badge</span>
        <span class="text-sm font-medium text-text-primary capitalize">{{ td.badge || '—' }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Average Rating</span>
        <span class="text-sm font-medium text-text-primary">{{ td.averageRating ?? 0 }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Completed Jobs</span>
        <span class="text-sm font-medium text-text-primary">{{ td.completedJobs ?? 0 }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Review Count</span>
        <span class="text-sm font-medium text-text-primary">{{ td.reviewCount ?? 0 }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Cancellation Count</span>
        <span class="text-sm font-medium text-text-primary">{{ td.cancellationCount ?? 0 }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Hourly Rate</span>
        <span class="text-sm font-medium text-text-primary">{{ formatCurrency(td.hourlyRate) }}</span>
      </div>
      <div v-if="td.skills?.length" class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Skills</span>
        <span class="text-sm font-medium text-text-primary text-right">{{ td.skills.map(formatText).join(', ') }}</span>
      </div>
      <div v-if="td.certifications?.length" class="flex justify-between py-3">
        <span class="text-sm text-text-muted-light">Certifications</span>
        <span class="text-sm font-medium text-text-primary text-right">{{ td.certifications.join(', ') }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { formatText } from '@/utils/format';

export default {
  props: {
    user: { type: Object, required: true },
  },
  computed: {
    td() {
      return this.user.terran_details || {};
    },
  },
  methods: {
    formatText,
    formatCurrency(amount) {
      if (!amount && amount !== 0) return '—';
      return amount === 0 ? '—' : `₱${amount}`;
    },
  },
};
</script>
