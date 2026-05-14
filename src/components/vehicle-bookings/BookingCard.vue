<template>
  <div class="space-y-3">
    <div
      v-for="booking in bookings"
      :key="booking.id"
      class="bg-white rounded-xl shadow-soft p-4 hover:shadow-lifted transition-shadow cursor-pointer border border-gray-100/50"
      @click="$emit('view', booking.id)"
    >
      <div class="flex items-start gap-3">
        <img
          v-if="getVehicleImage(booking)"
          :src="getVehicleImage(booking)"
          class="w-16 h-16 rounded-xl object-cover shrink-0"
          alt=""
          loading="lazy"
        />
        <div v-else class="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0">
          <span class="material-symbols-outlined text-gray-300 text-2xl">directions_car</span>
        </div>
        <div class="flex-1 min-w-0">
          <div class="flex items-start justify-between gap-2">
            <div>
              <p class="text-sm font-semibold text-text-light truncate">{{ getVehicleName(booking) }}</p>
              <p class="text-xs text-text-muted-light font-mono">#{{ (booking.id || '').slice(-8) }}</p>
            </div>
            <BookingStatusBadge :status="booking.status" />
          </div>
          <div class="mt-2 grid grid-cols-2 gap-x-3 gap-y-1.5 text-xs">
            <div>
              <span class="text-text-muted-light">Lessee:</span>
              <span class="text-text-light ml-1 font-medium">{{ getLesseeName(booking) }}</span>
            </div>
            <div>
              <span class="text-text-muted-light">Plate:</span>
              <span class="text-text-light ml-1 font-medium">{{ getPlateNumber(booking) }}</span>
            </div>
            <div>
              <span class="text-text-muted-light">Price:</span>
              <span class="text-primary ml-1 font-semibold">₱{{ formatPrice(booking.pricing?.price) }}</span>
            </div>
            <div>
              <span class="text-text-muted-light">Drive:</span>
              <span class="text-text-light ml-1 capitalize">{{ formatDriveType(booking.driveType) }}</span>
            </div>
          </div>
          <div class="mt-2 pt-2 border-t border-gray-100 flex items-center justify-between">
            <span class="text-[10px] text-text-muted-light">{{ formatDate(booking.createdAt) }}</span>
            <span class="text-primary text-xs font-medium">View Details →</span>
          </div>
        </div>
      </div>
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
  emits: ['view'],
  methods: {
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
    }
  }
};
</script>
