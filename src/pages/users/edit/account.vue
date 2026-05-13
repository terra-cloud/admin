<template>
  <div class="bg-white rounded-xl shadow-soft overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-text-primary">Account Details</h2>
    </div>
    <div class="px-6 py-4 space-y-4">
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Account State</span>
        <span class="text-sm font-medium text-text-primary capitalize">
          <span
            class="px-2.5 py-0.5 rounded-full text-xs font-medium"
            :class="statusClass(user.account_state)"
          >{{ user.account_state }}</span>
        </span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Account Type</span>
        <span class="text-sm font-medium text-text-primary">{{ user.account_type === 2 ? 'Employer' : 'User' }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Language Preference</span>
        <span class="text-sm font-medium text-text-primary">{{ user.language_preference || '—' }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Email</span>
        <span class="text-sm font-medium text-text-primary">{{ user.email }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Phone Number</span>
        <span class="text-sm font-medium text-text-primary">{{ user.phone_number || '—' }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Created At</span>
        <span class="text-sm font-medium text-text-primary">{{ formatDate(user.created_at) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: { type: Object, required: true },
  },
  methods: {
    formatDate(date) {
      if (!date) return '—';
      return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
        hour: '2-digit', minute: '2-digit',
      });
    },
    statusClass(state) {
      if (state === 'active') return 'bg-green-100 text-green-700';
      if (state === 'suspended') return 'bg-red-100 text-red-700';
      return 'bg-gray-100 text-gray-700';
    },
  },
};
</script>
