<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6">
    <router-link to="/service-bookings" class="inline-flex items-center gap-2 text-text-muted-light hover:text-text-light mb-6">
      <i class="fas fa-arrow-left"></i> Back to Bookings
    </router-link>

    <div v-if="loading" class="space-y-4">
      <div class="bg-white rounded-xl shadow-soft p-6 animate-pulse space-y-4">
        <div class="h-6 bg-gray-200 rounded w-1/3"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        <div class="h-32 bg-gray-200 rounded"></div>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
      {{ error }}
    </div>

    <template v-else-if="booking && listing">
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-3">
          <h1 class="text-xl font-bold text-text-light">
            Booking #{{ booking.id.slice(-8) }}
          </h1>
          <BookingStatusBadge :status="booking.status" />
        </div>
        <div class="flex items-center gap-2">
          <button
            class="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-xl text-sm font-medium text-text-light hover:bg-gray-50 transition-colors"
            @click="shareBooking"
          >
            <span class="material-symbols-outlined text-lg">share</span>
            Share
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-soft p-6 mb-6 relative overflow-hidden">
        <div class="absolute top-4 right-6 text-right">
          <p class="text-2xl font-black text-primary">₱{{ formatPrice(booking.acceptedPrice || booking.escrowAmount || 0) }}</p>
        </div>
        <div class="max-w-2xl">
          <p class="text-xs text-text-muted-light uppercase tracking-wider font-medium mb-1">{{ listing.category || 'Service' }}</p>
          <h2 class="text-2xl font-bold text-text-light">{{ listing.title || 'Untitled Service' }}</h2>
          <p class="text-sm text-text-muted-light mt-2 line-clamp-2">{{ listing.description || '' }}</p>
        </div>
        <div class="mt-6">
          <div class="relative">
            <div class="absolute top-1/2 left-0 w-full h-1 bg-gray-100 -translate-y-1/2 rounded-full"></div>
            <div
              class="absolute top-1/2 left-0 h-1 bg-primary -translate-y-1/2 rounded-full transition-all duration-500"
              :style="{ width: progressPercent + '%' }"
            ></div>
            <div class="flex justify-between relative z-10">
              <div
                v-for="(step, i) in workflowSteps"
                :key="step.key"
                class="flex flex-col items-center"
                :class="i === 0 ? 'items-start' : i === workflowSteps.length - 1 ? 'items-end' : ''"
              >
                <div
                  class="w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300"
                  :class="stepClass(step.key)"
                >
                  <span v-if="isStepComplete(step.key)" class="material-symbols-outlined text-sm" style="font-variation-settings: 'FILL' 1">check</span>
                  <span v-else-if="isStepCurrent(step.key)" class="w-2.5 h-2.5 bg-white rounded-full"></span>
                  <span v-else class="w-2 h-2 bg-gray-300 rounded-full"></span>
                </div>
                <p class="text-[10px] font-medium mt-1.5 whitespace-nowrap" :class="stepTextClass(step.key)">{{ step.label }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-8 space-y-6">
          <div class="bg-white rounded-2xl shadow-soft p-6 border border-gray-100/50">
            <h3 class="text-base font-semibold text-text-light mb-4">Service Details</h3>
            <div class="flex gap-4 mb-4">
              <img
                v-if="listing.images?.[0]"
                :src="listing.images[0]"
                class="w-24 h-24 rounded-xl object-cover"
                alt=""
              />
              <div v-else class="w-24 h-24 rounded-xl bg-gray-100 flex items-center justify-center">
                <span class="material-symbols-outlined text-3xl text-gray-300">work</span>
              </div>
              <div class="flex-1">
                <p class="text-sm text-text-muted-light">{{ listing.description || 'No description provided.' }}</p>
              </div>
            </div>
            <div class="grid grid-cols-2 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-lg">category</span>
                <div>
                  <p class="text-[10px] text-text-muted-light uppercase">Category</p>
                  <p class="text-sm font-semibold">{{ listing.category || '—' }}</p>
                </div>
              </div>
              <div class="flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-lg">payments</span>
                <div>
                  <p class="text-[10px] text-text-muted-light uppercase">Payment</p>
                  <p class="text-sm font-semibold">{{ listing.paymentType || '—' }}</p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div class="bg-white rounded-2xl shadow-soft p-5 border border-gray-100/50">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Employer</span>
                <span v-if="listing.author?.kyc_validated === 1" class="material-symbols-outlined text-primary text-lg" style="font-variation-settings: 'FILL' 1">verified</span>
              </div>
              <div class="flex items-center gap-3">
                <img
                  v-if="listing.author?.photo_url"
                  :src="listing.author.photo_url"
                  class="w-12 h-12 rounded-full object-cover"
                  alt=""
                />
                <div v-else class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                  {{ getInitials(listing.author) }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-text-light">{{ listing.author?.display_name || 'Unknown' }}</p>
                  <p class="text-xs text-text-muted-light">{{ listing.author?.account_type === 2 ? 'Employer' : 'Client' }}</p>
                </div>
              </div>
            </div>
            <div class="bg-white rounded-2xl shadow-soft p-5 border border-gray-100/50">
              <div class="flex items-center justify-between mb-3">
                <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Terran</span>
                <span v-if="booking.terran?.kyc_validated === 1" class="material-symbols-outlined text-purple-600 text-lg" style="font-variation-settings: 'FILL' 1">verified</span>
              </div>
              <div class="flex items-center gap-3">
                <img
                  v-if="booking.terran?.photo_url"
                  :src="booking.terran.photo_url"
                  class="w-12 h-12 rounded-full object-cover"
                  alt=""
                />
                <div v-else class="w-12 h-12 rounded-full bg-purple-50 flex items-center justify-center text-purple-600 font-bold">
                  {{ getInitials(booking.terran) }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-text-light">{{ booking.terran?.display_name || '—' }}</p>
                  <p class="text-xs text-text-muted-light flex items-center gap-1">
                    <span class="material-symbols-outlined text-[12px] text-amber-500" style="font-variation-settings: 'FILL' 1">star</span>
                    {{ booking.terran?.averageRating || 'New' }}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div class="bg-white rounded-xl shadow-soft p-5 border-l-4 border-l-primary">
              <p class="text-xs text-text-muted-light uppercase tracking-wider">Escrow Amount</p>
              <p class="text-xl font-bold text-primary mt-1">₱{{ formatPrice(booking.escrowAmount || 0) }}</p>
              <p class="text-[10px] text-green-600 font-semibold mt-1 uppercase">
                <span v-if="booking.escrowAmount">Secured</span>
                <span v-else>—</span>
              </p>
            </div>
            <div class="bg-white rounded-xl shadow-soft p-5 border-l-4 border-l-amber-400">
              <p class="text-xs text-text-muted-light uppercase tracking-wider">Accepted Price</p>
              <p class="text-xl font-bold text-text-light mt-1">₱{{ formatPrice(booking.acceptedPrice || 0) }}</p>
              <p class="text-[10px] text-text-muted-light font-semibold mt-1 uppercase">{{ booking.status || 'Pending' }}</p>
            </div>
            <div class="bg-white rounded-xl shadow-soft p-5 border-l-4 border-l-green-500">
              <p class="text-xs text-text-muted-light uppercase tracking-wider">Payment Status</p>
              <p class="text-xl font-bold text-text-light mt-1 capitalize">{{ booking.paymentStatus || '—' }}</p>
              <p class="text-[10px] text-text-muted-light font-semibold mt-1 uppercase">Phase {{ progressPhase }}/3</p>
            </div>
          </div>

          <div class="bg-white rounded-2xl shadow-soft p-6 border border-gray-100/50">
            <h3 class="text-base font-semibold text-text-light mb-4">Activity Timeline</h3>
            <div class="space-y-0">
              <div v-for="(event, i) in timelineEvents" :key="i" class="flex gap-4">
                <div class="flex flex-col items-center">
                  <div
                    class="w-7 h-7 rounded-full flex items-center justify-center"
                    :class="event.active ? 'bg-primary text-white' : 'bg-gray-100 text-gray-400'"
                  >
                    <span class="material-symbols-outlined text-sm">{{ event.icon }}</span>
                  </div>
                  <div v-if="i < timelineEvents.length - 1" class="w-0.5 flex-1 bg-gray-100 my-1"></div>
                </div>
                <div class="pb-6">
                  <p class="text-sm font-medium text-text-light" :class="{ 'font-bold': event.active }">{{ event.label }}</p>
                  <p class="text-xs text-text-muted-light">{{ event.date }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="lg:col-span-4 space-y-6">
          <div class="sticky top-24 space-y-6">
            <div class="bg-white rounded-2xl shadow-soft p-5 border border-gray-100/50">
              <h3 class="text-sm font-semibold text-text-light mb-3">Manage Booking</h3>
              <div class="space-y-2">
                <button class="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium text-text-light">
                  <span class="material-symbols-outlined text-primary">chat</span>
                  Message Employer
                </button>
                <button
                  v-if="booking.terran"
                  class="w-full flex items-center gap-3 p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors text-sm font-medium text-text-light"
                >
                  <span class="material-symbols-outlined text-purple-600">chat_bubble</span>
                  Message Terran
                </button>
                <div class="h-px bg-gray-100 my-2"></div>
                <button
                  v-if="booking.status === 'onGoing'"
                  class="w-full flex items-center justify-center gap-2 py-3 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all"
                >
                  <span class="material-symbols-outlined">task_alt</span>
                  Release Escrow
                </button>
                <button
                  v-if="booking.status === 'onGoing'"
                  class="w-full flex items-center justify-center gap-2 py-3 bg-green-600 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all"
                >
                  <span class="material-symbols-outlined">check_circle</span>
                  Mark Completed
                </button>
              </div>
            </div>

            <div v-if="listing.location" class="bg-white rounded-2xl border border-gray-100/50 shadow-soft p-5 space-y-3">
              <h3 class="text-xs font-bold text-text-muted-light uppercase tracking-wider flex items-center gap-1.5">
                <span class="material-symbols-outlined text-sm">location_on</span>
                Location
              </h3>

              <div v-if="locationLat && locationLng" class="rounded-lg overflow-hidden border border-gray-200 h-40">
                <iframe
                  :src="`https://www.openstreetmap.org/export/embed.html?bbox=${locationLng - 0.01},${locationLat - 0.01},${locationLng + 0.01},${locationLat + 0.01}&amp;layer=mapnik&amp;marker=${locationLat},${locationLng}`"
                  class="w-full h-full"
                  loading="lazy"
                  referrerpolicy="no-referrer"
                ></iframe>
              </div>

              <p class="text-sm text-text-light">{{ locationAddress }}</p>

              <div v-if="listing.location.details" class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div v-if="listing.location.details.street" class="col-span-2">
                  <span class="text-text-muted-light">Street</span>
                  <p class="text-text-light font-medium">{{ listing.location.details.street }}</p>
                </div>
                <div v-if="listing.location.details.barangay">
                  <span class="text-text-muted-light">Barangay</span>
                  <p class="text-text-light font-medium">{{ listing.location.details.barangay }}</p>
                </div>
                <div v-if="listing.location.details.city">
                  <span class="text-text-muted-light">City</span>
                  <p class="text-text-light font-medium">{{ listing.location.details.city }}</p>
                </div>
                <div v-if="listing.location.details.province">
                  <span class="text-text-muted-light">Province</span>
                  <p class="text-text-light font-medium">{{ listing.location.details.province }}</p>
                </div>
                <div v-if="listing.location.details.region">
                  <span class="text-text-muted-light">Region</span>
                  <p class="text-text-light font-medium">{{ listing.location.details.region }}</p>
                </div>
                <div v-if="listing.location.details.postalCode">
                  <span class="text-text-muted-light">Postal Code</span>
                  <p class="text-text-light font-medium">{{ listing.location.details.postalCode }}</p>
                </div>
                <div v-if="listing.location.details.country" class="col-span-2">
                  <span class="text-text-muted-light">Country</span>
                  <p class="text-text-light font-medium">{{ listing.location.details.country }}</p>
                </div>
              </div>

              <div v-if="locationLat && locationLng" class="flex items-center gap-1.5 text-xs text-text-muted-light">
                <span class="material-symbols-outlined text-[14px]">pin_drop</span>
                <span>{{ locationLat }}, {{ locationLng }}</span>
              </div>

              <div v-if="listing.location.type" class="flex gap-2">
                <span class="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
                  {{ listing.location.type }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="bg-white rounded-xl shadow-soft p-12 text-center">
      <span class="material-symbols-outlined text-5xl text-text-muted-light">receipt_long</span>
      <h3 class="text-lg font-semibold text-text-light mt-4">Booking not found</h3>
      <router-link to="/service-bookings" class="text-primary text-sm mt-2 inline-block hover:underline">Back to bookings</router-link>
    </div>
  </div>
</template>

<script>
import ServiceBookingsDataService from '@/services/ServiceBookingsDataService';
import BookingStatusBadge from '@/pages/service-bookings/components/BookingStatusBadge.vue';

export default {
  components: { BookingStatusBadge },
  data() {
    return {
      booking: null,
      listing: null,
      loading: true,
      error: null
    };
  },
  computed: {
    workflowSteps() {
      return [
        { key: 'pendingAcceptance', label: 'Pending' },
        { key: 'accepted', label: 'Accepted' },
        { key: 'onGoing', label: 'On Going' },
        { key: 'delivered', label: 'Delivered' },
        { key: 'completed', label: 'Completed' }
      ];
    },
    currentStatus() {
      return (this.booking?.status || '').toLowerCase();
    },
    progressPercent() {
      const idx = this.workflowSteps.findIndex(s => s.key === this.currentStatus);
      if (idx === -1) return 0;
      return ((idx) / (this.workflowSteps.length - 1)) * 100;
    },
    progressPhase() {
      const idx = this.workflowSteps.findIndex(s => s.key === this.currentStatus);
      return Math.min(idx + 1, 3);
    },
    timelineEvents() {
      const base = [
        { key: 'created', label: 'Booking Created', icon: 'add_circle', date: this.formatDate(this.booking?.createdAt), active: true },
        { key: 'accepted', label: 'Employer Accepted', icon: 'check', date: this.formatDate(this.booking?.acceptedAt), active: this.isStepComplete('accepted') },
        { key: 'onGoing', label: 'Work Started', icon: 'play_arrow', date: this.formatDate(this.booking?.startedAt), active: this.isStepComplete('onGoing') },
        { key: 'delivered', label: 'Delivered', icon: 'move_to_inbox', date: this.formatDate(this.booking?.deliveredAt), active: this.isStepComplete('delivered') },
        { key: 'completed', label: 'Completed', icon: 'check_circle', date: this.formatDate(this.booking?.completedAt), active: this.isStepComplete('completed') },
      ];
      const statusIdx = this.workflowSteps.findIndex(s => s.key === this.currentStatus);
      return base.map((e, i) => ({ ...e, active: i <= statusIdx }));
    },
    locationLat() {
      const loc = this.listing?.location;
      if (!loc) return null;
      if (loc.details?.latitude != null) return loc.details.latitude;
      if (loc.coordinates) {
        const parts = loc.coordinates.split(',');
        return parts[0] ? parseFloat(parts[0].trim()) : null;
      }
      return null;
    },
    locationLng() {
      const loc = this.listing?.location;
      if (!loc) return null;
      if (loc.details?.longitude != null) return loc.details.longitude;
      if (loc.coordinates) {
        const parts = loc.coordinates.split(',');
        return parts[1] ? parseFloat(parts[1].trim()) : null;
      }
      return null;
    },
    locationAddress() {
      const loc = this.listing?.location;
      if (!loc) return '';
      return loc.details?.address || loc.stringified_address || 'No address provided';
    }
  },
  methods: {
    formatPrice(n) {
      if (n == null) return '0';
      return Number(n).toLocaleString();
    },
    formatDate(date) {
      if (!date) return '—';
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    getInitials(author) {
      if (!author || !author.display_name) return '?';
      return author.display_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    },
    isStepComplete(key) {
      const order = ['pendingAcceptance', 'accepted', 'onGoing', 'delivered', 'completed'];
      return order.indexOf(key) <= order.indexOf(this.currentStatus);
    },
    isStepCurrent(key) {
      return key === this.currentStatus;
    },
    stepClass(key) {
      if (this.isStepComplete(key)) return 'bg-primary text-white shadow-md shadow-primary/20';
      if (this.isStepCurrent(key)) return 'bg-primary ring-4 ring-primary/20 text-white';
      return 'bg-gray-100 text-gray-400';
    },
    stepTextClass(key) {
      if (this.isStepComplete(key)) return 'text-primary font-bold';
      if (this.isStepCurrent(key)) return 'text-primary font-bold';
      return 'text-text-muted-light';
    },
    shareBooking() {
      if (navigator.share) {
        navigator.share({ title: `Booking #${this.booking.id.slice(-8)}`, url: window.location.href }).catch(() => {});
      } else {
        navigator.clipboard.writeText(window.location.href);
      }
    },
    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        const booking = await ServiceBookingsDataService.getById(this.$route.params.id);
        if (!booking) {
          this.loading = false;
          return;
        }
        this.booking = booking;
        if (booking.job_id) {
          this.listing = await ServiceBookingsDataService.getServiceListing(booking.job_id);
        }
      } catch (err) {
        this.error = err.message || 'Failed to load booking';
      } finally {
        this.loading = false;
      }
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
