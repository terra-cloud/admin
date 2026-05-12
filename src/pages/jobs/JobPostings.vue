<template>
  <div class="px-4 py-5 sm:px-6 sm:py-6 space-y-5 sm:space-y-6">
    <!-- Header -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
      <div>
        <h1 class="font-display text-2xl sm:text-3xl font-bold text-primary tracking-tight">
          Service List
        </h1>
        <p class="text-sm text-text-muted-light mt-1 max-w-2xl leading-relaxed">
          Manage and monitor all professional service listings across the Terra PH marketplace ecosystem.
        </p>
      </div>

    </div>

    <!-- Stats Bar -->
    <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
      <div class="relative overflow-hidden rounded-xl p-4 border border-gray-200 bg-white/70 backdrop-blur-sm hover:shadow-soft transition-shadow">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1;">list_alt</span>
          </div>
          <div class="min-w-0">
            <p class="text-xs text-text-muted-light font-medium">Total Services</p>
            <p class="text-xl font-bold text-text-light tabular-nums">{{ totalServices }}</p>
          </div>
        </div>
      </div>
      <div class="relative overflow-hidden rounded-xl p-4 border border-gray-200 bg-white/70 backdrop-blur-sm hover:shadow-soft transition-shadow">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1;">check_circle</span>
          </div>
          <div class="min-w-0">
            <p class="text-xs text-text-muted-light font-medium">Active Now</p>
            <p class="text-xl font-bold text-text-light tabular-nums">{{ statusCounts.active }}</p>
          </div>
        </div>
      </div>
      <div class="relative overflow-hidden rounded-xl p-4 border border-gray-200 bg-white/70 backdrop-blur-sm hover:shadow-soft transition-shadow">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1;">pending</span>
          </div>
          <div class="min-w-0">
            <p class="text-xs text-text-muted-light font-medium">Pending Drafts</p>
            <p class="text-xl font-bold text-text-light tabular-nums">{{ statusCounts.draft + statusCounts.pending }}</p>
          </div>
        </div>
      </div>
      <div class="relative overflow-hidden rounded-xl p-4 border border-gray-200 bg-white/70 backdrop-blur-sm hover:shadow-soft transition-shadow">
        <div class="flex items-center gap-3">
          <div class="w-11 h-11 rounded-full bg-red-50 flex items-center justify-center text-red-500 shrink-0">
            <span class="material-symbols-outlined text-xl" style="font-variation-settings: 'FILL' 1;">block</span>
          </div>
          <div class="min-w-0">
            <p class="text-xs text-text-muted-light font-medium">Closed/Flagged</p>
            <p class="text-xl font-bold text-text-light tabular-nums">{{ statusCounts.closed + statusCounts.flagged }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="flex flex-wrap items-center gap-3">
      <select
        v-model="filterCategory"
        class="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-text-muted-light focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
      >
        <option value="">All Categories</option>
        <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
      </select>
      <select
        v-model="filterStatus"
        class="bg-white border border-gray-200 rounded-lg px-3 py-2 text-xs font-medium text-text-muted-light focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
      >
        <option value="">Status: All</option>
        <option value="active">Active</option>
        <option value="draft">Draft</option>
        <option value="closed">Closed</option>
        <option value="pending">Pending</option>
        <option value="flagged">Flagged</option>
      </select>
      <div class="ml-auto relative min-w-[200px] max-w-[280px] hidden sm:block">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted-light">search</span>
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search services..."
          class="w-full pl-9 pr-3 py-2 bg-white border border-gray-200 rounded-lg text-xs font-medium placeholder:text-text-muted-light focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
        />
      </div>
    </div>

    <!-- Mobile Search -->
    <div class="sm:hidden relative">
      <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted-light">search</span>
      <input
        v-model="searchQuery"
        type="text"
        placeholder="Search services..."
        class="w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 rounded-lg text-sm font-medium placeholder:text-text-muted-light focus:ring-2 focus:ring-primary/20 focus:border-primary/30 outline-none transition-all"
      />
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

    <!-- Service Cards Grid -->
    <div v-else-if="paginatedServices.length" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
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
              <!-- Escrow Badge -->
              <span
                v-if="service.escrowAmount > 0"
                class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50"
              >
                <span class="material-symbols-outlined text-[10px]">verified</span>
                Escrow
              </span>
              <!-- Offer Count -->
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

    <!-- Empty State -->
    <div v-else class="flex flex-col items-center justify-center py-20 text-center">
      <div class="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-4">
        <span class="material-symbols-outlined text-3xl text-gray-300">search_off</span>
      </div>
      <h3 class="text-base font-semibold text-text-light mb-1">No services found</h3>
      <p class="text-sm text-text-muted-light max-w-xs">Try adjusting your filters or search query to find what you're looking for.</p>
    </div>

    <!-- Pagination -->
    <Pagination
      v-if="totalPages > 1"
      :currentPage="currentPage"
      :totalPages="totalPages"
      :tableData="tableData"
      @setPage="setPage"
      @prevPage="prevPage"
      @nextPage="nextPage"
      @firstPage="setPage(1)"
      @lastPage="setPage(totalPages)"
    />
  </div>
</template>

<script>
import { db } from '@/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import Pagination from '@/components/Pagination.vue';
import { formatText } from '@/utils/format.js';

export default {
  components: { Pagination },
  data() {
    return {
      services: [],
      loading: true,
      searchQuery: '',
      filterCategory: '',
      filterStatus: '',
      activeFilterTab: 'all',
      filterTabs: [
        { key: 'all', label: 'All Services' },
        { key: 'mine', label: 'Mine' },
        { key: 'archived', label: 'Archived' },
      ],
      currentPage: 1,
      servicesPerPage: 20,
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

        let matchesTab = true;
        if (this.activeFilterTab === 'mine') {
          matchesTab = s.assignedEmployerId === this.currentUserId;
        } else if (this.activeFilterTab === 'archived') {
          matchesTab = s.status === 'closed' || s.status === 'flagged';
        }

        return matchesSearch && matchesCategory && matchesStatus && matchesTab;
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
      const from = this.filteredServices.length === 0 ? 0 : (this.currentPage - 1) * this.servicesPerPage + 1;
      const to = Math.min(from + this.paginatedServices.length - 1, this.filteredServices.length);
      return { from, to, totalItems: this.filteredServices.length };
    },
    currentUserId() {
      return this.$store?.state?.auth?.user?.uid || null;
    },
  },
  methods: {
    formatText,
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
    favoriteStyle(id) {
      return this.favorites.has(id) ? { fontVariationSettings: "'FILL' 1" } : {};
    },
    toggleFavorite(id) {
      if (this.favorites.has(id)) this.favorites.delete(id);
      else this.favorites.add(id);
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
    activeFilterTab() { this.currentPage = 1; },
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
