<template>
  <div class="bg-white rounded-2xl shadow-soft p-6 border border-gray-100/50 printable-receipt">
    <div class="text-center border-b border-gray-200 pb-4 mb-4">
      <h3 class="text-lg font-bold text-text-light">Payment Receipt</h3>
      <p class="text-xs text-text-muted-light mt-1">Invoice #{{ invoiceId }}</p>
    </div>

    <div class="space-y-4">
      <div>
        <p class="text-xs text-text-muted-light uppercase tracking-wider font-medium mb-2">User Information</p>
        <p class="text-sm font-semibold text-text-light">{{ userName || '—' }}</p>
        <p class="text-xs text-text-muted-light">{{ userEmail || '—' }}</p>
      </div>

      <div class="border-t border-gray-100 pt-4">
        <p class="text-xs text-text-muted-light uppercase tracking-wider font-medium mb-2">Payment Information</p>
        <div class="space-y-2">
          <div class="flex justify-between text-sm">
            <span class="text-text-muted-light">Amount</span>
            <span class="font-bold text-text-light">₱{{ formatPrice(amount) }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-text-muted-light">Status</span>
            <PaymentStatusBadge :status="status" />
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-text-muted-light">Type</span>
            <PaymentTypeBadge :type="paymentType" />
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-text-muted-light">Payment ID</span>
            <span class="text-text-light font-mono text-xs">{{ paymentId || '—' }}</span>
          </div>
          <div class="flex justify-between text-sm">
            <span class="text-text-muted-light">Invoice ID</span>
            <span class="text-text-light font-mono text-xs">{{ invoiceId || '—' }}</span>
          </div>
        </div>
      </div>

      <div class="border-t border-gray-100 pt-4">
        <p class="text-xs text-text-muted-light uppercase tracking-wider font-medium mb-2">Timestamps</p>
        <div class="space-y-1 text-xs">
          <div class="flex justify-between">
            <span class="text-text-muted-light">Payment Date</span>
            <span class="text-text-light">{{ paymentDate }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-text-muted-light">Created</span>
            <span class="text-text-light">{{ createdDate }}</span>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-6 pt-4 border-t border-gray-200 text-center text-[10px] text-text-muted-light">
      Generated on {{ generatedDate }}
    </div>
  </div>
</template>

<script>
import PaymentStatusBadge from './PaymentStatusBadge.vue';
import PaymentTypeBadge from './PaymentTypeBadge.vue';

export default {
  components: { PaymentStatusBadge, PaymentTypeBadge },
  props: {
    invoiceId: { type: String, default: '' },
    paymentId: { type: String, default: '' },
    amount: { type: Number, default: 0 },
    status: { type: String, default: '' },
    paymentType: { type: String, default: '' },
    userName: { type: String, default: '' },
    userEmail: { type: String, default: '' },
    paymentDate: { type: String, default: '—' },
    createdDate: { type: String, default: '—' }
  },
  computed: {
    generatedDate() {
      return new Date().toLocaleString('en-US', {
        month: 'short', day: 'numeric', year: 'numeric',
        hour: '2-digit', minute: '2-digit'
      });
    }
  },
  methods: {
    formatPrice(n) {
      if (n == null) return '0';
      return Number(n).toLocaleString();
    }
  }
};
</script>
