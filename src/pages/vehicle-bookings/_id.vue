<template>
  <div class="max-w-6xl mx-auto px-4 sm:px-6 py-6">
    <router-link to="/vehicle-bookings" class="inline-flex items-center gap-2 text-text-muted-light hover:text-text-light mb-6 transition-colors">
      <span class="material-symbols-outlined text-lg">arrow_back</span>
      Back to Bookings
    </router-link>

    <div v-if="loading" class="space-y-4">
      <div class="bg-white rounded-xl shadow-soft p-6 animate-pulse space-y-4">
        <div class="h-6 bg-gray-200 rounded w-1/3"></div>
        <div class="h-4 bg-gray-200 rounded w-1/2"></div>
        <div class="h-32 bg-gray-200 rounded"></div>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div class="lg:col-span-2 space-y-4">
          <div class="bg-white rounded-xl shadow-soft p-6 animate-pulse h-64"></div>
        </div>
        <div class="space-y-4">
          <div class="bg-white rounded-xl shadow-soft p-6 animate-pulse h-40"></div>
          <div class="bg-white rounded-xl shadow-soft p-6 animate-pulse h-40"></div>
        </div>
      </div>
    </div>

    <div v-else-if="error" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg flex items-center justify-between">
      <span>{{ error }}</span>
      <button class="underline font-medium shrink-0 ml-4" @click="fetchData">Try Again</button>
    </div>

    <template v-else-if="booking">
      <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6">
        <div class="flex items-center gap-3 flex-wrap">
          <h1 class="text-xl font-bold text-text-light">
            Booking #{{ (booking.id || '').slice(-8) }}
          </h1>
          <button
            class="inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-medium text-text-muted-light hover:bg-gray-100 transition-colors border border-gray-200"
            @click="copyId"
          >
            <span class="material-symbols-outlined text-sm">content_copy</span>
            {{ copied ? 'Copied!' : 'Copy ID' }}
          </button>
          <BookingStatusBadge :status="booking.status" />
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div class="lg:col-span-8 space-y-6">
          <div class="bg-white rounded-2xl shadow-soft p-5 border border-gray-100/50">
            <div class="flex items-center justify-between mb-4">
              <h2 class="text-base font-semibold text-text-light flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-lg">directions_car</span>
                Vehicle Overview
              </h2>
            </div>
            <VehicleGallery :images="vehicleImages" />
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-4">
              <div v-for="spec in vehicleSpecs" :key="spec.label" class="bg-gray-50 rounded-xl p-3">
                <p class="text-[10px] text-text-muted-light uppercase tracking-wider">{{ spec.label }}</p>
                <p class="text-sm font-semibold text-text-light mt-0.5">{{ spec.value }}</p>
              </div>
            </div>
          </div>

          <BookingInfoCard
            title="Booking Information"
            icon="info"
            :items="bookingInfoItems"
          />

          <LesseeCard :lessee="booking.lessee || {}" />

          <div class="bg-white rounded-2xl shadow-soft p-5 border border-gray-100/50">
            <h3 class="text-sm font-semibold text-text-light mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-primary text-lg">location_on</span>
              Location Details
            </h3>
            <div v-if="locationData" class="space-y-3">
              <div v-if="locationLat && locationLng" class="rounded-xl overflow-hidden border border-gray-200 h-48 mb-4">
                <iframe
                  :src="mapSrc"
                  class="w-full h-full"
                  loading="lazy"
                  referrerpolicy="no-referrer"
                ></iframe>
              </div>
              <p class="text-sm text-text-light">{{ locationAddress }}</p>
              <div class="grid grid-cols-2 gap-x-4 gap-y-2 text-xs">
                <div v-if="locationData.barangay">
                  <span class="text-text-muted-light">Barangay</span>
                  <p class="text-text-light font-medium">{{ locationData.barangay }}</p>
                </div>
                <div v-if="locationData.province">
                  <span class="text-text-muted-light">Province</span>
                  <p class="text-text-light font-medium">{{ locationData.province }}</p>
                </div>
                <div v-if="locationData.region">
                  <span class="text-text-muted-light">Region</span>
                  <p class="text-text-light font-medium">{{ locationData.region }}</p>
                </div>
                <div v-if="locationData.country" class="col-span-2">
                  <span class="text-text-muted-light">Country</span>
                  <p class="text-text-light font-medium">{{ locationData.country }}</p>
                </div>
              </div>
              <div v-if="locationLat && locationLng" class="flex items-center gap-1.5 text-xs text-text-muted-light">
                <span class="material-symbols-outlined text-[14px]">pin_drop</span>
                <span>{{ locationLat }}, {{ locationLng }}</span>
              </div>
            </div>
            <div v-else class="text-sm text-text-muted-light">No location data available.</div>
          </div>

          <div v-if="booking.checkInData" class="bg-white rounded-2xl shadow-soft p-5 border border-gray-100/50">
            <h3 class="text-sm font-semibold text-text-light mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-green-600 text-lg">login</span>
              Check-In Details
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              <div class="bg-green-50 rounded-xl p-3">
                <p class="text-[10px] text-text-muted-light uppercase">Fuel Level</p>
                <p class="text-sm font-semibold text-text-light mt-0.5">{{ booking.checkInData.fuelLevel || '—' }}</p>
              </div>
              <div class="bg-green-50 rounded-xl p-3">
                <p class="text-[10px] text-text-muted-light uppercase">Odometer</p>
                <p class="text-sm font-semibold text-text-light mt-0.5">{{ booking.checkInData.odometer || '—' }} km</p>
              </div>
              <div class="bg-green-50 rounded-xl p-3">
                <p class="text-[10px] text-text-muted-light uppercase">Timestamp</p>
                <p class="text-sm font-semibold text-text-light mt-0.5">{{ formatDateTime(booking.checkInData.timestamp) }}</p>
              </div>
              <div class="bg-green-50 rounded-xl p-3" v-if="booking.checkInData.lesseeSignedAt">
                <p class="text-[10px] text-text-muted-light uppercase">Lessee Signed At</p>
                <p class="text-sm font-semibold text-text-light mt-0.5">{{ formatDateTime(booking.checkInData.lesseeSignedAt) }}</p>
              </div>
            </div>
            <div v-if="booking.checkInData.photos?.length" class="mt-3">
              <p class="text-xs font-medium text-text-muted-light mb-2 uppercase tracking-wider">Check-In Photos</p>
              <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
                <img
                  v-for="(photo, i) in booking.checkInData.photos"
                  :key="i"
                  :src="photo"
                  class="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  :alt="`Check-in photo ${i + 1}`"
                  loading="lazy"
                  @click="openPhoto(photo)"
                />
              </div>
            </div>
          </div>

          <div v-if="booking.checkOutData" class="bg-white rounded-2xl shadow-soft p-5 border border-gray-100/50">
            <h3 class="text-sm font-semibold text-text-light mb-4 flex items-center gap-2">
              <span class="material-symbols-outlined text-orange-600 text-lg">logout</span>
              Check-Out Details
            </h3>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
              <div v-for="item in checkOutItems" :key="item.label" class="bg-orange-50 rounded-xl p-3">
                <p class="text-[10px] text-text-muted-light uppercase">{{ item.label }}</p>
                <p class="text-sm font-semibold text-text-light mt-0.5">{{ item.value }}</p>
              </div>
            </div>
            <div v-if="booking.checkOutData.photos?.length" class="mt-3">
              <p class="text-xs font-medium text-text-muted-light mb-2 uppercase tracking-wider">Check-Out Photos</p>
              <div class="grid grid-cols-3 sm:grid-cols-4 gap-2">
                <img
                  v-for="(photo, i) in booking.checkOutData.photos"
                  :key="i"
                  :src="photo"
                  class="w-full h-20 object-cover rounded-lg cursor-pointer hover:opacity-80 transition-opacity"
                  :alt="`Check-out photo ${i + 1}`"
                  loading="lazy"
                  @click="openPhoto(photo)"
                />
              </div>
            </div>
          </div>
          <div v-else class="bg-white rounded-2xl shadow-soft p-8 border border-dashed border-gray-200 text-center">
            <span class="material-symbols-outlined text-4xl text-text-muted-light">logout</span>
            <h3 class="text-base font-semibold text-text-light mt-3">No Check-Out Yet</h3>
            <p class="text-sm text-text-muted-light mt-1">Check-out data will appear here once the vehicle is returned.</p>
          </div>

          <BookingTimeline :events="timelineEvents" />
        </div>

        <div class="lg:col-span-4 space-y-6">
          <div class="sticky top-24 space-y-6">
            <div class="bg-white rounded-2xl shadow-soft p-5 border border-gray-100/50">
              <h3 class="text-sm font-semibold text-text-light mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-lg">tune</span>
                Manage Booking
              </h3>
              <BookingActions
                :status="booking.status"
                @approve="confirmAction('approve')"
                @cancel="confirmAction('cancel')"
                @complete="confirmAction('complete')"
                @print="printCurrentBooking"
              />
            </div>

            <div class="bg-white rounded-2xl shadow-soft p-5 border border-gray-100/50">
              <h3 class="text-sm font-semibold text-text-light mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-lg">qr_code</span>
                QR Code
              </h3>
              <div v-if="booking.qr_hash" class="flex flex-col items-center gap-2">
                <div class="bg-white rounded-xl p-3 border border-gray-200">
                  <img
                    :src="`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${booking.qr_hash}`"
                    alt="QR Code"
                    class="w-36 h-36"
                    loading="lazy"
                  />
                </div>
                <p class="text-xs text-text-muted-light font-mono">{{ booking.qr_hash }}</p>
              </div>
              <div v-else class="text-center py-4">
                <span class="material-symbols-outlined text-3xl text-text-muted-light">qr_code_2</span>
                <p class="text-sm text-text-muted-light mt-2">No QR code generated</p>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-soft p-5 border border-gray-100/50">
              <h3 class="text-sm font-semibold text-text-light mb-4 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-lg">receipt_long</span>
                Analytics
              </h3>
              <div class="grid grid-cols-2 gap-3">
                <div class="bg-blue-50 rounded-xl p-3 text-center">
                  <p class="text-lg font-bold text-primary tabular-nums">₱{{ formatPrice(booking.pricing?.price) }}</p>
                  <p class="text-[10px] text-text-muted-light uppercase mt-1">Rental Price</p>
                </div>
                <div class="bg-amber-50 rounded-xl p-3 text-center">
                  <p class="text-lg font-bold text-amber-600 tabular-nums">₱{{ formatPrice(booking.deposit_amount) }}</p>
                  <p class="text-[10px] text-text-muted-light uppercase mt-1">Deposit</p>
                </div>
                <div class="bg-purple-50 rounded-xl p-3 text-center">
                  <p class="text-lg font-bold text-purple-600 tabular-nums">₱{{ formatPrice(booking.extension_per_hour) }}</p>
                  <p class="text-[10px] text-text-muted-light uppercase mt-1">Extension/hr</p>
                </div>
                <div class="bg-red-50 rounded-xl p-3 text-center">
                  <p class="text-lg font-bold text-red-600 tabular-nums">₱{{ formatPrice(booking.penalty_per_hour) }}</p>
                  <p class="text-[10px] text-text-muted-light uppercase mt-1">Penalty/hr</p>
                </div>
              </div>
            </div>

            <div class="bg-white rounded-2xl shadow-soft p-5 border border-gray-100/50">
              <h3 class="text-sm font-semibold text-text-light mb-3 flex items-center gap-2">
                <span class="material-symbols-outlined text-primary text-lg">download</span>
                Actions
              </h3>
              <div class="space-y-2">
                <button
                  class="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-text-light rounded-xl text-sm font-medium hover:bg-gray-100 transition-all border border-gray-200"
                  @click="printCurrentBooking"
                >
                  <span class="material-symbols-outlined text-lg">print</span>
                  Print Booking
                </button>
                <button
                  class="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-text-light rounded-xl text-sm font-medium hover:bg-gray-100 transition-all border border-gray-200"
                  @click="downloadPDF"
                >
                  <span class="material-symbols-outlined text-lg">picture_as_pdf</span>
                  Download PDF
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else class="bg-white rounded-xl shadow-soft p-12 text-center">
      <span class="material-symbols-outlined text-5xl text-text-muted-light">directions_car</span>
      <h3 class="text-lg font-semibold text-text-light mt-4">Booking not found</h3>
      <router-link to="/vehicle-bookings" class="text-primary text-sm mt-2 inline-block hover:underline">Back to bookings</router-link>
    </div>

    <div v-if="photoPreview" class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center" @click.self="photoPreview = null">
      <button class="absolute top-4 right-4 text-white/80 hover:text-white" @click="photoPreview = null">
        <span class="material-symbols-outlined text-3xl">close</span>
      </button>
      <img :src="photoPreview" class="max-w-[90vw] max-h-[90vh] object-contain rounded-lg" alt="Photo preview" />
    </div>

    <Toast
      :message="toastMessage"
      :type="toastType"
      :showConfirmButtons="showConfirm"
      :id="'action'"
      @confirm="executeAction"
      @cancel="clearToast"
    />
  </div>
</template>

<script>
import VehicleBookingsDataService from '@/services/VehicleBookingsDataService';
import BookingStatusBadge from '@/components/vehicle-bookings/BookingStatusBadge.vue';
import VehicleGallery from '@/components/vehicle-bookings/VehicleGallery.vue';
import BookingInfoCard from '@/components/vehicle-bookings/BookingInfoCard.vue';
import LesseeCard from '@/components/vehicle-bookings/LesseeCard.vue';
import BookingTimeline from '@/components/vehicle-bookings/BookingTimeline.vue';
import BookingActions from '@/components/vehicle-bookings/BookingActions.vue';
import Toast from '@/components/Toast.vue';

export default {
  components: {
    BookingStatusBadge, VehicleGallery, BookingInfoCard,
    LesseeCard, BookingTimeline, BookingActions, Toast
  },
  data() {
    return {
      booking: null,
      listing: null,
      loading: true,
      error: null,
      copied: false,
      toastMessage: '',
      toastType: '',
      showConfirm: false,
      pendingAction: null,
      photoPreview: null
    };
  },
  computed: {
    vehicleImages() {
      return this.booking?.rental_details?.info?.images || [];
    },
    vehicleInfo() {
      return this.booking?.rental_details?.info || {};
    },
    vehicleSpecs() {
      const v = this.vehicleInfo;
      return [
        { label: 'Brand', value: v.brand || '—' },
        { label: 'Model', value: v.model || '—' },
        { label: 'Year', value: v.year || '—' },
        { label: 'Type', value: this.formatType(v.type) },
        { label: 'Transmission', value: this.formatType(v.transmission) },
        { label: 'Fuel', value: this.formatType(v.fuelType) },
        { label: 'Seats', value: v.seatingCapacity || '—' },
        { label: 'Engine', value: v.engineCapacity ? `${v.engineCapacity}cc` : '—' },
        { label: 'Odometer', value: v.odoMeter ? `${v.odoMeter} km` : '—' },
        { label: 'Plate #', value: v.plateNumber || '—' },
      ];
    },
    bookingInfoItems() {
      const b = this.booking || {};
      return [
        { label: 'Status', value: (b.status || '').toUpperCase(), valueClass: this.statusTextClass },
        { label: 'Drive Type', value: this.formatDriveType(b.driveType) },
        { label: 'Rental Price', value: `₱${this.formatPrice(b.pricing?.price)}`, valueClass: 'text-primary font-bold' },
        { label: 'Time Rate', value: this.formatTimeRate(b.pricing?.timeRate) },
        { label: 'Deposit Amount', value: `₱${this.formatPrice(b.deposit_amount)}` },
        { label: 'Extension/hr', value: `₱${this.formatPrice(b.extension_per_hour)}` },
        { label: 'Penalty/hr', value: `₱${this.formatPrice(b.penalty_per_hour)}` },
        { label: 'QR Hash', value: b.qr_hash || '—', valueClass: 'font-mono text-xs' },
        { label: 'Completion Code', value: b.completionCode || '—', valueClass: 'font-mono text-xs' },
        { label: 'Created', value: this.formatDateTime(b.createdAt) },
        { label: 'Updated', value: this.formatDateTime(b.updatedAt) },
      ];
    },
    checkOutItems() {
      const co = this.booking?.checkOutData || {};
      return [
        { label: 'Fuel Level', value: co.fuelLevel || '—' },
        { label: 'Odometer', value: co.odometer ? `${co.odometer} km` : '—' },
        { label: 'Return Condition', value: this.formatType(co.returnCondition) },
        { label: 'Timestamp', value: this.formatDateTime(co.timestamp) },
      ];
    },
    locationData() {
      return this.booking?.rental_details?.location?.details || null;
    },
    locationAddress() {
      return this.locationData?.address || 'No address provided';
    },
    locationLat() {
      const coord = this.booking?.rental_details?.location?.coordinates;
      if (!coord) return null;
      const parts = coord.split(',');
      return parts[0] ? parseFloat(parts[0].trim()) : null;
    },
    locationLng() {
      const coord = this.booking?.rental_details?.location?.coordinates;
      if (!coord) return null;
      const parts = coord.split(',');
      return parts[1] ? parseFloat(parts[1].trim()) : null;
    },
    mapSrc() {
      if (!this.locationLat || !this.locationLng) return '';
      return `https://www.openstreetmap.org/export/embed.html?bbox=${this.locationLng - 0.01},${this.locationLat - 0.01},${this.locationLng + 0.01},${this.locationLat + 0.01}&layer=mapnik&marker=${this.locationLat},${this.locationLng}`;
    },
    statusTextClass() {
      const map = {
        active: 'text-blue-600 font-bold',
        pending: 'text-amber-600 font-bold',
        completed: 'text-green-600 font-bold',
        cancelled: 'text-red-600 font-bold'
      };
      return map[(this.booking?.status || '').toLowerCase()] || '';
    },
    timelineEvents() {
      const b = this.booking || {};
      const statusKey = (b.status || '').toLowerCase();
      const order = ['pending', 'active', 'completed', 'cancelled'];
      const currentIdx = order.indexOf(statusKey);
      return [
        { key: 'created', label: 'Booking Created', icon: 'add_circle', date: this.formatDateTime(b.createdAt), active: true },
        { key: 'active', label: 'Booking Approved', icon: 'check', date: this.formatDateTime(b.updatedAt), active: currentIdx >= order.indexOf('active') },
        { key: 'completed', label: 'Booking Completed', icon: 'check_circle', date: statusKey === 'completed' ? this.formatDateTime(b.updatedAt) : '—', active: currentIdx >= order.indexOf('completed') },
        { key: 'cancelled', label: 'Booking Cancelled', icon: 'cancel', date: statusKey === 'cancelled' ? this.formatDateTime(b.updatedAt) : '—', active: currentIdx >= order.indexOf('cancelled') && statusKey !== 'completed' },
      ].filter(e => statusKey !== 'cancelled' || e.key === 'created' || e.key === 'cancelled');
    }
  },
  methods: {
    formatPrice(n) {
      if (n == null) return '0';
      return Number(n).toLocaleString();
    },
    formatType(val) {
      if (!val) return '—';
      return val.charAt(0).toUpperCase() + val.slice(1);
    },
    formatDriveType(type) {
      const map = { selfDrive: 'Self Drive', withDriver: 'With Driver' };
      return map[type] || type || '—';
    },
    formatTimeRate(rate) {
      if (!rate) return '—';
      const map = { eightHours: '8 Hours', twelveHours: '12 Hours', twentyFourHours: '24 Hours' };
      return map[rate] || rate;
    },
    formatDateTime(date) {
      if (!date) return '—';
      const d = date.toDate ? date.toDate() : new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    },
    openPhoto(url) {
      this.photoPreview = url;
      document.body.style.overflow = 'hidden';
    },
    async copyId() {
      try {
        await navigator.clipboard.writeText(this.booking.id);
        this.copied = true;
        setTimeout(() => { this.copied = false; }, 2000);
      } catch {
        // Fallback
        const ta = document.createElement('textarea');
        ta.value = this.booking.id;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        this.copied = true;
        setTimeout(() => { this.copied = false; }, 2000);
      }
    },
    showToastMessage(message, type = 'success') {
      this.toastMessage = message;
      this.toastType = type;
      this.showConfirm = false;
    },
    clearToast() {
      this.toastMessage = '';
      this.toastType = '';
      this.showConfirm = false;
      this.pendingAction = null;
    },
    confirmAction(action) {
      const messages = {
        approve: 'Approve this booking?',
        cancel: 'Cancel this booking?',
        complete: 'Mark this booking as completed?'
      };
      this.toastMessage = messages[action] || 'Proceed?';
      this.toastType = 'confirm';
      this.showConfirm = true;
      this.pendingAction = action;
    },
    async executeAction() {
      const id = this.booking.id;
      try {
        if (this.pendingAction === 'approve') {
          await VehicleBookingsDataService.approveBooking(id);
          this.showToastMessage('Booking approved successfully');
          await this.fetchData();
        } else if (this.pendingAction === 'cancel') {
          await VehicleBookingsDataService.cancelBooking(id);
          this.showToastMessage('Booking cancelled');
          await this.fetchData();
        } else if (this.pendingAction === 'complete') {
          await VehicleBookingsDataService.completeBooking(id);
          this.showToastMessage('Booking completed');
          await this.fetchData();
        }
      } catch (err) {
        this.showToastMessage(err.message || 'Action failed', 'error');
      }
      this.clearToast();
    },
    printCurrentBooking() {
      const b = this.booking;
      if (!b) return;
      const v = b.rental_details?.info || {};
      const l = b.lessee || {};
      const win = window.open('', '_blank');
      if (!win) return;
      win.document.write(`
        <html><head><title>Booking #${b.id.slice(-8)}</title>
        <style>body{font-family:Arial;padding:40px;color:#333}table{width:100%;border-collapse:collapse}td,th{padding:8px 12px;border:1px solid #ddd;text-align:left}h1,h2{color:#137fec}.badge{display:inline-block;padding:4px 12px;border-radius:20px;font-size:12px;font-weight:bold}.badge-active{background:#dbeafe;color:#1d4ed8}.badge-pending{background:#fef3c7;color:#b45309}.badge-completed{background:#d1fae5;color:#047857}.badge-cancelled{background:#fee2e2;color:#b91c1c}.section{margin:24px 0}</style></head><body>
        <h1>Vehicle Booking Receipt</h1>
        <p style="color:#666">Booking #${b.id.slice(-8)} | ${this.formatDateTime(b.createdAt)}</p>
        <hr class="section"/>
        <h2>Vehicle Details</h2>
        <table><tr><th>Brand</th><td>${v.brand || '—'}</td></tr><tr><th>Model</th><td>${v.model || '—'}</td></tr><tr><th>Year</th><td>${v.year || '—'}</td></tr><tr><th>Plate Number</th><td>${v.plateNumber || '—'}</td></tr><tr><th>Type</th><td>${v.type || '—'}</td></tr><tr><th>Transmission</th><td>${v.transmission || '—'}</td></tr><tr><th>Fuel Type</th><td>${v.fuelType || '—'}</td></tr><tr><th>Engine Capacity</th><td>${v.engineCapacity || '—'}cc</td></tr><tr><th>Seating Capacity</th><td>${v.seatingCapacity || '—'}</td></tr></table>
        <h2>Lessee Details</h2>
        <table><tr><th>Name</th><td>${l.name || ''} ${l.lastName || ''}</td></tr><tr><th>Phone</th><td>${l.phoneNumber || '—'}</td></tr><tr><th>Address</th><td>${l.address || '—'}</td></tr><tr><th>Emergency Contact</th><td>${l.emergencyName || ''} ${l.emergencyLastName || ''} (${l.emergencyContact || '—'})</td></tr></table>
        <h2>Booking Summary</h2>
        <table><tr><th>Status</th><td><span class="badge badge-${(b.status || '').toLowerCase()}">${(b.status || '—').toUpperCase()}</span></td></tr><tr><th>Drive Type</th><td>${this.formatDriveType(b.driveType)}</td></tr><tr><th>Rental Price</th><td>₱${this.formatPrice(b.pricing?.price)}</td></tr><tr><th>Time Rate</th><td>${this.formatTimeRate(b.pricing?.timeRate)}</td></tr><tr><th>Deposit</th><td>₱${this.formatPrice(b.deposit_amount)}</td></tr><tr><th>Extension/hr</th><td>₱${this.formatPrice(b.extension_per_hour)}</td></tr><tr><th>Penalty/hr</th><td>₱${this.formatPrice(b.penalty_per_hour)}</td></tr></table>
        <h2>Location</h2>
        <p>${this.locationAddress}</p>
        <hr class="section"/><p style="color:#999;font-size:12px">Generated on ${new Date().toLocaleString()}</p>
        </body></html>
      `);
      win.document.close();
      setTimeout(() => win.print(), 500);
    },
    downloadPDF() {
      this.printCurrentBooking();
    },
    async fetchData() {
      this.loading = true;
      this.error = null;
      try {
        const booking = await VehicleBookingsDataService.getById(this.$route.params.id);
        if (!booking) {
          this.loading = false;
          return;
        }
        this.booking = booking;
        if (booking.vehicleRentalId) {
          this.listing = await VehicleBookingsDataService.getVehicleListing(booking.vehicleRentalId);
        }
      } catch (err) {
        this.error = err.message || 'Failed to load booking';
      } finally {
        this.loading = false;
      }
    }
  },
  watch: {
    '$route.params.id'() {
      this.fetchData();
    }
  },
  mounted() {
    this.fetchData();
  },
  beforeUnmount() {
    document.body.style.overflow = '';
  }
};
</script>

<style scoped>
@reference "tailwindcss";
</style>
