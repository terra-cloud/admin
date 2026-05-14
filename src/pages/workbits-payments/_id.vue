<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6">
    <router-link to="/workbits-payments" class="inline-flex items-center gap-2 text-text-muted-light hover:text-text-light mb-6 transition-colors">
      <span class="material-symbols-outlined text-lg">arrow_back</span>
      Back to Payments
    </router-link>

    <div v-if="loading" class="space-y-4">
      <div class="bg-white rounded-xl shadow-soft p-6 animate-pulse space-y-4">
        <div class="h-6 bg-gray-200 rounded w-1/3"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        <div class="h-20 bg-gray-200 rounded"></div>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
      <span>{{ error }}</span>
      <button class="underline font-medium shrink-0 ml-4" @click="fetchData">Try Again</button>
    </div>

    <template v-else-if="payment">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-3 flex-wrap">
          <h1 class="text-xl font-bold text-text-light">
            Invoice #{{ getShortId(payment.invoiceID) }}
          </h1>
          <button
            class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-text-muted-light hover:bg-gray-100 transition-colors border border-gray-200"
            @click="copyId(payment.invoiceID)"
          >
            <span class="material-symbols-outlined text-sm">content_copy</span>
            {{ copied ? 'Copied!' : 'Copy Invoice' }}
          </button>
          <PaymentStatusBadge :status="payment.paymentData?.status" />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-8 space-y-6">
          <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-green-500">
              <p class="text-[10px] text-text-muted-light uppercase tracking-wider">Amount</p>
              <p class="text-xl sm:text-2xl font-bold text-green-600 mt-1 tabular-nums">₱{{ formatPrice(payment.paymentData?.amount) }}</p>
            </div>
            <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-primary">
              <p class="text-[10px] text-text-muted-light uppercase tracking-wider">Status</p>
              <div class="mt-1">
                <PaymentStatusBadge :status="payment.paymentData?.status" />
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-purple-500">
              <p class="text-[10px] text-text-muted-light uppercase tracking-wider">Type</p>
              <div class="mt-1">
                <PaymentTypeBadge :type="payment.paymentData?.type" />
              </div>
            </div>
            <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-amber-400">
              <p class="text-[10px] text-text-muted-light uppercase tracking-wider">Payment Date</p>
              <p class="text-sm font-semibold text-text-light mt-1">{{ formatDateTime(payment.paymentData?.date) }}</p>
            </div>
          </div>

          <PaymentUserCard :user="user" :userId="payment.userID" />

          <PaymentOverviewCard
            title="Payment Details"
            icon="info"
            :items="paymentInfoItems"
          />

          <div>
            <h3 class="text-sm font-semibold text-text-light mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-lg">receipt</span>
              Payment Receipt
            </h3>
            <div class="print-only" ref="receiptEl">
              <PaymentReceipt
                :invoiceId="getShortId(payment.invoiceID)"
                :paymentId="payment.paymentData?.id"
                :amount="payment.paymentData?.amount"
                :status="payment.paymentData?.status"
                :paymentType="payment.paymentData?.type"
                :userName="userName"
                :userEmail="user?.email"
                :paymentDate="formatDateTime(payment.paymentData?.date)"
                :createdDate="formatDateTime(payment.createdAt)"
              />
            </div>
          </div>
        </div>

        <div class="lg:col-span-4 space-y-6">
          <div class="sticky top-24 space-y-6">
            <div class="bg-white rounded-2xl shadow-soft p-5 border border-gray-100/50">
              <h3 class="text-sm font-semibold text-text-light mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-lg">tune</span>
                Actions
              </h3>
              <PaymentActions
                :checkoutUrl="payment.paymentData?.url"
                @openCheckout="openCheckout"
                @copyInvoice="copyId(payment.invoiceID)"
                @copyPayment="copyId(payment.paymentData?.id)"
                @print="printCurrentReceipt"
                @downloadPdf="downloadPdfReceipt"
              />
            </div>

            <div class="bg-white rounded-2xl shadow-soft p-5 border border-gray-100/50">
              <h3 class="text-sm font-semibold text-text-light mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-lg">analytics</span>
                Summary
              </h3>
              <div class="space-y-3">
                <div class="flex justify-between items-center py-2 border-b border-gray-100">
                  <span class="text-sm text-text-muted-light">Subtotal</span>
                  <span class="text-sm font-semibold text-text-light">₱{{ formatPrice(payment.paymentData?.amount) }}</span>
                </div>
                <div class="flex justify-between items-center py-2">
                  <span class="text-sm text-text-muted-light">Total</span>
                  <span class="text-lg font-bold text-primary">₱{{ formatPrice(payment.paymentData?.amount) }}</span>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-soft p-5 border border-gray-100/50">
              <h3 class="text-sm font-semibold text-text-light mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-lg">schedule</span>
                Timeline
              </h3>
              <div class="space-y-0">
                <div class="flex gap-3">
                  <div class="flex flex-col items-center">
                    <div class="w-6 h-6 rounded-full bg-green-500 flex items-center justify-center">
                      <span class="material-symbols-outlined text-white text-sm">add</span>
                    </div>
                    <div class="w-0.5 flex-1 bg-gray-100 my-1"></div>
                  </div>
                  <div class="pb-4">
                    <p class="text-sm font-medium text-text-light">Payment Created</p>
                    <p class="text-xs text-text-muted-light">{{ formatDateTime(payment.createdAt) }}</p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <div class="flex flex-col items-center">
                    <div class="w-6 h-6 rounded-full flex items-center justify-center" :class="isPaid ? 'bg-green-500' : 'bg-gray-100'">
                      <span class="material-symbols-outlined text-sm" :class="isPaid ? 'text-white' : 'text-gray-400'">paid</span>
                    </div>
                    <div class="w-0.5 flex-1 bg-gray-100 my-1"></div>
                  </div>
                  <div class="pb-4">
                    <p class="text-sm font-medium text-text-light">Payment {{ isPaid ? 'Completed' : 'Pending' }}</p>
                    <p class="text-xs text-text-muted-light">{{ isPaid ? formatDateTime(payment.paymentData?.date) : 'Awaiting payment' }}</p>
                  </div>
                </div>
                <div class="flex gap-3">
                  <div class="flex flex-col items-center">
                    <div class="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center">
                      <span class="material-symbols-outlined text-blue-600 text-sm">receipt_long</span>
                    </div>
                  </div>
                  <div>
                    <p class="text-sm font-medium text-text-light">Invoice Generated</p>
                    <p class="text-xs text-text-muted-light">{{ formatDateTime(payment.createdAt) }}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="bg-white rounded-xl shadow-soft p-12 text-center">
      <span class="material-symbols-outlined text-5xl text-text-muted-light">payments</span>
      <h3 class="text-lg font-semibold text-text-light mt-4">Payment not found</h3>
      <router-link to="/workbits-payments" class="text-primary text-sm mt-2 inline-block hover:underline">Back to payments</router-link>
    </div>

    <Toast :message="toastMessage" :type="toastType" :showConfirmButtons="false" id="" @cancel="clearToast" />
  </div>
</template>

<script>
import WorkbitsPaymentsDataService from '@/services/WorkbitsPaymentsDataService';
import PaymentStatusBadge from '@/components/workbits-payments/PaymentStatusBadge.vue';
import PaymentTypeBadge from '@/components/workbits-payments/PaymentTypeBadge.vue';
import PaymentOverviewCard from '@/components/workbits-payments/PaymentOverviewCard.vue';
import PaymentUserCard from '@/components/workbits-payments/PaymentUserCard.vue';
import PaymentReceipt from '@/components/workbits-payments/PaymentReceipt.vue';
import PaymentActions from '@/components/workbits-payments/PaymentActions.vue';
import Toast from '@/components/Toast.vue';

export default {
  components: {
    PaymentStatusBadge, PaymentTypeBadge, PaymentOverviewCard,
    PaymentUserCard, PaymentReceipt, PaymentActions, Toast
  },
  data() {
    return {
      payment: null,
      user: null,
      loading: true,
      error: null,
      copied: false,
      toastMessage: '',
      toastType: ''
    };
  },
  computed: {
    userName() {
      if (!this.user) return '—';
      return [this.user.firstname, this.user.lastname].filter(Boolean).join(' ') || '—';
    },
    isPaid() {
      return (this.payment?.paymentData?.status || '').toUpperCase() === 'PAID';
    },
    paymentInfoItems() {
      const p = this.payment || {};
      const pd = p.paymentData || {};
      return [
        { label: 'Amount', value: `₱${this.formatPrice(pd.amount)}`, valueClass: 'text-primary font-bold' },
        { label: 'Status', value: pd.status || '—' },
        { label: 'Type', value: this.formatPaymentType(pd.type) },
        { label: 'Payment Provider ID', value: pd.id || '—', valueClass: 'font-mono text-xs' },
        { label: 'Invoice ID', value: this.getShortId(p.invoiceID), valueClass: 'font-mono text-xs' },
        { label: 'Checkout URL', value: pd.url ? `${pd.url.slice(0, 40)}...` : '—', valueClass: 'text-xs text-primary truncate max-w-[200px]' },
        { label: 'Created', value: this.formatDateTime(p.createdAt) },
        { label: 'Payment Date', value: this.formatDateTime(pd.date) },
      ];
    }
  },
  methods: {
    formatPrice(n) {
      if (n == null) return '0';
      return Number(n).toLocaleString();
    },
    formatPaymentType(type) {
      const map = { add_fund: 'Add Fund', subscription: 'Subscription', withdrawal: 'Withdrawal' };
      return map[type] || type || '—';
    },
    formatDateTime(date) {
      if (!date) return '—';
      const d = typeof date === 'string' ? new Date(date) : (date.toDate ? date.toDate() : new Date(date));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    getShortId(id) {
      return (id || '').slice(-8);
    },
    async copyId(text) {
      if (!text) return;
      try {
        await navigator.clipboard.writeText(text);
        this.copied = true;
        this.showToastMessage('Copied to clipboard');
        setTimeout(() => { this.copied = false; }, 2000);
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        this.copied = true;
        this.showToastMessage('Copied to clipboard');
        setTimeout(() => { this.copied = false; }, 2000);
      }
    },
    showToastMessage(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
    },
    clearToast() {
      this.toastMessage = '';
      this.toastType = '';
    },
    openCheckout() {
      const url = this.payment?.paymentData?.url;
      if (url) {
        window.open(url, '_blank');
      } else {
        this.showToastMessage('No checkout URL available', 'error');
      }
    },
    printCurrentReceipt() {
      const p = this.payment;
      if (!p) return;
      const pd = p.paymentData || {};
      const u = this.user || {};
      const win = window.open('', '_blank');
      if (!win) return;
      win.document.write(`
        <html><head><title>Payment Receipt #${(p.invoiceID || '').slice(-8)}</title>
        <style>body{font-family:Arial;padding:40px;color:#333}table{width:100%;border-collapse:collapse}td,th{padding:8px 12px;border:1px solid #ddd;text-align:left}h1{color:#137fec}h2{color:#333;margin-top:24px}.badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold}.badge-PAID{background:#d1fae5;color:#047857}.badge-PENDING{background:#fef3c7;color:#b45309}.badge-FAILED{background:#fee2e2;color:#b91c1c}.badge-EXPIRED{background:#f3f4f6;color:#6b7280}</style></head><body>
        <div style="text-align:center;border-bottom:2px solid #e5e7eb;padding-bottom:16px;margin-bottom:24px">
          <h1>Payment Receipt</h1>
          <p style="color:#666;font-family:monospace">Invoice #${(p.invoiceID || '').slice(-8)}</p>
        </div>
        <h2>User Information</h2>
        <p><strong>${[u.firstname, u.lastname].filter(Boolean).join(' ') || '—'}</strong></p>
        <p style="color:#666">${u.email || '—'}</p>
        ${u.phoneNumber ? `<p style="color:#666">${u.phoneNumber}</p>` : ''}
        <h2>Payment Information</h2>
        <table>
          <tr><th>Amount</th><td><strong>₱${this.formatPrice(pd.amount)}</strong></td></tr>
          <tr><th>Status</th><td><span class="badge badge-${(pd.status || '').toUpperCase()}">${pd.status || '—'}</span></td></tr>
          <tr><th>Type</th><td>${pd.type || '—'}</td></tr>
          <tr><th>Payment ID</th><td style="font-family:monospace;font-size:12px">${pd.id || '—'}</td></tr>
          <tr><th>Invoice ID</th><td style="font-family:monospace;font-size:12px">${p.invoiceID || '—'}</td></tr>
          <tr><th>Payment Date</th><td>${this.formatDateTime(pd.date)}</td></tr>
          <tr><th>Created</th><td>${this.formatDateTime(p.createdAt)}</td></tr>
        </table>
        <div style="margin-top:32px;padding-top:16px;border-top:1px solid #e5e7eb;text-align:center;color:#999;font-size:12px">
          Generated on ${new Date().toLocaleString()}
        </div>
        </body></html>
      `);
      win.document.close();
      setTimeout(() => win.print(), 500);
    },
    downloadPdfReceipt() {
      this.printCurrentReceipt();
    },
    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        const payment = await WorkbitsPaymentsDataService.getById(this.$route.params.id);
        if (!payment) {
          this.loading = false;
          return;
        }
        this.payment = payment;
        if (payment.userID) {
          this.user = await WorkbitsPaymentsDataService.getUserById(payment.userID);
        }
      } catch (err) {
        this.error = err.message || 'Failed to load payment';
      } finally {
        this.loading = false;
      }
    }
  },
  watch: {
    '$route.params.id'() {
      this.fetchData();
    }
  },
  mounted() {
    this.fetchData();
  }
};
</script>

<style scoped>
@reference "tailwindcss";
</style>
