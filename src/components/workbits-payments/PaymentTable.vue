<template>
  <div class="bg-white rounded-xl shadow-soft overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
            <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Invoice</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">User</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Email</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Amount</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Type</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Status</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Date</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-text-muted-light uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="payment in payments"
            :key="payment.id"
            class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
            @click="$emit('view', payment.id)"
          >
            <td class="px-4 py-4">
              <span class="text-sm font-medium text-text-light font-mono">#{{ getShortId(payment.invoiceID) }}</span>
            </td>
            <td class="px-4 py-4">
              <div class="flex items-center gap-2.5">
                <img
                  v-if="getUser(payment)?.profileImage"
                  :src="getUser(payment).profileImage"
                  class="w-8 h-8 rounded-full object-cover shrink-0"
                  alt=""
                  loading="lazy"
                />
                <div v-else class="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold shrink-0">
                  {{ getUserInitials(payment) }}
                </div>
                <span class="text-sm text-text-light truncate max-w-[140px]">{{ getUserName(payment) }}</span>
              </div>
            </td>
            <td class="px-4 py-4">
              <span class="text-sm text-text-muted-light truncate max-w-[160px] block">{{ getUserEmail(payment) }}</span>
            </td>
            <td class="px-4 py-4">
              <span class="text-sm font-semibold text-text-light tabular-nums">₱{{ formatPrice(getAmount(payment)) }}</span>
            </td>
            <td class="px-4 py-4">
              <PaymentTypeBadge :type="getPaymentType(payment)" />
            </td>
            <td class="px-4 py-4">
              <PaymentStatusBadge :status="getStatus(payment)" />
            </td>
            <td class="px-4 py-4">
              <span class="text-xs text-text-muted-light whitespace-nowrap">{{ formatDate(getCreatedAt(payment)) }}</span>
            </td>
            <td class="px-4 py-4 text-right">
              <div class="relative inline-block" @click.stop>
                <button
                  class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-text-muted-light"
                  @click="toggleMenu(payment.id)"
                >
                  <span class="material-symbols-outlined text-lg">more_vert</span>
                </button>
                <div
                  v-if="openMenuId === payment.id"
                  class="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lifted border border-gray-100 py-1 min-w-[190px] z-20"
                >
                  <button class="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-light hover:bg-gray-50 text-left" @click="closeAndEmit('view', payment.id)">
                    <span class="material-symbols-outlined text-lg text-text-muted-light">visibility</span>
                    View Details
                  </button>
                  <button v-if="getCheckoutUrl(payment)" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-primary hover:bg-blue-50 text-left" @click="closeAndEmit('openCheckout', payment)">
                    <span class="material-symbols-outlined text-lg">open_in_new</span>
                    Open Checkout URL
                  </button>
                  <button class="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-light hover:bg-gray-50 text-left" @click="closeAndEmit('copyInvoice', payment.invoiceID)">
                    <span class="material-symbols-outlined text-lg">content_copy</span>
                    Copy Invoice ID
                  </button>
                  <button class="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-light hover:bg-gray-50 text-left" @click="closeAndEmit('copyPayment', getPaymentId(payment))">
                    <span class="material-symbols-outlined text-lg">content_copy</span>
                    Copy Payment ID
                  </button>
                  <button class="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-light hover:bg-gray-50 text-left" @click="closeAndEmit('print', payment)">
                    <span class="material-symbols-outlined text-lg">print</span>
                    Print Receipt
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
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
  emits: ['view', 'openCheckout', 'copyInvoice', 'copyPayment', 'print'],
  data() {
    return {
      openMenuId: null
    };
  },
  methods: {
    toggleMenu(id) {
      this.openMenuId = this.openMenuId === id ? null : id;
    },
    closeAndEmit(action, data) {
      this.openMenuId = null;
      this.$emit(action, data);
    },
    getUser(payment) {
      return this.usersMap[payment.userID] || {};
    },
    getUserName(payment) {
      const u = this.getUser(payment);
      return [u.firstname, u.lastname].filter(Boolean).join(' ') || '—';
    },
    getUserEmail(payment) {
      return this.getUser(payment).email || '—';
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
    getPaymentId(payment) {
      return payment.paymentData?.id || '';
    },
    getCheckoutUrl(payment) {
      return payment.paymentData?.url || '';
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
  },
  watch: {
    payments() {
      this.openMenuId = null;
    }
  }
};
</script>
