<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 py-6">
    <!-- Back Button -->
    <router-link
      to="/job-postings"
      class="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted-light hover:text-primary transition-colors mb-6 group/back"
    >
      <span class="material-symbols-outlined text-[16px] group-hover/back:-translate-x-0.5 transition-transform">arrow_back</span>
      Back to Service Listings
    </router-link>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <div class="flex flex-col lg:flex-row gap-6">
        <div class="flex-1 space-y-4">
          <div class="aspect-[16/9] rounded-xl bg-gray-100 animate-pulse"></div>
          <div class="h-8 w-3/4 bg-gray-100 rounded-lg animate-pulse"></div>
          <div class="h-4 w-full bg-gray-100 rounded animate-pulse"></div>
          <div class="h-4 w-5/6 bg-gray-100 rounded animate-pulse"></div>
        </div>
        <div class="w-full lg:w-80 xl:w-96 space-y-4">
          <div class="h-48 rounded-xl bg-gray-100 animate-pulse"></div>
          <div class="h-32 rounded-xl bg-gray-100 animate-pulse"></div>
        </div>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-20 text-center">
      <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <span class="material-symbols-outlined text-3xl text-red-400">error_outline</span>
      </div>
      <h3 class="text-base font-semibold text-text-light mb-1">{{ error }}</h3>
      <button @click="fetchService" class="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold">
        Try Again
      </button>
    </div>

    <!-- Service Details -->
    <div v-else-if="service" class="flex flex-col lg:flex-row gap-6 lg:gap-8">
      <!-- Main Content -->
      <div class="flex-1 min-w-0 space-y-6">
        <!-- Image Gallery -->
        <div class="relative rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
          <div class="aspect-[16/9] sm:aspect-[21/9] relative">
            <img
              v-if="service.images && service.images.length"
              :src="service.images[activeImageIndex]"
              :alt="service.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="material-symbols-outlined text-6xl text-gray-200">image</span>
            </div>
            <button
              v-if="service.images && service.images.length > 1"
              @click="prevImage"
              class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            >
              <span class="material-symbols-outlined text-lg">chevron_left</span>
            </button>
            <button
              v-if="service.images && service.images.length > 1"
              @click="nextImage"
              class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
            >
              <span class="material-symbols-outlined text-lg">chevron_right</span>
            </button>
            <span
              v-if="service.images && service.images.length > 1"
              class="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-[11px] font-medium backdrop-blur-sm"
            >
              {{ activeImageIndex + 1 }} / {{ service.images.length }}
            </span>
            <span
              class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase backdrop-blur-sm shadow-sm"
              :class="statusOverlayClasses(service.status)"
            >
              {{ displayStatus(service.status) }}
            </span>
          </div>
          <div
            v-if="service.images && service.images.length > 1"
            class="flex gap-2 p-3 overflow-x-auto bg-gray-50/50"
          >
            <button
              v-for="(img, i) in service.images"
              :key="i"
              @click="activeImageIndex = i"
              class="shrink-0 w-16 h-10 rounded-lg overflow-hidden ring-2 transition-all"
              :class="i === activeImageIndex ? 'ring-primary opacity-100' : 'ring-transparent opacity-60 hover:opacity-90'"
            >
              <img :src="img" alt="" class="w-full h-full object-cover" />
            </button>
          </div>
        </div>

        <!-- Title & Meta -->
        <div class="space-y-3">
          <div class="flex flex-wrap items-center gap-2">
            <span class="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
              {{ service.category || 'Uncategorized' }}
            </span>
            <span
              v-if="service.categoryType"
              class="px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-600"
            >
              {{ service.categoryType }}
            </span>
            <span
              v-if="service.isAvailable !== undefined"
              class="flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium"
              :class="service.isAvailable ? 'bg-emerald-50 text-emerald-700' : 'bg-gray-100 text-gray-500'"
            >
              <span class="w-1.5 h-1.5 rounded-full" :class="service.isAvailable ? 'bg-emerald-500 animate-pulse' : 'bg-gray-400'"></span>
              {{ service.isAvailable ? 'Available for hire' : 'Currently unavailable' }}
            </span>
          </div>
          <h1 class="text-xl sm:text-2xl lg:text-3xl font-bold text-text-light tracking-tight leading-tight">
            {{ service.title || 'Untitled Service' }}
          </h1>
          <div class="flex flex-wrap items-center gap-4 text-sm text-text-muted-light">
            <div class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-text-muted-light">calendar_today</span>
              Created {{ formatDate(service.createdAt) }}
            </div>
            <div v-if="service.updatedAt" class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-text-muted-light">update</span>
              Updated {{ formatDate(service.updatedAt) }}
            </div>
            <div v-if="service.offers_count > 0" class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-text-muted-light">handshake</span>
              {{ service.offers_count }} {{ service.offers_count === 1 ? 'offer' : 'offers' }}
            </div>
            <div v-if="service.keywords && service.keywords.length" class="flex items-center gap-1.5">
              <span class="material-symbols-outlined text-[16px] text-text-muted-light">local_offer</span>
              <span class="flex gap-1">
                <span v-for="kw in service.keywords.slice(0, 3)" :key="kw" class="text-xs bg-gray-100 px-1.5 py-0.5 rounded">{{ kw }}</span>
                <span v-if="service.keywords.length > 3" class="text-xs text-text-muted-light">+{{ service.keywords.length - 3 }}</span>
              </span>
            </div>
          </div>
        </div>

        <!-- Description -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h2 class="text-sm font-bold text-text-light flex items-center gap-2">
            <span class="material-symbols-outlined text-lg text-primary">description</span>
            Description
          </h2>
          <p class="text-sm text-text-light/80 leading-relaxed whitespace-pre-wrap">
            {{ service.description || 'No description provided.' }}
          </p>
        </div>

        <!-- Booking Timeline -->
        <div v-if="booking" class="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 class="text-sm font-bold text-text-light flex items-center gap-2">
            <span class="material-symbols-outlined text-lg text-primary">timeline</span>
            Booking Timeline
          </h2>
          <div class="relative pl-6 space-y-4 before:absolute before:left-2 before:top-1.5 before:bottom-1.5 before:w-0.5 before:bg-gray-200">
            <div
              v-for="(step, i) in timelineSteps"
              :key="i"
              class="relative"
            >
              <div
                class="absolute -left-[22px] top-0.5 w-4 h-4 rounded-full border-2 flex items-center justify-center"
                :class="step.active ? 'border-primary bg-primary/10' : 'border-gray-300 bg-white'"
              >
                <span v-if="step.active" class="w-2 h-2 rounded-full bg-primary"></span>
              </div>
              <div>
                <p class="text-sm font-semibold text-text-light">{{ step.label }}</p>
                <p class="text-xs text-text-muted-light">{{ step.description }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Activity Feed -->
        <div v-if="booking" class="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h2 class="text-sm font-bold text-text-light flex items-center gap-2">
            <span class="material-symbols-outlined text-lg text-primary">activity</span>
            Activity Feed
          </h2>
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <div class="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                <span class="material-symbols-outlined text-sm text-primary">add_circle</span>
              </div>
              <div>
                <p class="text-sm font-medium text-text-light">Service was created</p>
                <p class="text-xs text-text-muted-light">{{ formatDate(service.createdAt) }}</p>
              </div>
            </div>
            <div
              v-for="(a, i) in booking.activities || []"
              :key="i"
              class="flex items-start gap-3"
            >
              <div class="w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center shrink-0 mt-0.5">
                <span class="material-symbols-outlined text-sm text-text-muted-light">circle</span>
              </div>
              <div>
                <p class="text-sm text-text-light">{{ a.message }}</p>
                <p class="text-xs text-text-muted-light">{{ formatDate(a.timestamp) }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Sidebar -->
      <div class="w-full lg:w-80 xl:w-96 space-y-4 lg:sticky lg:top-6 lg:self-start">
        <!-- Price Card -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div class="flex items-baseline justify-between">
            <div>
              <p class="text-xs text-text-muted-light font-medium">Price</p>
              <p class="text-2xl font-bold text-primary">₱{{ formatPrice(service.price) }}</p>
              <p class="text-xs text-text-muted-light mt-0.5">{{ paymentLabel(service.paymentType) }}</p>
            </div>
            <span
              v-if="service.escrowAmount > 0"
              class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200/50"
            >
              <span class="material-symbols-outlined text-sm">verified</span>
              Escrow Secured
            </span>
          </div>
          <div v-if="service.pricing" class="space-y-1.5 text-sm">
            <div class="flex justify-between text-text-muted-light">
              <span>Base Price</span>
              <span class="font-medium text-text-light">₱{{ formatPrice(service.pricing.basePrice || service.price) }}</span>
            </div>
            <div v-if="service.pricing.serviceFee" class="flex justify-between text-text-muted-light">
              <span>Service Fee</span>
              <span class="font-medium text-text-light">₱{{ formatPrice(service.pricing.serviceFee) }}</span>
            </div>
            <div v-if="service.pricing.total" class="flex justify-between border-t border-gray-200 pt-1.5 mt-1.5">
              <span class="font-semibold text-text-light">Total</span>
              <span class="font-bold text-primary">₱{{ formatPrice(service.pricing.total) }}</span>
            </div>
          </div>
          <div v-if="service.paymentStatus" class="flex items-center gap-2 text-xs">
            <span class="text-text-muted-light">Payment:</span>
            <span
              class="px-2 py-0.5 rounded-full font-medium"
              :class="paymentStatusClasses(service.paymentStatus)"
            >
              {{ service.paymentStatus }}
            </span>
          </div>
        </div>

        <!-- Author Card -->
        <div class="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h3 class="text-xs font-bold text-text-muted-light uppercase tracking-wider">Employer</h3>
          <div class="flex items-center gap-3">
            <img
              v-if="service.author?.photo_url"
              :src="service.author.photo_url"
              :alt="service.author.display_name"
              class="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
            />
            <div v-else class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
              {{ getInitials(service.author) }}
            </div>
            <div class="min-w-0">
              <p class="text-sm font-semibold text-text-light truncate">{{ service.author?.display_name || 'Unknown' }}</p>
              <p v-if="service.author?.email" class="text-xs text-text-muted-light truncate">{{ service.author.email }}</p>
            </div>
          </div>

          <div v-if="service.author" class="space-y-1.5 text-xs text-text-muted-light pt-2 border-t border-gray-200">
            <div v-if="service.author.uid" class="flex justify-between">
              <span>User ID</span>
              <span class="font-mono text-text-light/60 text-[10px]">{{ service.author.uid.slice(0, 12) }}...</span>
            </div>
            <div v-if="service.author.phone" class="flex justify-between">
              <span>Phone</span>
              <span>{{ service.author.phone }}</span>
            </div>
          </div>
        </div>

        <!-- Location Card -->
        <div v-if="service.location" class="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h3 class="text-xs font-bold text-text-muted-light uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm">location_on</span>
            Location
          </h3>
          <p class="text-sm text-text-light">{{ service.location.stringified_address || 'No address provided' }}</p>
          <div v-if="service.location.type" class="flex gap-2">
            <span class="px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-600">
              {{ service.location.type }}
            </span>
          </div>
        </div>

        <!-- Booking Status Card -->
        <div v-if="booking" class="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
          <h3 class="text-xs font-bold text-text-muted-light uppercase tracking-wider flex items-center gap-1.5">
            <span class="material-symbols-outlined text-sm">booking</span>
            Booking Status
          </h3>
          <div class="space-y-2">
            <div class="flex justify-between text-sm">
              <span class="text-text-muted-light">Status</span>
              <span
                class="px-2 py-0.5 rounded-full text-xs font-bold"
                :class="bookingStatusClasses(booking.status)"
              >
                {{ booking.status || 'Unknown' }}
              </span>
            </div>
            <div v-if="booking.acceptedPrice" class="flex justify-between text-sm">
              <span class="text-text-muted-light">Accepted Price</span>
              <span class="font-semibold text-text-light">₱{{ formatPrice(booking.acceptedPrice) }}</span>
            </div>
            <div v-if="booking.acceptedAt" class="flex justify-between text-sm">
              <span class="text-text-muted-light">Accepted</span>
              <span class="text-text-light">{{ formatDate(booking.acceptedAt) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-text-muted-light">Escrow</span>
              <span
                class="flex items-center gap-1 text-xs font-semibold"
                :class="booking.isAccepted ? 'text-emerald-600' : 'text-text-muted-light'"
              >
                <span class="material-symbols-outlined text-sm">{{ booking.isAccepted ? 'verified' : 'hourglass_empty' }}</span>
                {{ booking.isAccepted ? 'Secured' : 'Pending' }}
              </span>
            </div>
          </div>

          <!-- Progress Tracker -->
          <div class="pt-3 border-t border-gray-200">
            <div class="flex items-center justify-between mb-2">
              <span class="text-xs font-medium text-text-muted-light">Progress</span>
              <span class="text-xs font-semibold text-primary">{{ progressPercent }}%</span>
            </div>
            <div class="w-full h-1.5 rounded-full bg-gray-100 overflow-hidden">
              <div
                class="h-full rounded-full bg-primary transition-all duration-500"
                :style="{ width: progressPercent + '%' }"
              ></div>
            </div>
            <div class="flex justify-between mt-1.5">
              <span
                v-for="(step, i) in ['Pending', 'Accepted', 'On Going', 'Delivered', 'Completed']"
                :key="step"
                class="w-0 h-0 relative"
              >
                <span
                  class="absolute -translate-x-1/2 text-[9px] font-medium whitespace-nowrap"
                  :class="i <= progressIndex ? 'text-primary' : 'text-text-muted-light'"
                >{{ step }}</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';

export default {
  data() {
    return {
      service: null,
      booking: null,
      loading: true,
      error: null,
      activeImageIndex: 0,
    };
  },
  computed: {
    timelineSteps() {
      const bookingStatus = (this.booking?.status || '').toLowerCase();
      const steps = [
        { label: 'Pending', description: 'Awaiting employer response', key: 'pending' },
        { label: 'Accepted', description: 'Booking has been accepted', key: 'accepted' },
        { label: 'On Going', description: 'Service is currently in progress', key: 'ongoing' },
        { label: 'Delivered', description: 'Service has been delivered', key: 'delivered' },
        { label: 'Completed', description: 'Service completed successfully', key: 'completed' },
      ];
      let activeIdx = -1;
      if (bookingStatus === 'accepted') activeIdx = 1;
      else if (bookingStatus === 'ongoing') activeIdx = 2;
      else if (bookingStatus === 'delivered') activeIdx = 3;
      else if (bookingStatus === 'completed') activeIdx = 4;
      return steps.map((s, i) => ({ ...s, active: i <= activeIdx }));
    },
    progressIndex() {
      const s = (this.booking?.status || '').toLowerCase();
      const map = { pending: -1, accepted: 1, ongoing: 2, delivered: 3, completed: 4 };
      return map[s] ?? -1;
    },
    progressPercent() {
      const idx = this.progressIndex;
      if (idx === -1) return 0;
      if (idx === 4) return 100;
      return (idx / 4) * 100;
    },
  },
  methods: {
    async fetchService() {
      this.loading = true;
      this.error = null;
      try {
        const serviceId = this.$route.params.jobId;
        const docSnap = await getDoc(doc(db, 'service-listings', serviceId));
        if (docSnap.exists()) {
          this.service = { id: docSnap.id, ...docSnap.data() };
          await this.fetchBooking(serviceId);
        } else {
          this.error = 'Service not found';
        }
      } catch (err) {
        console.error('Error fetching service:', err);
        this.error = 'Failed to load service details';
      }
      this.loading = false;
    },
    async fetchBooking(serviceId) {
      try {
        const q = query(
          collection(db, 'service-bookings'),
          where('status', 'in', ['pending', 'accepted', 'ongoing', 'delivered', 'completed'])
        );
        const snap = await getDocs(q);
        const match = snap.docs.find(d => {
          const data = d.data();
          return data.serviceId === serviceId || data.service_id === serviceId || data.listingId === serviceId;
        });
        if (match) {
          this.booking = { id: match.id, ...match.data() };
        }
      } catch (err) {
        console.error('Error fetching booking:', err);
      }
    },
    displayStatus(status) {
      const map = {
        active: 'Active',
        draft: 'Draft',
        pending: 'Pending',
        closed: 'Closed',
        flagged: 'Flagged',
      };
      return map[(status || '').toLowerCase()] || 'Unknown';
    },
    statusOverlayClasses(status) {
      const s = (status || '').toLowerCase();
      const map = {
        active: 'bg-primary text-white',
        draft: 'bg-amber-500 text-white',
        pending: 'bg-blue-500 text-white',
        closed: 'bg-red-500 text-white',
        flagged: 'bg-red-500 text-white',
      };
      return map[s] || 'bg-gray-500 text-white';
    },
    bookingStatusClasses(status) {
      const s = (status || '').toLowerCase();
      const map = {
        pending: 'bg-amber-50 text-amber-700 border border-amber-200/50',
        accepted: 'bg-blue-50 text-blue-700 border border-blue-200/50',
        ongoing: 'bg-cyan-50 text-cyan-700 border border-cyan-200/50',
        delivered: 'bg-purple-50 text-purple-700 border border-purple-200/50',
        completed: 'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
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
    paymentStatusClasses(status) {
      const s = (status || '').toLowerCase();
      const map = {
        paid: 'bg-emerald-50 text-emerald-700',
        pending: 'bg-amber-50 text-amber-700',
        overdue: 'bg-red-50 text-red-700',
        refunded: 'bg-gray-50 text-gray-600',
      };
      return map[s] || 'bg-gray-50 text-gray-500';
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
    prevImage() {
      if (!this.service?.images?.length) return;
      this.activeImageIndex = (this.activeImageIndex - 1 + this.service.images.length) % this.service.images.length;
    },
    nextImage() {
      if (!this.service?.images?.length) return;
      this.activeImageIndex = (this.activeImageIndex + 1) % this.service.images.length;
    },
  },
  mounted() {
    this.fetchService();
  },
};
</script>

<style scoped>
@reference "tailwindcss";

@media (prefers-reduced-motion: reduce) {
  * {
    transition: none !important;
    animation: none !important;
  }
}
</style>
