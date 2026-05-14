<template>
  <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border" :class="badgeClasses">
    <span class="w-1.5 h-1.5 rounded-full" :class="dotClass"></span>
    {{ label }}
  </span>
</template>

<script>
export default {
  props: {
    status: { type: String, default: '' }
  },
  computed: {
    statusKey() {
      return (this.status || '').toUpperCase();
    },
    label() {
      const labels = { PAID: 'Paid', PENDING: 'Pending', FAILED: 'Failed', EXPIRED: 'Expired' };
      return labels[this.statusKey] || this.status || 'Unknown';
    },
    badgeClasses() {
      const map = {
        PAID: 'bg-green-50 text-green-700 border-green-200/50',
        PENDING: 'bg-amber-50 text-amber-700 border-amber-200/50',
        FAILED: 'bg-red-50 text-red-700 border-red-200/50',
        EXPIRED: 'bg-gray-50 text-gray-500 border-gray-200/50'
      };
      return map[this.statusKey] || 'bg-gray-50 text-gray-500 border-gray-200/50';
    },
    dotClass() {
      const map = {
        PAID: 'bg-green-400',
        PENDING: 'bg-amber-400',
        FAILED: 'bg-red-400',
        EXPIRED: 'bg-gray-400'
      };
      return map[this.statusKey] || 'bg-gray-400';
    }
  }
};
</script>
