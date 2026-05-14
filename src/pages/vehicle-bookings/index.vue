<template>
  <div>
    <Toast
      :message="toastMessage"
      :type="toastType"
      :showConfirmButtons="showConfirm"
      :id="confirmId"
      @confirm="handleConfirm"
      @cancel="clearToast"
    />

    <div class="px-4 py-5 sm:px-6 sm:py-6 space-y-5 sm:space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-text-light tracking-tight">
            Vehicle Bookings
          </h1>
          <p class="text-sm text-text-muted-light mt-1 max-w-2xl leading-relaxed">
            Manage and monitor all vehicle rental bookings across the platform.
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
            @click="fetchBookings"
          >
            <span class="material-symbols-outlined text-lg">refresh</span>
            <span class="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
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
          <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ stat.count }}</p>
        </div>
      </div>

      <BookingFilters
        :searchQuery="searchQuery"
        :filterStatus="filterStatus"
        :filterDriveType="filterDriveType"
        :filterVehicleType="filterVehicleType"
        @update:searchQuery="searchQuery = $event; currentPage = 1"
        @update:filterStatus="filterStatus = $event; currentPage = 1"
        @update:filterDriveType="filterDriveType = $event; currentPage = 1"
        @update:filterVehicleType="filterVehicleType = $event; currentPage = 1"
      />

      <div v-if="loading">
        <BookingSkeleton :count="6" />
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
        {{ error }}
        <button class="ml-2 underline font-medium" @click="fetchBookings">Try Again</button>
      </div>

      <div v-else-if="filteredBookings.length === 0">
        <EmptyBookings
          title="No bookings found"
          :message="hasActiveFilters ? 'Try adjusting your search or filters.' : 'No vehicle bookings have been created yet.'"
          actionLabel="Refresh"
          @action="fetchBookings"
        />
      </div>

      <template v-else>
        <BookingTable
          v-if="!isMobile"
          :bookings="paginatedBookings"
          @view="viewBooking"
          @approve="confirmApprove"
          @cancel="confirmCancel"
          @complete="confirmComplete"
          @print="printBooking"
        />

        <BookingCard
          v-else
          :bookings="paginatedBookings"
          @view="viewBooking"
        />

        <Pagination
          v-if="totalPages > 1"
          :currentPage="currentPage"
          :totalPages="totalPages"
          :tableData="tableData"
          itemLabel="bookings"
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
import VehicleBookingsDataService from '@/services/VehicleBookingsDataService';
import { db } from '@/firebase';
import { collection, getDocs } from 'firebase/firestore';
import BookingStatusBadge from '@/components/vehicle-bookings/BookingStatusBadge.vue';
import BookingTable from '@/components/vehicle-bookings/BookingTable.vue';
import BookingCard from '@/components/vehicle-bookings/BookingCard.vue';
import BookingFilters from '@/components/vehicle-bookings/BookingFilters.vue';
import BookingSkeleton from '@/components/vehicle-bookings/BookingSkeleton.vue';
import EmptyBookings from '@/components/vehicle-bookings/EmptyBookings.vue';
import Pagination from '@/components/Pagination.vue';
import Toast from '@/components/Toast.vue';

export default {
  components: {
    BookingStatusBadge, BookingTable, BookingCard, BookingFilters,
    BookingSkeleton, EmptyBookings, Pagination, Toast
  },
  data() {
    return {
      bookings: [],
      vehicleListings: [],
      loading: true,
      error: null,
      searchQuery: '',
      filterStatus: '',
      filterDriveType: '',
      filterVehicleType: '',
      currentPage: 1,
      perPage: 20,
      isMobile: false,
      unsubscribe: null,
      toastMessage: '',
      toastType: '',
      showConfirm: false,
      confirmId: null,
      pendingAction: null
    };
  },
  computed: {
    statCards() {
      const counts = this.getStatusCounts();
      return [
        { key: '', label: 'Total', count: this.bookings.length, icon: 'receipt_long', iconClass: 'text-text-muted-light', borderClass: 'border-l-4 border-primary' },
        { key: 'active', label: 'Active', count: counts.active, icon: 'play_circle', iconClass: 'text-blue-500', borderClass: 'border-l-4 border-blue-500' },
        { key: 'pending', label: 'Pending', count: counts.pending, icon: 'hourglass_empty', iconClass: 'text-amber-400', borderClass: 'border-l-4 border-amber-400' },
        { key: 'completed', label: 'Completed', count: counts.completed, icon: 'check_circle', iconClass: 'text-green-500', borderClass: 'border-l-4 border-green-500' },
      ];
    },
    filteredBookings() {
      return this.bookings.filter(b => {
        const q = this.searchQuery.toLowerCase().trim();
        if (q) {
          const plate = b.rental_details?.info?.plateNumber || '';
          const lesseeName = [b.lessee?.name, b.lessee?.lastName].filter(Boolean).join(' ');
          const phone = b.lessee?.phoneNumber || '';
          const searchable = [b.id, plate, lesseeName, phone].filter(Boolean).join(' ').toLowerCase();
          if (!searchable.includes(q)) return false;
        }
        if (this.filterStatus && (b.status || '').toLowerCase() !== this.filterStatus.toLowerCase()) return false;
        if (this.filterDriveType && (b.driveType || '') !== this.filterDriveType) return false;
        if (this.filterVehicleType && (b.rental_details?.info?.type || '') !== this.filterVehicleType) return false;
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
    },
    hasActiveFilters() {
      return !!(this.searchQuery || this.filterStatus || this.filterDriveType || this.filterVehicleType);
    }
  },
  methods: {
    getStatusCounts() {
      const counts = { active: 0, pending: 0, completed: 0, cancelled: 0 };
      this.bookings.forEach(b => {
        const s = (b.status || '').toLowerCase();
        if (s in counts) counts[s]++;
      });
      return counts;
    },
    formatPrice(n) {
      if (n == null) return '0';
      return Number(n).toLocaleString();
    },
    viewBooking(id) {
      this.$router.push(`/vehicle-bookings/${id}`);
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
      this.showConfirm = false;
    },
    clearToast() {
      this.toastMessage = '';
      this.toastType = '';
      this.showConfirm = false;
      this.confirmId = null;
      this.pendingAction = null;
    },
    confirmApprove(id) {
      this.toastMessage = 'Approve this booking?';
      this.toastType = 'confirm';
      this.showConfirm = true;
      this.confirmId = id;
      this.pendingAction = 'approve';
    },
    confirmCancel(id) {
      this.toastMessage = 'Cancel this booking?';
      this.toastType = 'confirm';
      this.showConfirm = true;
      this.confirmId = id;
      this.pendingAction = 'cancel';
    },
    confirmComplete(id) {
      this.toastMessage = 'Mark this booking as completed?';
      this.toastType = 'confirm';
      this.showConfirm = true;
      this.confirmId = id;
      this.pendingAction = 'complete';
    },
    async handleConfirm(id) {
      try {
        if (this.pendingAction === 'approve') {
          await VehicleBookingsDataService.approveBooking(id);
          this.showToast('Booking approved successfully');
        } else if (this.pendingAction === 'cancel') {
          await VehicleBookingsDataService.cancelBooking(id);
          this.showToast('Booking cancelled');
        } else if (this.pendingAction === 'complete') {
          await VehicleBookingsDataService.completeBooking(id);
          this.showToast('Booking completed');
        }
      } catch (err) {
        this.showToast(err.message || 'Action failed', 'error');
      }
      this.clearToast();
    },
    printBooking(id) {
      const booking = this.bookings.find(b => b.id === id);
      if (!booking) return;
      const win = window.open('', '_blank');
      if (!win) return;
      const lessee = booking.lessee || {};
      const vehicle = booking.rental_details?.info || {};
      win.document.write(`
        <html><head><title>Booking #${id.slice(-8)}</title>
        <style>body{font-family:Arial;padding:40px;color:#333}table{width:100%;border-collapse:collapse}td,th{padding:8px 12px;border:1px solid #ddd;text-align:left}h1{color:#137fec}.badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold}.badge-active{background:#dbeafe;color:#1d4ed8}.badge-pending{background:#fef3c7;color:#b45309}.badge-completed{background:#d1fae5;color:#047857}.badge-cancelled{background:#fee2e2;color:#b91c1c}</style></head><body>
        <h1>Vehicle Booking Receipt</h1>
        <p style="color:#666">Booking #${id.slice(-8)}</p>
        <hr style="margin:20px 0"/>
        <h2>Vehicle Details</h2>
        <table><tr><th>Brand</th><td>${vehicle.brand || '—'}</td></tr><tr><th>Model</th><td>${vehicle.model || '—'}</td></tr><tr><th>Plate Number</th><td>${vehicle.plateNumber || '—'}</td></tr><tr><th>Type</th><td>${vehicle.type || '—'}</td></tr><tr><th>Transmission</th><td>${vehicle.transmission || '—'}</td></tr></table>
        <h2>Lessee Details</h2>
        <table><tr><th>Name</th><td>${lessee.name || ''} ${lessee.lastName || ''}</td></tr><tr><th>Phone</th><td>${lessee.phoneNumber || '—'}</td></tr><tr><th>Address</th><td>${lessee.address || '—'}</td></tr></table>
        <h2>Booking Summary</h2>
        <table><tr><th>Status</th><td><span class="badge badge-${(booking.status || '').toLowerCase()}">${(booking.status || '—').toUpperCase()}</span></td></tr><tr><th>Drive Type</th><td>${booking.driveType || '—'}</td></tr><tr><th>Rental Price</th><td>₱${this.formatPrice(booking.pricing?.price)}</td></tr><tr><th>Deposit</th><td>₱${this.formatPrice(booking.deposit_amount)}</td></tr></table>
        <hr style="margin:20px 0"/><p style="color:#999;font-size:12px">Generated on ${new Date().toLocaleString()}</p>
        </body></html>
      `);
      win.document.close();
      win.print();
    },
    exportCSV() {
      const headers = ['Booking ID', 'Brand', 'Model', 'Plate Number', 'Vehicle Type', 'Lessee Name', 'Phone Number', 'Drive Type', 'Rental Price', 'Deposit', 'Status', 'Created Date'];
      const rows = this.bookings.map(b => {
        const v = b.rental_details?.info || {};
        const l = b.lessee || {};
        return [
          b.id, v.brand || '', v.model || '', v.plateNumber || '', v.type || '',
          [l.name, l.lastName].filter(Boolean).join(' '), l.phoneNumber || '',
          b.driveType || '', b.pricing?.price || '', b.deposit_amount || '',
          b.status || '', this.formatDate(b.createdAt)
        ];
      });
      const csv = [headers, ...rows].map(r => r.map(c => `"${String(c || '').replace(/"/g, '""')}"`).join(',')).join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `vehicle-bookings-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      this.showToast('CSV exported successfully');
    },
    formatDate(date) {
      if (!date) return '—';
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    checkMobile() {
      this.isMobile = window.innerWidth < 768;
    },
    fetchBookings() {
      this.loading = true;
      this.error = null;
      if (this.unsubscribe) this.unsubscribe();
      this.unsubscribe = VehicleBookingsDataService.getAll(
        (bookings) => {
          this.bookings = bookings;
          this.loading = false;
        },
        (error) => {
          this.error = error.message || 'Failed to load bookings';
          this.loading = false;
        }
      );
    }
  },
  watch: {
    searchQuery() { this.currentPage = 1; },
    filterStatus() { this.currentPage = 1; },
    filterDriveType() { this.currentPage = 1; },
    filterVehicleType() { this.currentPage = 1; }
  },
  mounted() {
    this.checkMobile();
    window.addEventListener('resize', this.checkMobile);
    this.fetchBookings();
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
