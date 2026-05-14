<template>
  <div>
    <Toast :message="toastMessage" :type="toastType" :showConfirmButtons="false" id="" @cancel="clearToast" />

    <div class="px-4 py-5 sm:px-6 sm:py-6 space-y-5 sm:space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-text-light tracking-tight">
            WorkBits Payments
          </h1>
          <p class="text-sm text-text-muted-light mt-1 max-w-2xl leading-relaxed">
            Monitor and manage all payment transactions across the WorkBits platform.
          </p>
        </div>
        <div class="flex items-center gap-2 shrink-0">
          <button
            class="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-text-light hover:bg-gray-50 transition-colors shadow-soft"
            @click="exportCSV"
          >
            <span class="material-symbols-outlined text-lg">file_download</span>
            <span class="hidden sm:inline">Export CSV</span>
          </button>
          <button
            class="inline-flex items-center gap-1.5 px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-text-light hover:bg-gray-50 transition-colors shadow-soft"
            @click="fetchPayments"
          >
            <span class="material-symbols-outlined text-lg">refresh</span>
            <span class="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div
          v-for="stat in statCards"
          :key="stat.key"
          class="bg-white rounded-xl shadow-soft p-4 sm:p-5 hover:shadow-lifted transition-shadow cursor-pointer"
          :class="[stat.borderClass, filterStatus === stat.key ? 'ring-2 ring-primary/20' : '']"
          @click="filterStatus = filterStatus === stat.key ? '' : stat.key; currentPage = 1"
        >
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">{{ stat.label }}</span>
            <span class="material-symbols-outlined text-xl" :class="stat.iconClass">{{ stat.icon }}</span>
          </div>
          <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ stat.value }}</p>
          <p class="text-xs text-text-muted-light mt-1">{{ stat.subtext }}</p>
        </div>
      </div>

      <div class="border-b border-gray-200">
        <nav class="flex gap-6">
          <button
            v-for="tab in statusTabs"
            :key="tab.key"
            class="pb-3 text-sm font-medium transition-colors relative"
            :class="statusTab === tab.key ? 'text-primary' : 'text-text-muted-light hover:text-text-light'"
            @click="statusTab = tab.key; filterStatus = ''; currentPage = 1"
          >
            {{ tab.label }}
            <span v-if="statusTab === tab.key" class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
          </button>
        </nav>
      </div>

      <PaymentFilters
        :searchQuery="searchQuery"
        :filterStatus="filterStatus"
        :filterType="filterType"
        @update:searchQuery="searchQuery = $event; currentPage = 1"
        @update:filterStatus="filterStatus = $event; currentPage = 1; statusTab = 'all'"
        @update:filterType="filterType = $event; currentPage = 1"
      />

      <div v-if="loading">
        <PaymentSkeleton :count="6" />
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
        <span>{{ error }}</span>
        <button class="underline font-medium shrink-0 ml-4" @click="fetchPayments">Try Again</button>
      </div>

      <div v-else-if="filteredPayments.length === 0">
        <EmptyPayments
          title="No payments found"
          :message="hasActiveFilters ? 'Try adjusting your search or filters.' : 'No payment transactions have been recorded yet.'"
          actionLabel="Refresh"
          @action="fetchPayments"
        />
      </div>

      <template v-else>
        <PaymentTable
          v-if="!isMobile"
          :payments="paginatedPayments"
          :usersMap="usersMap"
          @view="viewPayment"
          @openCheckout="openCheckoutUrl"
          @copyInvoice="copyToClipboard"
          @copyPayment="copyToClipboard"
          @print="printReceipt"
        />

        <PaymentCard
          v-else
          :payments="paginatedPayments"
          :usersMap="usersMap"
          @view="viewPayment"
        />

        <Pagination
          v-if="totalPages > 1"
          :currentPage="currentPage"
          :totalPages="totalPages"
          :tableData="tableData"
          itemLabel="payments"
          :showRowsPerPage="false"
          @setPage="setPage"
          @prevPage="prevPage"
          @nextPage="nextPage"
        />
      </template>
    </div>
  </div>
</template>

<script>
import WorkbitsPaymentsDataService from '@/services/WorkbitsPaymentsDataService';
import { getDoc, doc } from 'firebase/firestore';
import { db } from '@/firebase';
import PaymentStatusBadge from '@/components/workbits-payments/PaymentStatusBadge.vue';
import PaymentTypeBadge from '@/components/workbits-payments/PaymentTypeBadge.vue';
import PaymentTable from '@/components/workbits-payments/PaymentTable.vue';
import PaymentCard from '@/components/workbits-payments/PaymentCard.vue';
import PaymentFilters from '@/components/workbits-payments/PaymentFilters.vue';
import PaymentSkeleton from '@/components/workbits-payments/PaymentSkeleton.vue';
import EmptyPayments from '@/components/workbits-payments/EmptyPayments.vue';
import Pagination from '@/components/Pagination.vue';
import Toast from '@/components/Toast.vue';

export default {
  components: {
    PaymentStatusBadge, PaymentTypeBadge, PaymentTable, PaymentCard,
    PaymentFilters, PaymentSkeleton, EmptyPayments, Pagination, Toast
  },
  data() {
    return {
      payments: [],
      usersMap: {},
      loading: true,
      error: null,
      searchQuery: '',
      filterStatus: '',
      filterType: '',
      statusTab: 'all',
      currentPage: 1,
      perPage: 20,
      isMobile: false,
      unsubscribe: null,
      toastMessage: '',
      toastType: ''
    };
  },
  computed: {
    statCards() {
      const stats = this.getStats();
      return [
        { key: '', label: 'Total Revenue', value: `₱${this.formatPrice(stats.totalRevenue)}`, icon: 'account_balance', iconClass: 'text-green-500', borderClass: 'border-l-4 border-green-500', subtext: `${stats.total} total payments` },
        { key: '', label: 'Total Payments', value: stats.total, icon: 'payments', iconClass: 'text-text-muted-light', borderClass: 'border-l-4 border-primary', subtext: 'All transactions' },
        { key: 'PAID', label: 'Paid', value: stats.paid, icon: 'check_circle', iconClass: 'text-green-500', borderClass: 'border-l-4 border-green-500', subtext: 'Completed payments' },
        { key: 'PENDING', label: 'Pending', value: stats.pending, icon: 'hourglass_empty', iconClass: 'text-amber-400', borderClass: 'border-l-4 border-amber-400', subtext: 'Awaiting confirmation' },
      ];
    },
    statusTabs() {
      const counts = this.getStatusCounts();
      return [
        { key: 'all', label: `All (${this.payments.length})` },
        { key: 'PAID', label: `Paid (${counts.PAID})` },
        { key: 'PENDING', label: `Pending (${counts.PENDING})` },
        { key: 'FAILED', label: `Failed (${counts.FAILED})` },
        { key: 'EXPIRED', label: `Expired (${counts.EXPIRED})` },
      ];
    },
    filteredPayments() {
      return this.payments.filter(p => {
        const q = this.searchQuery.toLowerCase().trim();
        if (q) {
          const user = this.usersMap[p.userID] || {};
          const userName = [user.firstname, user.lastname].filter(Boolean).join(' ');
          const email = user.email || '';
          const searchable = [p.invoiceID, p.paymentData?.id, userName, email].filter(Boolean).join(' ').toLowerCase();
          if (!searchable.includes(q)) return false;
        }
        const status = (p.paymentData?.status || '').toUpperCase();
        if (this.filterStatus && status !== this.filterStatus.toUpperCase()) return false;
        if (this.filterType && (p.paymentData?.type || '') !== this.filterType) return false;
        return true;
      });
    },
    paginatedPayments() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredPayments.slice(start, start + this.perPage);
    },
    totalPages() {
      return Math.ceil(this.filteredPayments.length / this.perPage);
    },
    tableData() {
      const total = this.filteredPayments.length;
      const from = total === 0 ? 0 : (this.currentPage - 1) * this.perPage + 1;
      const to = Math.min(from + this.paginatedPayments.length - 1, total);
      return { from, to, totalItems: total };
    },
    hasActiveFilters() {
      return !!(this.searchQuery || this.filterStatus || this.filterType);
    }
  },
  methods: {
    getStats() {
      let total = 0, totalRevenue = 0;
      const statusCounts = { paid: 0, pending: 0, failed: 0, expired: 0 };
      this.payments.forEach(p => {
        total++;
        const status = (p.paymentData?.status || '').toLowerCase();
        if (status in statusCounts) {
          statusCounts[status]++;
          if (status === 'paid') totalRevenue += Number(p.paymentData?.amount || 0);
        }
      });
      return { total, totalRevenue, ...statusCounts };
    },
    getStatusCounts() {
      const counts = { PAID: 0, PENDING: 0, FAILED: 0, EXPIRED: 0 };
      this.payments.forEach(p => {
        const s = (p.paymentData?.status || '').toUpperCase();
        if (s in counts) counts[s]++;
      });
      return counts;
    },
    formatPrice(n) {
      if (n == null) return '0';
      return Number(n).toLocaleString();
    },
    viewPayment(id) {
      this.$router.push(`/workbits-payments/${id}`);
    },
    setPage(page) {
      if (page >= 1 && page <= this.totalPages) this.currentPage = page;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    showToast(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
    },
    clearToast() {
      this.toastMessage = '';
      this.toastType = '';
    },
    openCheckoutUrl(payment) {
      const url = payment.paymentData?.url;
      if (url) {
        window.open(url, '_blank');
      } else {
        this.showToast('No checkout URL available', 'error');
      }
    },
    async copyToClipboard(text) {
      if (!text) {
        this.showToast('Nothing to copy', 'error');
        return;
      }
      try {
        await navigator.clipboard.writeText(text);
        this.showToast('Copied to clipboard');
      } catch {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        this.showToast('Copied to clipboard');
      }
    },
    printReceipt(payment) {
      const user = this.usersMap[payment.userID] || {};
      const pd = payment.paymentData || {};
      const win = window.open('', '_blank');
      if (!win) return;
      win.document.write(`
        <html><head><title>Payment Receipt #${(payment.invoiceID || '').slice(-8)}</title>
        <style>body{font-family:Arial;padding:40px;color:#333}table{width:100%;border-collapse:collapse}td,th{padding:8px 12px;border:1px solid #ddd;text-align:left}h1{color:#137fec}h2{color:#333;margin-top:24px}.badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold}.badge-PAID{background:#d1fae5;color:#047857}.badge-PENDING{background:#fef3c7;color:#b45309}.badge-FAILED{background:#fee2e2;color:#b91c1c}.badge-EXPIRED{background:#f3f4f6;color:#6b7280}</style></head><body>
        <h1>Payment Receipt</h1>
        <p style="color:#666">Invoice #${(payment.invoiceID || '').slice(-8)}</p>
        <hr style="margin:20px 0"/>
        <h2>User Information</h2>
        <p>${[user.firstname, user.lastname].filter(Boolean).join(' ') || '—'}</p>
        <p style="color:#666">${user.email || '—'}</p>
        <h2>Payment Information</h2>
        <table>
          <tr><th>Amount</th><td>₱${this.formatPrice(pd.amount)}</td></tr>
          <tr><th>Status</th><td><span class="badge badge-${(pd.status || '').toUpperCase()}">${pd.status || '—'}</span></td></tr>
          <tr><th>Type</th><td>${pd.type || '—'}</td></tr>
          <tr><th>Payment ID</th><td style="font-family:monospace;font-size:12px">${pd.id || '—'}</td></tr>
          <tr><th>Invoice ID</th><td style="font-family:monospace;font-size:12px">${payment.invoiceID || '—'}</td></tr>
          <tr><th>Payment Date</th><td>${this.formatDate(pd.date)}</td></tr>
          <tr><th>Created</th><td>${this.formatDate(payment.createdAt)}</td></tr>
        </table>
        <hr style="margin:20px 0"/><p style="color:#999;font-size:12px">Generated on ${new Date().toLocaleString()}</p>
        </body></html>
      `);
      win.document.close();
      setTimeout(() => win.print(), 500);
    },
    exportCSV() {
      const headers = ['Invoice ID', 'Payment ID', 'User Name', 'Email', 'Amount', 'Type', 'Status', 'Payment Date', 'Created Date'];
      const rows = this.payments.map(p => {
        const user = this.usersMap[p.userID] || {};
        const pd = p.paymentData || {};
        return [
          p.invoiceID, pd.id || '',
          [user.firstname, user.lastname].filter(Boolean).join(' '), user.email || '',
          pd.amount || '', pd.type || '', pd.status || '',
          this.formatDate(pd.date), this.formatDate(p.createdAt)
        ];
      });
      const csv = [headers, ...rows].map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `workbits-payments-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      this.showToast('CSV exported successfully');
    },
    formatDate(date) {
      if (!date) return '—';
      const d = typeof date === 'string' ? new Date(date) : (date.toDate ? date.toDate() : new Date(date));
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    checkMobile() {
      this.isMobile = window.innerWidth < 768;
    },
    async fetchUser(userId) {
      if (this.usersMap[userId]) return;
      try {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.usersMap = { ...this.usersMap, [userId]: { id: docSnap.id, ...docSnap.data() } };
        }
      } catch (err) {
        console.error('Error fetching user:', err);
      }
    },
    fetchPayments() {
      this.loading = true;
      this.error = null;
      if (this.unsubscribe) this.unsubscribe();
      this.unsubscribe = WorkbitsPaymentsDataService.getAll(
        (payments) => {
          this.payments = payments;
          const userIds = [...new Set(payments.map(p => p.userID).filter(Boolean))];
          userIds.forEach(uid => this.fetchUser(uid));
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
    searchQuery() { this.currentPage = 1; },
    filterStatus() { this.currentPage = 1; },
    filterType() { this.currentPage = 1; }
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    this.fetchPayments();
  },
  beforeUnmount() {
    if (this.unsubscribe) this.unsubscribe();
    window.removeEventListener('resize', this.checkMobile);
  }
};
</script>

<style scoped>
@reference "tailwindcss";
</style>
