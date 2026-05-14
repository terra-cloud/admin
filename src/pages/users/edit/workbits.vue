<template>
  <div>
    <div v-if="loading" class="bg-white rounded-xl shadow-soft p-6 animate-pulse space-y-4">
      <div class="h-4 bg-gray-200 rounded w-1/3"></div>
      <div class="h-8 bg-gray-200 rounded w-1/4"></div>
      <div class="h-4 bg-gray-200 rounded w-1/2"></div>
    </div>

    <div v-else-if="error" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <div v-else-if="!data" class="bg-white rounded-xl shadow-soft p-8 text-center border border-dashed border-gray-200">
      <span class="material-symbols-outlined text-4xl text-text-muted-light">account_balance_wallet</span>
      <h3 class="text-base font-semibold text-text-light mt-3">No WorkBits wallet</h3>
      <p class="text-sm text-text-muted-light mt-1">This user has not created a WorkBits wallet yet.</p>
    </div>

    <template v-else>
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div class="bg-gradient-to-br from-primary to-blue-700 rounded-2xl shadow-soft p-5 text-white">
          <p class="text-xs font-medium uppercase tracking-wider opacity-80">Current Balance</p>
          <p class="text-3xl font-bold mt-2 tabular-nums">₱{{ formatPrice(data.amount) }}</p>
          <p class="text-xs mt-1 opacity-70">Wallet ID: {{ data.id || '—' }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-soft p-5 border border-gray-100/50">
          <p class="text-xs font-medium text-text-muted-light uppercase tracking-wider">First Top-Up</p>
          <p class="text-base font-semibold text-text-light mt-1">{{ data.first_top_up ? formatDateTime(data.first_top_up) : '—' }}</p>
        </div>
        <div class="bg-white rounded-xl shadow-soft p-5 border border-gray-100/50">
          <p class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Latest Top-Up</p>
          <p class="text-base font-semibold text-text-light mt-1">{{ data.latest_top_up ? formatDateTime(data.latest_top_up) : '—' }}</p>
        </div>
      </div>

      <div class="mt-4 bg-white rounded-xl shadow-soft p-5 border border-gray-100/50">
        <h3 class="text-sm font-semibold text-text-light mb-3 flex items-center gap-2">
          <span class="material-symbols-outlined text-primary text-lg">info</span>
          Wallet Details
        </h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <p class="text-xs text-text-muted-light">Wallet ID</p>
            <p class="text-sm font-medium text-text-light font-mono">{{ data.id || '—' }}</p>
          </div>
          <div>
            <p class="text-xs text-text-muted-light">Created</p>
            <p class="text-sm font-medium text-text-light">{{ formatDateTime(data.created_at) }}</p>
          </div>
          <div>
            <p class="text-xs text-text-muted-light">Last Updated</p>
            <p class="text-sm font-medium text-text-light">{{ formatDateTime(data.updated_at) }}</p>
          </div>
          <div>
            <p class="text-xs text-text-muted-light">Total History Entries</p>
            <p class="text-sm font-medium text-text-light">{{ data.payment_history?.length || 0 }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script>
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';
import PaymentStatusBadge from '@/components/workbits-payments/PaymentStatusBadge.vue';

export default {
  components: {
    PaymentStatusBadge,
  },
  props: {
    user: { type: Object, required: true }
  },
  data() {
    return {
      data: null,
      loading: true,
      error: null
    };
  },
  methods: {
    formatPrice(n) {
      if (n == null) return '0';
      return Number(n).toLocaleString();
    },
    formatDateTime(date) {
      if (!date) return '—';
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        const docRef = doc(db, 'user-workbits', this.$route.params.id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          this.data = { id: docSnap.id, ...docSnap.data() };
        } else {
          this.data = null;
        }
      } catch (err) {
        this.error = err.message || 'Failed to load wallet data';
      } finally {
        this.loading = false;
      }
    }
  },
  mounted() {
    this.fetchData();
  },
  watch: {
    '$route.params.id'() {
      this.fetchData();
    }
  }
};
</script>

<style scoped>
@reference "tailwindcss";
</style>
