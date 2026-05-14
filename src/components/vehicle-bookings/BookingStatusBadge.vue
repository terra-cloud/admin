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
      return (this.status || '').toLowerCase();
    },
    label() {
      const labels = { active: 'Active', pending: 'Pending', completed: 'Completed', cancelled: 'Cancelled' };
      return labels[this.statusKey] || this.status || 'Unknown';
    },
    badgeClasses() {
      const map = {
        active: 'bg-blue-50 text-blue-700 border-blue-200/50',
        pending: 'bg-amber-50 text-amber-700 border-amber-200/50',
        completed: 'bg-green-50 text-green-700 border-green-200/50',
        cancelled: 'bg-red-50 text-red-700 border-red-200/50'
      };
      return map[this.statusKey] || 'bg-gray-50 text-gray-500 border-gray-200/50';
    },
    dotClass() {
      const map = {
        active: 'bg-blue-400',
        pending: 'bg-amber-400',
        completed: 'bg-green-400',
        cancelled: 'bg-red-400'
      };
      return map[this.statusKey] || 'bg-gray-400';
    }
  }
};
</script>
