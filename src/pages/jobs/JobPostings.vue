<template>
  <div class="px-4 py-5 sm:px-6 sm:py-6 space-y-5 sm:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="text-2xl sm:text-3xl font-bold text-text-light tracking-tight">
          Service List
        </h1>
        <p class="text-sm text-text-muted-light mt-1 max-w-2xl leading-relaxed">
          Manage and monitor all professional service listings across the Terra PH marketplace ecosystem.
        </p>
      </div>
    </div>

    <!-- Stats Bar -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-primary hover:shadow-lifted transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Total Services</span>
          <span class="material-symbols-outlined text-text-muted-light text-xl">list_alt</span>
        </div>
        <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ formatNumber(totalServices) }}</p>
        <p class="text-xs text-text-muted-light mt-1">All listed services</p>
      </div>
      <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-emerald-500 hover:shadow-lifted transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Active Now</span>
          <span class="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
        </div>
        <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ formatNumber(statusCounts.active) }}</p>
        <p class="text-xs text-text-muted-light mt-1">{{ activePercent }}% of total</p>
      </div>
      <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-amber-400 hover:shadow-lifted transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Pending Drafts</span>
          <span class="material-symbols-outlined text-amber-400 text-xl">pending</span>
        </div>
        <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ formatNumber(statusCounts.draft + statusCounts.pending) }}</p>
        <p class="text-xs text-text-muted-light mt-1">Requires attention</p>
      </div>
      <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-red-500 hover:shadow-lifted transition-shadow">
        <div class="flex items-center justify-between mb-2">
          <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Closed/Flagged</span>
          <span class="material-symbols-outlined text-red-500 text-xl">block</span>
        </div>
        <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ formatNumber(statusCounts.closed + statusCounts.flagged) }}</p>
        <p class="text-xs text-text-muted-light mt-1">Inactive listings</p>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-xl shadow-soft p-4 space-y-4">
      <div class="flex flex-col sm:flex-row gap-3">
        <div class="relative flex-1 min-w-0">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted-light">search</span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by title, owner, description, or keywords..."
            class="w-full pl-9 pr-3 py-2.5 bg-input-light border-none rounded-lg text-sm placeholder:text-text-muted-light focus:ring-2 focus:ring-primary/30 outline-none"
          />
        </div>
        <div class="flex flex-wrap items-center gap-3">
          <select
            v-model="filterCategory"
            class="px-3 py-2.5 bg-input-light border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30 text-text-muted-light"
          >
            <option value="">All Categories</option>
            <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
          </select>
          <select
            v-model="filterStatus"
            class="px-3 py-2.5 bg-input-light border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30 text-text-muted-light"
          >
            <option value="">Status: All</option>
            <option value="active">Active</option>
            <option value="draft">Draft</option>
            <option value="closed">Closed</option>
            <option value="pending">Pending</option>
            <option value="flagged">Flagged</option>
          </select>
        </div>
      </div>

      <!-- Active Filters Pills -->
      <div v-if="activeFilterCount > 0" class="flex flex-wrap items-center gap-2">
        <span class="text-xs text-text-muted-light font-medium">Active filters:</span>
        <span
          v-if="filterCategory"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/5 text-primary border border-primary/10"
        >
          Category: {{ filterCategory }}
          <button class="hover:text-primary/70" @click="filterCategory = ''">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </span>
        <span
          v-if="filterStatus"
          class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/5 text-primary border border-primary/10"
        >
          Status: {{ filterStatus }}
          <button class="hover:text-primary/70" @click="filterStatus = ''">
            <span class="material-symbols-outlined text-sm">close</span>
          </button>
        </span>
        <button
          v-if="filterCategory || filterStatus"
          class="text-xs text-text-muted-light hover:text-text-light underline"
          @click="filterCategory = ''; filterStatus = ''"
        >
          Clear all
        </button>
      </div>
    </div>

    <!-- Loading Skeletons -->
    <div v-if="loading" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div v-for="n in 6" :key="n" class="rounded-xl bg-white border border-gray-100 overflow-hidden">
        <div class="aspect-[16/10] bg-gray-100 animate-pulse"></div>
        <div class="p-4 space-y-3">
          <div class="h-3 w-20 bg-gray-100 rounded-full animate-pulse"></div>
          <div class="h-5 w-4/5 bg-gray-100 rounded-lg animate-pulse"></div>
          <div class="flex items-center gap-2">
            <div class="w-6 h-6 rounded-full bg-gray-100 animate-pulse"></div>
            <div class="h-3 w-24 bg-gray-100 rounded animate-pulse"></div>
          </div>
          <div class="flex items-center justify-between pt-1">
            <div class="h-5 w-20 bg-gray-100 rounded animate-pulse"></div>
            <div class="h-6 w-16 bg-gray-100 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- No Services / Empty State -->
    <div v-else-if="services.length === 0" class="bg-white rounded-xl shadow-soft p-12 text-center">
      <span class="material-symbols-outlined text-5xl text-gray-300 mb-4">handyman</span>
      <h3 class="text-lg font-semibold text-text-light mb-2">No Services Yet</h3>
      <p class="text-sm text-text-muted-light max-w-md mx-auto">There are no service listings in the system.</p>
    </div>

    <!-- No Results State -->
    <div v-else-if="filteredServices.length === 0" class="bg-white rounded-xl shadow-soft p-12 text-center">
      <span class="material-symbols-outlined text-5xl text-gray-300 mb-4">search_off</span>
      <h3 class="text-lg font-semibold text-text-light mb-2">No Results Found</h3>
      <p class="text-sm text-text-muted-light max-w-md mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
      <button class="text-sm text-primary hover:text-primary/80 font-medium mt-2" @click="filterCategory = ''; filterStatus = ''; searchQuery = ''">
        Clear all filters
      </button>
    </div>

    <!-- Service Cards Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      <div
        v-for="service in paginatedServices"
        :key="service.id"
        @click="$router.push(`/jobs/${service.id}`)"
        class="group relative bg-white rounded-xl border border-gray-100 shadow-soft hover:shadow-lifted hover:border-primary/20 transition-all duration-300 overflow-hidden cursor-pointer"
      >
        <!-- Thumbnail -->
        <div class="relative aspect-[16/10] overflow-hidden bg-gray-50">
          <img
            v-if="service.images && service.images.length"
            :src="service.images[0]"
            :alt="service.title"
            class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <span class="material-symbols-outlined text-4xl text-gray-200">image</span>
          </div>

          <!-- Category Badge -->
          <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-sm text-text-light shadow-sm">
            {{ service.category ? formatText(service.category) : 'Uncategorized' }}
          </span>

          <!-- Availability Indicator -->
          <span
            v-if="service.isAvailable !== undefined"
            class="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-sm"
            :class="service.isAvailable ? 'bg-emerald-500/90 text-white' : 'bg-gray-500/80 text-white'"
          >
            <span class="w-1.5 h-1.5 rounded-full" :class="service.isAvailable ? 'bg-white animate-pulse' : 'bg-gray-300'"></span>
            {{ service.isAvailable ? 'Available' : 'Unavailable' }}
          </span>
        </div>

        <!-- Card Body -->
        <div class="p-4">
          <!-- Status Badge -->
          <div class="flex items-center justify-between mb-2">
            <span
              class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase"
              :class="statusClasses(service.status)"
            >
              {{ displayStatus(service.status) }}
            </span>
          </div>

          <!-- Title -->
          <h3 class="font-semibold text-sm text-text-light group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
            {{ service.title || 'Untitled Service' }}
          </h3>

          <!-- Author -->
          <div class="flex items-center gap-2 mb-2.5">
            <img
              v-if="service.author?.photo_url"
              :src="service.author.photo_url"
              :alt="service.author.display_name"
              class="w-5 h-5 rounded-full object-cover ring-1 ring-gray-200"
              loading="lazy"
            />
            <div v-else class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-semibold">
              {{ getInitials(service.author) }}
            </div>
            <span class="text-xs text-text-muted-light truncate">{{ service.author?.display_name || 'Unknown' }}</span>
          </div>

          <!-- Location -->
          <div v-if="service.location?.stringified_address" class="flex items-center gap-1.5 mb-2.5">
            <span class="material-symbols-outlined text-[14px] text-text-muted-light">location_on</span>
            <span class="text-[11px] text-text-muted-light truncate">{{ service.location.stringified_address }}</span>
          </div>

          <!-- Price & Meta Row -->
          <div class="flex items-center justify-between pt-2 border-t border-gray-100">
            <div class="flex items-baseline gap-1">
              <span class="text-sm font-bold text-primary">₱{{ formatPrice(service.price) }}</span>
              <span class="text-[10px] text-text-muted-light">{{ paymentLabel(service.paymentType) }}</span>
            </div>
            <div class="flex items-center gap-2">
              <span
                v-if="service.escrowAmount > 0"
                class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50"
              >
                <span class="material-symbols-outlined text-[10px]">verified</span>
                Escrow
              </span>
              <span
                v-if="service.offers_count > 0"
                class="text-[11px] font-medium text-text-muted-light"
              >
                {{ service.offers_count }} {{ service.offers_count === 1 ? 'offer' : 'offers' }}
              </span>
            </div>
          </div>
        </div>

        <!-- Hover Glow -->
        <div class="absolute inset-0 rounded-xl ring-1 ring-inset ring-primary/0 group-hover:ring-primary/20 transition-all duration-300 pointer-events-none"></div>
      </div>
    </div>

    <!-- Pagination -->
    <div
      v-if="!loading && services.length > 0"
      class="flex flex-col sm:flex-row items-center justify-between gap-4"
    >
      <p class="text-sm text-text-muted-light">
        Showing
        <span class="font-semibold text-text-light">{{ tableData.from }}</span>
        to
        <span class="font-semibold text-text-light">{{ tableData.to }}</span>
        of
        <span class="font-semibold text-text-light">{{ tableData.totalItems }}</span>
        services
      </p>
      <div class="flex items-center gap-2">
        <div class="flex items-center gap-1.5 mr-2">
          <label class="text-xs text-text-muted-light">Rows:</label>
          <select
            v-model="servicesPerPage"
            class="px-2 py-1.5 bg-input-light border-none rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/30"
          >
            <option :value="12">12</option>
            <option :value="24">24</option>
            <option :value="48">48</option>
          </select>
        </div>
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-text-muted-light hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="currentPage === 1"
          @click="prevPage"
        >
          <span class="material-symbols-outlined text-lg">chevron_left</span>
        </button>
        <template v-for="page in visiblePages" :key="page">
          <span v-if="page === '...'" class="px-1 text-text-muted-light text-sm">...</span>
          <button
            v-else
            class="min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors"
            :class="page === currentPage ? 'bg-primary text-white' : 'text-text-muted-light hover:bg-gray-50'"
            @click="setPage(page)"
          >
            {{ page }}
          </button>
        </template>
        <button
          class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-text-muted-light hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          :disabled="currentPage === totalPages"
          @click="nextPage"
        >
          <span class="material-symbols-outlined text-lg">chevron_right</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { formatText } from '@/utils/format.js';

export default {
  data() {
    return {
      services: [],
      loading: true,
      searchQuery: '',
      filterCategory: '',
      filterStatus: '',
      currentPage: 1,
      servicesPerPage: 12,
      favorites: new Set(),
    };
  },
  computed: {
    categories() {
      const cats = new Set();
      this.services.forEach(s => { if (s.category) cats.add(s.category); });
      return [...cats].sort();
    },
    totalServices() {
      return this.services.length;
    },
    activePercent() {
      if (this.totalServices === 0) return '0.0';
      return ((this.statusCounts.active / this.totalServices) * 100).toFixed(1);
    },
    activeFilterCount() {
      let count = 0;
      if (this.filterCategory) count++;
      if (this.filterStatus) count++;
      return count;
    },
    statusCounts() {
      const counts = { active: 0, draft: 0, pending: 0, closed: 0, flagged: 0, unknown: 0 };
      this.services.forEach(s => {
        const st = (s.status || 'unknown').toLowerCase();
        if (st in counts) counts[st]++;
        else counts.unknown++;
      });
      return counts;
    },
    filteredServices() {
      return this.services.filter(s => {
        const q = this.searchQuery.toLowerCase();
        const matchesSearch = !q ||
          (s.title || '').toLowerCase().includes(q) ||
          (s.category || '').toLowerCase().includes(q) ||
          (s.author?.display_name || '').toLowerCase().includes(q) ||
          (s.description || '').toLowerCase().includes(q) ||
          (s.keywords || []).join(' ').toLowerCase().includes(q);

        const matchesCategory = !this.filterCategory || s.category === this.filterCategory;
        const matchesStatus = !this.filterStatus || (s.status || '').toLowerCase() === this.filterStatus;

        return matchesSearch && matchesCategory && matchesStatus;
      });
    },
    paginatedServices() {
      const start = (this.currentPage - 1) * this.servicesPerPage;
      return this.filteredServices.slice(start, start + this.servicesPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredServices.length / this.servicesPerPage);
    },
    tableData() {
      const total = this.filteredServices.length;
      const from = total === 0 ? 0 : (this.currentPage - 1) * this.servicesPerPage + 1;
      const to = Math.min(from + this.paginatedServices.length - 1, total);
      return { from, to, totalItems: total };
    },
    visiblePages() {
      const total = this.totalPages;
      const current = this.currentPage;
      if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }
      const pages = [];
      pages.push(1);
      if (current > 3) pages.push('...');
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current < total - 2) pages.push('...');
      pages.push(total);
      return pages;
    },
  },
  methods: {
    formatText,
    formatNumber(n) {
      if (n == null) return '0';
      return Number(n).toLocaleString();
    },
    fetchServices() {
      this.loading = true;
      const q = query(collection(db, 'service-listings'), orderBy('createdAt', 'desc'));
      onSnapshot(q, (snapshot) => {
        this.services = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        this.loading = false;
      }, (error) => {
        console.error('Error fetching services:', error);
        this.loading = false;
      });
    },
    displayStatus(status) {
      const map = {
        active: 'Active',
        draft: 'Draft',
        pending: 'Pending',
        closed: 'Closed',
        flagged: 'Flagged',
        completed: 'Completed',
      };
      return map[(status || '').toLowerCase()] || 'Unknown';
    },
    statusClasses(status) {
      const s = (status || '').toLowerCase();
      const map = {
        active: 'bg-primary/10 text-primary border border-primary/20',
        draft: 'bg-amber-50 text-amber-700 border border-amber-200/50',
        pending: 'bg-blue-50 text-blue-700 border border-blue-200/50',
        closed: 'bg-red-50 text-red-600 border border-red-200/50',
        flagged: 'bg-red-50 text-red-600 border border-red-200/50',
        completed: 'bg-green-50 text-green-600 border border-green-200/50',
      };
      return map[s] || 'bg-gray-50 text-gray-500 border border-gray-200/50';
    },
    paymentLabel(type) {
      const map = {
        monthly: '/month',
        fixed: '/fixed',
        hourly: '/hr',
        'one-time': '',
        weekly: '/week',
      };
      return map[(type || '').toLowerCase()] || '';
    },
    formatPrice(price) {
      if (price == null) return '0';
      return Number(price).toLocaleString();
    },
    formatDate(date) {
      if (!date) return 'N/A';
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    },
    getInitials(author) {
      if (!author || !author.display_name) return '?';
      return author.display_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
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
  },
  watch: {
    searchQuery() { this.currentPage = 1; },
    filterCategory() { this.currentPage = 1; },
    filterStatus() { this.currentPage = 1; },
  },
  mounted() {
    this.fetchServices();
  },
};
</script>

<style scoped>
@reference "tailwindcss";

@media (prefers-reduced-motion: reduce) {
  .group,
  .group * {
    transition: none !important;
    animation: none !important;
  }
}
</style>
