<template>
  <div class="bg-white rounded-xl shadow-soft overflow-hidden">
    <div class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="border-b border-gray-100 bg-gray-50/50 sticky top-0 z-10">
            <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Booking ID</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Vehicle</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Lessee</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Drive Type</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Price</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Deposit</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Status</th>
            <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Created</th>
            <th class="px-4 py-3 text-right text-xs font-medium text-text-muted-light uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="booking in bookings"
            :key="booking.id"
            class="border-b border-gray-100 hover:bg-gray-50/50 transition-colors cursor-pointer"
            @click="$emit('view', booking.id)"
          >
            <td class="px-4 py-4">
              <div class="flex items-center gap-2">
                <span class="w-2 h-2 rounded-full" :class="statusDotClass(booking.status)"></span>
                <span class="text-sm font-medium text-text-light font-mono">#{{ (booking.id || '').slice(-8) }}</span>
              </div>
            </td>
            <td class="px-4 py-4">
              <div class="flex items-center gap-3">
                <img
                  v-if="getVehicleImage(booking)"
                  :src="getVehicleImage(booking)"
                  class="w-10 h-10 rounded-lg object-cover shrink-0"
                  alt=""
                  loading="lazy"
                />
                <div v-else class="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
                  <span class="material-symbols-outlined text-gray-300 text-lg">directions_car</span>
                </div>
                <div class="min-w-0">
                  <p class="text-sm font-medium text-text-light truncate max-w-[150px]">{{ getVehicleName(booking) }}</p>
                  <p class="text-xs text-text-muted-light">{{ getPlateNumber(booking) }}</p>
                </div>
              </div>
            </td>
            <td class="px-4 py-4">
              <div class="min-w-0">
                <p class="text-sm text-text-light truncate max-w-[130px]">{{ getLesseeName(booking) }}</p>
                <p class="text-xs text-text-muted-light">{{ booking.lessee?.phoneNumber || '—' }}</p>
              </div>
            </td>
            <td class="px-4 py-4">
              <span class="text-sm text-text-light capitalize">{{ formatDriveType(booking.driveType) }}</span>
            </td>
            <td class="px-4 py-4">
              <span class="text-sm font-semibold text-primary tabular-nums">₱{{ formatPrice(booking.pricing?.price) }}</span>
            </td>
            <td class="px-4 py-4">
              <span class="text-sm text-text-light tabular-nums">₱{{ formatPrice(booking.deposit_amount) }}</span>
            </td>
            <td class="px-4 py-4">
              <BookingStatusBadge :status="booking.status" />
            </td>
            <td class="px-4 py-4">
              <span class="text-xs text-text-muted-light whitespace-nowrap">{{ formatDate(booking.createdAt) }}</span>
            </td>
            <td class="px-4 py-4 text-right">
              <div class="relative inline-block" @click.stop>
                <button
                  class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-text-muted-light"
                  @click="toggleMenu(booking.id)"
                >
                  <span class="material-symbols-outlined text-lg">more_vert</span>
                </button>
                <div
                  v-if="openMenuId === booking.id"
                  class="absolute right-0 top-full mt-1 bg-white rounded-xl shadow-lifted border border-gray-100 py-1 min-w-[180px] z-20"
                >
                  <button class="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-light hover:bg-gray-50 text-left" @click="closeAndEmit('view', booking.id)">
                    <span class="material-symbols-outlined text-lg text-text-muted-light">visibility</span>
                    View Details
                  </button>
                  <button v-if="(booking.status || '').toLowerCase() === 'pending'" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-green-700 hover:bg-green-50 text-left" @click="closeAndEmit('approve', booking.id)">
                    <span class="material-symbols-outlined text-lg">check_circle</span>
                    Approve Booking
                  </button>
                  <button v-if="['pending', 'active'].includes((booking.status || '').toLowerCase())" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-red-700 hover:bg-red-50 text-left" @click="closeAndEmit('cancel', booking.id)">
                    <span class="material-symbols-outlined text-lg">cancel</span>
                    Cancel Booking
                  </button>
                  <button v-if="(booking.status || '').toLowerCase() === 'active'" class="w-full flex items-center gap-2 px-3 py-2 text-sm text-blue-700 hover:bg-blue-50 text-left" @click="closeAndEmit('complete', booking.id)">
                    <span class="material-symbols-outlined text-lg">task_alt</span>
                    Complete Booking
                  </button>
                  <button class="w-full flex items-center gap-2 px-3 py-2 text-sm text-text-light hover:bg-gray-50 text-left" @click="closeAndEmit('print', booking.id)">
                    <span class="material-symbols-outlined text-lg">print</span>
                    Print Booking
                  </button>
                </div>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
import BookingStatusBadge from './BookingStatusBadge.vue';

export default {
  components: { BookingStatusBadge },
  props: {
    bookings: { type: Array, default: () => [] }
  },
  emits: ['view', 'approve', 'cancel', 'complete', 'print'],
  data() {
    return {
      openMenuId: null
    };
  },
  methods: {
    toggleMenu(id) {
      this.openMenuId = this.openMenuId === id ? null : id;
    },
    closeAndEmit(action, id) {
      this.openMenuId = null;
      this.$emit(action, id);
    },
    getVehicleImage(booking) {
      return booking.rental_details?.info?.images?.[0] || null;
    },
    getVehicleName(booking) {
      const info = booking.rental_details?.info;
      if (!info) return 'Unknown Vehicle';
      return `${info.brand || ''} ${info.model || ''}`.trim() || 'Unknown Vehicle';
    },
    getPlateNumber(booking) {
      return booking.rental_details?.info?.plateNumber || '—';
    },
    getLesseeName(booking) {
      const lessee = booking.lessee;
      if (!lessee) return '—';
      return [lessee.name, lessee.lastName].filter(Boolean).join(' ') || '—';
    },
    formatDriveType(type) {
      const map = { selfDrive: 'Self Drive', withDriver: 'With Driver' };
      return map[type] || type || '—';
    },
    formatPrice(n) {
      if (n == null) return '0';
      return Number(n).toLocaleString();
    },
    formatDate(date) {
      if (!date) return '—';
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    statusDotClass(status) {
      const map = { active: 'bg-blue-400', pending: 'bg-amber-400', completed: 'bg-green-400', cancelled: 'bg-red-400' };
      return map[(status || '').toLowerCase()] || 'bg-gray-400';
    }
  },
  watch: {
    bookings() {
      this.openMenuId = null;
    }
  }
};
</script>
