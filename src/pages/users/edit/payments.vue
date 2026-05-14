<template>
  <div>
    <div v-if="loading" class="space-y-3">
      <div v-for="n in 3" :key="n" class="bg-white rounded-xl shadow-soft p-5 animate-pulse">
        <div class="flex gap-4">
          <div class="flex-1 space-y-3">
            <div class="h-4 bg-gray-200 rounded w-1/3"></div>
            <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <div v-else-if="payments.length === 0" class="bg-white rounded-xl shadow-soft p-8 text-center border border-dashed border-gray-200">
      <span class="material-symbols-outlined text-4xl text-text-muted-light">payments</span>
      <h3 class="text-base font-semibold text-text-light mt-3">No payments found</h3>
      <p class="text-sm text-text-muted-light mt-1">This user has no payment transactions yet.</p>
    </div>

    <div v-else class="space-y-3">
      <div class="flex items-center justify-between mb-2">
        <p class="text-sm text-text-muted-light">{{ payments.length }} payment{{ payments.length !== 1 ? 's' : '' }}</p>
        <div class="flex items-center gap-3 text-sm">
          <span class="text-text-muted-light">Total:</span>
          <span class="font-bold text-primary tabular-nums">₱{{ formatPrice(totalAmount) }}</span>
        </div>
      </div>

      <div v-for="payment in payments" :key="payment.id" class="bg-white rounded-xl shadow-soft p-4 hover:shadow-lifted transition-shadow border border-gray-100/50">
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0 flex-1">
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-sm font-semibold text-text-light">₱{{ formatPrice(payment.paymentData?.amount) }}</span>
              <PaymentStatusBadge :status="payment.paymentData?.status" />
              <PaymentTypeBadge :type="payment.paymentData?.type" />
            </div>
            <div class="mt-1.5 flex items-center gap-3 text-xs text-text-muted-light">
              <span class="font-mono">#{{ (payment.invoiceID || '').slice(-8) }}</span>
              <span>{{ formatDate(payment.createdAt) }}</span>
            </div>
          </div>
          <router-link
            :to="`/workbits-payments/${payment.id}`"
            class="shrink-0 inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-primary hover:bg-primary/5 transition-colors"
          >
            View
            <span class="material-symbols-outlined text-sm">chevron_right</span>
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import WorkbitsPaymentsDataService from '@/services/WorkbitsPaymentsDataService';
import PaymentStatusBadge from '@/components/workbits-payments/PaymentStatusBadge.vue';
import PaymentTypeBadge from '@/components/workbits-payments/PaymentTypeBadge.vue';

export default {
  components: { PaymentStatusBadge, PaymentTypeBadge },
  props: {
    user: { type: Object, required: true }
  },
  data() {
    return {
      payments: [],
      loading: true,
      error: null,
      unsubscribe: null
    };
  },
  computed: {
    totalAmount() {
      return this.payments.reduce((sum, p) => sum + Number(p.paymentData?.amount || 0), 0);
    }
  },
  methods: {
    formatPrice(n) {
      if (n == null) return '0';
      return Number(n).toLocaleString();
    },
    formatDate(date) {
      if (!date) return '—';
      const d = typeof date === 'string' ? new Date(date) : (date.toDate ? date.toDate() : new Date(date));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    fetchPayments() {
      if (!this.user?.id) return;
      this.loading = true;
      this.error = null;
      if (this.unsubscribe) this.unsubscribe();
      this.unsubscribe = WorkbitsPaymentsDataService.getByUserId(
        this.user.id,
        (payments) => {
          this.payments = payments;
          this.loading = false;
        },
        (error) => {
          this.error = error.message || 'Failed to load payments';
          this.loading = false;
        }
      );
    }
  },
  watch: {
    'user.id'() {
      this.fetchPayments();
    }
  },
  mounted() {
    this.fetchPayments();
  },
  beforeUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }
};
</script>

<style scoped>
@reference "tailwindcss";
</style>
