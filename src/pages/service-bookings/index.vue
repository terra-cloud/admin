<template>
  <div>
    <div class="px-4 py-5 sm:px-6 sm:py-6 space-y-5 sm:space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-text-light tracking-tight">
            Service Bookings
          </h1>
          <p class="text-sm text-text-muted-light mt-1 max-w-2xl leading-relaxed">
            Manage all service booking transactions across the marketplace.
          </p>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 md:gap-4">
        <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-primary hover:shadow-lifted transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Total</span>
            <span class="material-symbols-outlined text-text-muted-light text-xl">receipt_long</span>
          </div>
          <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ stats.total }}</p>
          <p class="text-xs text-text-muted-light mt-1">All bookings</p>
        </div>
        <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-amber-400 hover:shadow-lifted transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Pending</span>
            <span class="material-symbols-outlined text-amber-400 text-xl">hourglass_empty</span>
          </div>
          <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ stats.pendingAcceptance }}</p>
          <p class="text-xs text-text-muted-light mt-1">Awaiting response</p>
        </div>
        <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-blue-500 hover:shadow-lifted transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Accepted</span>
            <span class="material-symbols-outlined text-blue-500 text-xl">thumb_up</span>
          </div>
          <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ stats.accepted }}</p>
          <p class="text-xs text-text-muted-light mt-1">Confirmed bookings</p>
        </div>
        <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-primary hover:shadow-lifted transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">On Going</span>
            <span class="material-symbols-outlined text-primary text-xl">pending_actions</span>
          </div>
          <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ stats.onGoing }}</p>
          <p class="text-xs text-text-muted-light mt-1">In progress</p>
        </div>
        <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-green-500 hover:shadow-lifted transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Completed</span>
            <span class="material-symbols-outlined text-green-500 text-xl">check_circle</span>
          </div>
          <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ stats.completed }}</p>
          <p class="text-xs text-text-muted-light mt-1">Delivered & done</p>
        </div>
        <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-red-500 hover:shadow-lifted transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Cancelled</span>
            <span class="material-symbols-outlined text-red-500 text-xl">cancel</span>
          </div>
          <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ stats.cancelled }}</p>
          <p class="text-xs text-text-muted-light mt-1">Voided transactions</p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-soft p-4 space-y-4">
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1 min-w-0">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted-light">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by booking ID, service title, employer, or terran..."
              class="w-full pl-9 pr-3 py-2.5 bg-input-light border-none rounded-lg text-sm placeholder:text-text-muted-light focus:ring-2 focus:ring-primary/30 outline-none"
            />
          </div>
          <select
            v-model="filterStatus"
            class="px-3 py-2.5 bg-input-light border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30 text-text-muted-light"
          >
            <option value="">All Statuses</option>
            <option value="pendingAcceptance">Pending Acceptance</option>
            <option value="accepted">Accepted</option>
            <option value="onGoing">On Going</option>
            <option value="delivered">Delivered</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="space-y-4">
        <div v-for="n in 5" :key="n" class="bg-white rounded-xl shadow-soft p-6 animate-pulse">
          <div class="flex gap-4">
            <div class="w-14 h-14 bg-gray-200 rounded-xl"></div>
            <div class="flex-1 space-y-3">
              <div class="h-4 bg-gray-200 rounded w-1/3"></div>
              <div class="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
        {{ error }}
        <button class="ml-2 underline" @click="fetchBookings">Try Again</button>
      </div>

      <div v-else-if="filteredBookings.length === 0" class="bg-white rounded-xl shadow-soft p-12 text-center">
        <span class="material-symbols-outlined text-5xl text-text-muted-light">receipt_long</span>
        <h3 class="text-lg font-semibold text-text-light mt-4">No bookings found</h3>
        <p class="text-sm text-text-muted-light mt-1">Try adjusting your search or filters.</p>
      </div>

      <template v-else>
        <div class="bg-white rounded-xl shadow-soft overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full border-collapse">
              <thead>
                <tr class="border-b border-gray-100 bg-gray-50/50">
                  <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Booking</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Service</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Employer</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Terran</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Price</th>
                  <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Status</th>
                  <th class="px-4 py-3 text-right text-xs font-medium text-text-muted-light uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="booking in paginatedBookings" :key="booking.id" class="border-b border-gray-100 hover:bg-gray-50/30 transition-colors">
                  <td class="px-4 py-4">
                    <div class="flex items-center gap-2">
                      <span class="w-2 h-2 rounded-full" :class="statusDotClass(booking.status)"></span>
                      <span class="text-sm font-medium text-text-light">#{{ booking.id.slice(-6) }}</span>
                    </div>
                    <p class="text-[10px] text-text-muted-light mt-0.5">{{ formatDate(booking.createdAt) }}</p>
                  </td>
                  <td class="px-4 py-4">
                    <div class="flex items-center gap-3">
                      <img
                        v-if="serviceListings[booking.job_id]?.images?.[0]"
                        :src="serviceListings[booking.job_id].images[0]"
                        class="w-10 h-10 rounded-lg object-cover shrink-0"
                        alt=""
                      />
                      <div v-else class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                        <span class="material-symbols-outlined text-gray-300 text-lg">work</span>
                      </div>
                      <div class="min-w-0">
                        <p class="text-sm font-medium text-text-light truncate max-w-[180px]">{{ serviceListings[booking.job_id]?.title ? formatText(serviceListings[booking.job_id]?.title) : 'Unknown Service' }}</p>
                        <p class="text-xs text-text-muted-light">{{ serviceListings[booking.job_id]?.category ? formatText(serviceListings[booking.job_id]?.category) : '' }}</p>
                      </div>
                    </div>
                  </td>
                  <td class="px-4 py-4">
                    <div class="flex items-center gap-2">
                      <img
                        v-if="serviceListings[booking.job_id]?.author?.photo_url"
                        :src="serviceListings[booking.job_id].author.photo_url"
                        class="w-7 h-7 rounded-full object-cover"
                        alt=""
                      />
                      <div v-else class="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold">
                        {{ getInitials(serviceListings[booking.job_id]?.author) }} 
                      </div>
                      <span class="text-sm text-text-light truncate max-w-[180px]">{{ displayName(serviceListings[booking.job_id]?.author) }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-4">
                    <div class="flex items-center gap-2">
                      <img
                        v-if="booking.terran?.photo_url"
                        :src="booking.terran.photo_url"
                        class="w-7 h-7 rounded-full object-cover"
                        alt=""
                      />
                      <div v-else class="w-7 h-7 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 text-[10px] font-bold">
                        {{ getInitials(booking.terran) }}
                      </div>
                      <span class="text-sm text-text-light truncate max-w-[100px]">{{ booking.terran?.display_name || '—' }}</span>
                    </div>
                  </td>
                  <td class="px-4 py-4">
                    <span class="text-sm font-semibold text-primary tabular-nums">₱{{ formatPrice(booking.acceptedPrice || booking.escrowAmount || 0) }}</span>
                  </td>
                  <td class="px-4 py-4">
                    <BookingStatusBadge :status="booking.status" />
                  </td>
                  <td class="px-4 py-4 text-right">
                    <router-link
                      :to="`/service-bookings/${booking.id}`"
                      class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-primary hover:bg-primary/5 transition-colors"
                    >
                      View
                    </router-link>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <Pagination
          v-if="totalPages > 1"
          :currentPage="currentPage"
          :totalPages="totalPages"
          :tableData="tableData"
          @setPage="setPage"
          @prevPage="prevPage"
          @nextPage="nextPage"
        />
      </template>
    </div>
  </div>
</template>

<script>
import ServiceBookingsDataService from '@/services/ServiceBookingsDataService';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/firebase';
import BookingStatusBadge from '@/pages/service-bookings/components/BookingStatusBadge.vue';
import Pagination from '@/components/Pagination.vue';
import { displayName, formatText } from '@/utils/format';

export default {
  components: { BookingStatusBadge, Pagination },
  data() {
    return {
      bookings: [],
      serviceListings: {},
      loading: true,
      error: null,
      searchQuery: '',
      filterStatus: '',
      currentPage: 1,
      perPage: 20,
      stats: {
        total: 0, pendingAcceptance: 0, accepted: 0,
        onGoing: 0, delivered: 0, completed: 0, cancelled: 0
      },
      unsubscribe: null
    };
  },
  computed: {
    filteredBookings() {
      return this.bookings.filter(b => {
        if (!b.job_id) return false;
        const listing = this.serviceListings[b.job_id];
        if (!listing) return false;

        const q = this.searchQuery.toLowerCase().trim();
        if (q) {
          const terms = [
            b.id,
            listing.title,
            listing.author?.display_name,
            b.terran?.display_name,
          ].filter(Boolean).join(' ').toLowerCase();
          if (!terms.includes(q)) return false;
        }
        if (this.filterStatus && (b.status || '').toLowerCase() !== this.filterStatus.toLowerCase()) return false;
        return true;
      });
    },
    paginatedBookings() {
      const start = (this.currentPage - 1) * this.perPage;
      return this.filteredBookings.slice(start, start + this.perPage);
    },
    totalPages() {
      return Math.ceil(this.filteredBookings.length / this.perPage);
    },
    tableData() {
      const total = this.filteredBookings.length;
      const from = total === 0 ? 0 : (this.currentPage - 1) * this.perPage + 1;
      const to = Math.min(from + this.paginatedBookings.length - 1, total);
      return { from, to, totalItems: total };
    }
  },
  methods: {
    formatText,
    displayName,
    formatPrice(n) {
      if (n == null) return '0';
      return Number(n).toLocaleString();
    },
    formatDate(date) {
      if (!date) return '—';
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    getInitials(author) {
      if (!author || !author.display_name) return '?';
      return author.display_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    },
    statusDotClass(status) {
      const map = {
        pendingAcceptance: 'bg-amber-400',
        accepted: 'bg-blue-400',
        onGoing: 'bg-primary',
        delivered: 'bg-purple-400',
        completed: 'bg-green-400',
        cancelled: 'bg-red-400'
      };
      return map[(status || '').toLowerCase()] || 'bg-gray-400';
    },
    async fetchServiceListings() {
      try {
        const snapshot = await getDocs(collection(db, 'service-listings'));
        const map = {};
        snapshot.docs.forEach(d => {
          map[d.id] = { id: d.id, ...d.data() };
        });
        this.serviceListings = map;
      } catch (err) {
        console.error('Error fetching service listings:', err);
      }
    },
    fetchBookings() {
      this.loading = true;
      this.error = null;
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = ServiceBookingsDataService.getAll(
        (bookings) => {
          this.bookings = bookings.filter(b => b.job_id);
          this.updateStats();
          this.fetchServiceListings();
          this.loading = false;
        },
        (error) => {
          this.error = error.message || 'Failed to load bookings';
          this.loading = false;
        }
      );
    },
    updateStats() {
      const counts = { total: this.bookings.length, pendingAcceptance: 0, accepted: 0, onGoing: 0, delivered: 0, completed: 0, cancelled: 0 };
      this.bookings.forEach(b => {
        const s = (b.status || '').toLowerCase();
        if (s in counts) counts[s]++;
      });
      this.stats = counts;
    },
    setPage(page) {
      if (page >= 1 && page <= this.totalPages) this.currentPage = page;
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    }
  },
  watch: {
    searchQuery() { this.currentPage = 1; },
    filterStatus() { this.currentPage = 1; }
  },
  mounted() {
    this.fetchBookings();
  },
  beforeUnmount() {
    if (this.unsubscribe) this.unsubscribe();
  }
};
</script>

<style scoped>
@reference "tailwindcss";
</style>
