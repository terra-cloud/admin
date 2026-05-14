<template>
  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border" :class="badgeClasses">
    {{ label }}
  </span>
</template>

<script>
export default {
  props: {
    type: { type: String, default: '' }
  },
  computed: {
    typeKey() {
      return (this.type || '').toLowerCase();
    },
    label() {
      const labels = { add_fund: 'Add Fund', subscription: 'Subscription', withdrawal: 'Withdrawal' };
      return labels[this.typeKey] || this.type || '—';
    },
    badgeClasses() {
      const map = {
        add_fund: 'bg-blue-50 text-blue-700 border-blue-200/50',
        subscription: 'bg-purple-50 text-purple-700 border-purple-200/50',
        withdrawal: 'bg-orange-50 text-orange-700 border-orange-200/50'
      };
      return map[this.typeKey] || 'bg-gray-50 text-gray-500 border-gray-200/50';
    }
  }
};
</script>
