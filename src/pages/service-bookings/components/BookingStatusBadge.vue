<template>
  <span
    class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold border"
    :class="badgeClasses"
  >
    <span class="w-1.5 h-1.5 rounded-full" :class="dotClass"></span>
    {{ label }}
  </span>
</template>

<script>
export default {
  props: {
    status: {
      type: String,
      default: ''
    }
  },
  computed: {
    statusKey() {
      return (this.status || '').toLowerCase();
    },
    label() {
      const labels = {
        pendingacceptance: 'Pending Acceptance',
        accepted: 'Accepted',
        ongoing: 'On Going',
        delivered: 'Delivered',
        completed: 'Completed',
        cancelled: 'Cancelled'
      };
      return labels[this.statusKey] || this.status || 'Unknown';
    },
    badgeClasses() {
      const map = {
        pendingacceptance: 'bg-amber-50 text-amber-700 border-amber-200/50',
        accepted: 'bg-blue-50 text-blue-700 border-blue-200/50',
        ongoing: 'bg-primary/10 text-primary border-primary/20',
        delivered: 'bg-purple-50 text-purple-700 border-purple-200/50',
        completed: 'bg-green-50 text-green-700 border-green-200/50',
        cancelled: 'bg-red-50 text-red-700 border-red-200/50'
      };
      return map[this.statusKey] || 'bg-gray-50 text-gray-500 border-gray-200/50';
    },
    dotClass() {
      const map = {
        pendingacceptance: 'bg-amber-400',
        accepted: 'bg-blue-400',
        ongoing: 'bg-primary',
        delivered: 'bg-purple-400',
        completed: 'bg-green-400',
        cancelled: 'bg-red-400'
      };
      return map[this.statusKey] || 'bg-gray-400';
    }
  }
};
</script>
