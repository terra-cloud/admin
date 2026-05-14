<template>
  <div class="space-y-3">
    <div
      v-for="payment in payments"
      :key="payment.id"
      class="bg-white rounded-xl shadow-soft p-4 hover:shadow-lifted transition-shadow cursor-pointer border border-gray-100/50"
      @click="$emit('view', payment.id)"
    >
      <div class="flex items-start gap-3">
        <img
          v-if="getUser(payment)?.profileImage"
          :src="getUser(payment).profileImage"
          class="w-12 h-12 rounded-full object-cover shrink-0"
          alt=""
          loading="lazy"
        />
        <div v-else class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold shrink-0">
          {{ getUserInitials(payment) }}
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div>
              <p class="text-sm font-semibold text-text-light truncate">{{ getUserName(payment) }}</p>
              <p class="text-xs text-text-muted-light font-mono">#{{ getShortId(payment.invoiceID) }}</p>
            </div>
            <PaymentStatusBadge :status="getStatus(payment)" />
          </div>
          <div class="mt-2 flex items-center justify-between">
            <span class="text-base font-bold text-primary tabular-nums">₱{{ formatPrice(getAmount(payment)) }}</span>
            <PaymentTypeBadge :type="getPaymentType(payment)" />
          </div>
          <div class="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
            <span class="text-[10px] text-text-muted-light">{{ formatDate(getCreatedAt(payment)) }}</span>
            <span class="text-primary text-xs font-medium">View Details →</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import PaymentStatusBadge from './PaymentStatusBadge.vue';
import PaymentTypeBadge from './PaymentTypeBadge.vue';

export default {
  components: { PaymentStatusBadge, PaymentTypeBadge },
  props: {
    payments: { type: Array, default: () => [] },
    usersMap: { type: Object, default: () => ({}) }
  },
  emits: ['view'],
  methods: {
    getUser(payment) {
      return this.usersMap[payment.userID] || {};
    },
    getUserName(payment) {
      const u = this.getUser(payment);
      return [u.firstname, u.lastname].filter(Boolean).join(' ') || '—';
    },
    getUserInitials(payment) {
      const u = this.getUser(payment);
      const f = (u.firstname || '?')[0];
      const l = (u.lastname || '?')[0];
      return (f + l).toUpperCase();
    },
    getAmount(payment) {
      return payment.paymentData?.amount || 0;
    },
    getStatus(payment) {
      return payment.paymentData?.status || '';
    },
    getPaymentType(payment) {
      return payment.paymentData?.type || '';
    },
    getCreatedAt(payment) {
      return payment.createdAt || payment.paymentData?.date;
    },
    getShortId(id) {
      return (id || '').slice(-8);
    },
    formatPrice(n) {
      if (n == null) return '0';
      return Number(n).toLocaleString();
    },
    formatDate(date) {
      if (!date) return '—';
      const d = typeof date === 'string' ? new Date(date) : (date.toDate ? date.toDate() : new Date(date));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    }
  }
};
</script>
