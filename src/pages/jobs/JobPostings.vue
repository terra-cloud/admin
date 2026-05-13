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
          <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Active</span>
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

    <!-- Loading Skeleton -->
    <div v-if="loading" class="bg-white rounded-xl shadow-soft overflow-hidden">
      <div class="p-6 space-y-4">
        <div v-for="n in 5" :key="n" class="flex items-center gap-4 animate-pulse">
          <div class="w-14 h-11 bg-gray-100 rounded-lg"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 w-48 bg-gray-100 rounded"></div>
            <div class="h-3 w-24 bg-gray-100 rounded"></div>
          </div>
          <div class="h-4 w-16 bg-gray-100 rounded"></div>
          <div class="h-6 w-16 bg-gray-100 rounded-full"></div>
          <div class="h-4 w-16 bg-gray-100 rounded"></div>
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

    <!-- Data Table (Desktop) -->
    <template v-else>
      <div class="bg-white rounded-xl shadow-soft overflow-hidden hidden lg:block">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-gray-100 bg-gray-50/50">
                <th class="px-3 py-3 text-left text-xs font-semibold text-text-muted-light uppercase tracking-wider min-w-[200px]">Service</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-text-muted-light uppercase tracking-wider">Category</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-text-muted-light uppercase tracking-wider min-w-[180px]">Author</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-text-muted-light uppercase tracking-wider whitespace-nowrap">Price</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-text-muted-light uppercase tracking-wider">Status</th>
                <th class="px-3 py-3 text-center text-xs font-semibold text-text-muted-light uppercase tracking-wider">Avail.</th>
                <th class="px-3 py-3 text-center text-xs font-semibold text-text-muted-light uppercase tracking-wider">Offers</th>
                <th class="px-3 py-3 text-right text-xs font-semibold text-text-muted-light uppercase tracking-wider">Action</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr
                v-for="service in paginatedServices"
                :key="service.id"
                class="hover:bg-gray-50/50 transition-colors cursor-pointer"
                @click="$router.push(`/jobs/${service.id}`)"
              >
                <!-- Service Column -->
                <td class="px-3 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-14 h-11 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      <img
                        v-if="service.images && service.images.length"
                        :src="service.images[0]"
                        :alt="service.title"
                        class="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <span class="material-symbols-outlined text-lg text-gray-300">image</span>
                      </div>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-text-light truncate max-w-[200px] group-hover:text-primary transition-colors">{{ service.title || 'Untitled Service' }}</p>
                      <p class="text-xs text-text-muted-light truncate max-w-[200px]">{{ service.description ? $filters.truncate(service.description, 60) : 'No description' }}</p>
                    </div>
                  </div>
                </td>
                <!-- Category -->
                <td class="px-3 py-3">
                  <span class="text-sm text-text-light">{{ formatText(service.category) || 'N/A' }}</span>
                </td>
                <!-- Author -->
                <td class="px-3 py-3">
                  <div class="flex items-center gap-2">
                    <img
                      v-if="service.author?.photo_url"
                      :src="service.author.photo_url"
                      :alt="service.author.display_name"
                      class="w-7 h-7 rounded-full object-cover shrink-0"
                      loading="lazy"
                    />
                    <div
                      v-else
                      class="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold shrink-0"
                    >
                      {{ getInitials(service.author) }}
                    </div>
                    <span class="text-sm text-text-light truncate max-w-[120px]">{{ service.author?.display_name || 'Unknown' }}</span>
                  </div>
                </td>
                <!-- Price -->
                <td class="px-3 py-3">
                  <div class="flex items-baseline gap-1">
                    <span class="text-sm font-semibold text-text-light tabular-nums">₱{{ formatPrice(service.price) }}</span>
                    <span class="text-xs text-text-muted-light">{{ paymentLabel(service.paymentType) }}</span>
                  </div>
                  <span
                    v-if="service.escrowAmount > 0"
                    class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200/50 mt-0.5"
                  >
                    <span class="material-symbols-outlined text-[10px]">verified</span>
                    Escrow
                  </span>
                </td>
                <!-- Status -->
                <td class="px-3 py-3">
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                    :class="statusClasses(service.status)"
                  >
                    {{ displayStatus(service.status) }}
                  </span>
                </td>
                <!-- Availability -->
                <td class="px-3 py-3 text-center">
                  <span
                    class="inline-flex items-center justify-center w-7 h-7 rounded-full"
                    :class="service.isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'"
                    :title="service.isAvailable ? 'Available' : 'Unavailable'"
                  >
                    <span class="material-symbols-outlined text-sm">{{ service.isAvailable ? 'check' : 'close' }}</span>
                  </span>
                </td>
                <!-- Offers -->
                <td class="px-3 py-3 text-center">
                  <span class="text-sm text-text-muted-light tabular-nums">{{ service.offers_count ?? '-' }}</span>
                </td>
                <!-- Action -->
                <td class="px-3 py-3 text-right">
                  <button
                    class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-text-muted-light hover:text-text-light"
                    @click.stop="$router.push(`/jobs/${service.id}`)"
                    aria-label="View details"
                  >
                    <span class="material-symbols-outlined text-lg">chevron_right</span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mobile Card Layout -->
      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
        <div
          v-for="service in paginatedServices"
          :key="service.id"
          @click="$router.push(`/jobs/${service.id}`)"
          class="group relative bg-white rounded-xl border border-gray-100 shadow-soft hover:shadow-lifted hover:border-primary/20 transition-all duration-300 overflow-hidden cursor-pointer"
        >
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
            <span class="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-white/90 backdrop-blur-sm text-text-light shadow-sm">
              {{ service.category ? formatText(service.category) : 'Uncategorized' }}
            </span>
            <span
              v-if="service.isAvailable !== undefined"
              class="absolute top-2.5 right-2.5 flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[11px] font-semibold backdrop-blur-sm"
              :class="service.isAvailable ? 'bg-emerald-500/90 text-white' : 'bg-gray-500/80 text-white'"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="service.isAvailable ? 'bg-white animate-pulse' : 'bg-gray-300'"></span>
              {{ service.isAvailable ? 'Available' : 'Unavailable' }}
            </span>
          </div>
          <div class="p-4">
            <div class="flex items-center justify-between mb-2">
              <span
                class="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wider uppercase"
                :class="statusClasses(service.status)"
              >
                {{ displayStatus(service.status) }}
              </span>
            </div>
            <h3 class="font-semibold text-sm text-text-light group-hover:text-primary transition-colors line-clamp-2 leading-snug mb-2">
              {{ service.title || 'Untitled Service' }}
            </h3>
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
            <div v-if="service.location?.stringified_address" class="flex items-center gap-1.5 mb-2.5">
              <span class="material-symbols-outlined text-[14px] text-text-muted-light">location_on</span>
              <span class="text-[11px] text-text-muted-light truncate">{{ service.location.stringified_address }}</span>
            </div>
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
          <div class="absolute inset-0 rounded-xl ring-1 ring-inset ring-primary/0 group-hover:ring-primary/20 transition-all duration-300 pointer-events-none"></div>
        </div>
      </div>
    </template>

    <!-- Pagination -->
    <Pagination
      v-if="!loading && services.length > 0"
      :currentPage="currentPage"
      :totalPages="totalPages"
      :tableData="tableData"
      :rowsPerPage="servicesPerPage"
      :rowsPerPageOptions="[12, 24, 48]"
      :itemLabel="'services'"
      @setPage="setPage"
      @prevPage="prevPage"
      @nextPage="nextPage"
      @update:rowsPerPage="servicesPerPage = $event"
    />
  </div>
</template>

<script>
import { db } from '@/firebase';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { formatText } from '@/utils/format.js';
import Pagination from '@/components/Pagination.vue';

export default {
  components: { Pagination },
  data() {
    return {
      services: [],
      loading: true,
      searchQuery: '',
      filterCategory: '',
      filterStatus: '',
      currentPage: 1,
      servicesPerPage: 12,
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
</style>
