<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6 py-6">
    <!-- Back Button -->
    <router-link
      to="/vehicle-listings"
      class="inline-flex items-center gap-1.5 text-xs font-medium text-text-muted-light hover:text-primary transition-colors mb-6 group/back"
    >
      <span class="material-symbols-outlined text-[16px] group-hover/back:-translate-x-0.5 transition-transform">arrow_back</span>
      Back to Vehicle Listings
    </router-link>

    <!-- Loading State -->
    <div v-if="loading" class="space-y-6">
      <div class="aspect-[16/9] rounded-xl bg-gray-100 animate-pulse"></div>
      <div class="h-8 w-3/4 bg-gray-100 rounded-lg animate-pulse"></div>
      <div class="grid grid-cols-2 gap-4">
        <div class="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
        <div class="h-16 bg-gray-100 rounded-xl animate-pulse"></div>
      </div>
      <div class="h-48 bg-gray-100 rounded-xl animate-pulse"></div>
    </div>

    <!-- Error State -->
    <div v-else-if="error" class="flex flex-col items-center justify-center py-20 text-center">
      <div class="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
        <span class="material-symbols-outlined text-3xl text-red-400">error_outline</span>
      </div>
      <h3 class="text-base font-semibold text-text-light mb-1">{{ error }}</h3>
      <button @click="fetchListing" class="mt-4 px-4 py-2 bg-primary text-white rounded-lg text-sm font-semibold">
        Try Again
      </button>
    </div>

    <!-- Listing Details -->
    <div v-else-if="listing" class="space-y-6">
      <!-- Image Gallery -->
      <div class="relative rounded-xl overflow-hidden bg-gray-50 border border-gray-200">
        <div class="aspect-[16/9] sm:aspect-[21/9] relative">
          <img
            v-if="listing.images && listing.images.length"
            :src="listing.images[activeImageIndex]"
            :alt="listing.title"
            class="w-full h-full object-cover"
          />
          <div v-else class="w-full h-full flex items-center justify-center">
            <span class="material-symbols-outlined text-6xl text-gray-200">image</span>
          </div>
          <button
            v-if="listing.images && listing.images.length > 1"
            @click="prevImage"
            class="absolute left-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <span class="material-symbols-outlined text-lg">chevron_left</span>
          </button>
          <button
            v-if="listing.images && listing.images.length > 1"
            @click="nextImage"
            class="absolute right-3 top-1/2 -translate-y-1/2 w-9 h-9 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center shadow-sm hover:bg-white transition-colors"
          >
            <span class="material-symbols-outlined text-lg">chevron_right</span>
          </button>
          <span
            v-if="listing.images && listing.images.length > 1"
            class="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 text-white text-[11px] font-medium backdrop-blur-sm"
          >
            {{ activeImageIndex + 1 }} / {{ listing.images.length }}
          </span>
          <span
            class="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase"
            :class="statusBadgeClass"
          >
            {{ displayStatus }}
          </span>
        </div>
        <div
          v-if="listing.images && listing.images.length > 1"
          class="flex gap-2 p-3 overflow-x-auto bg-gray-50/50"
        >
          <button
            v-for="(img, i) in listing.images"
            :key="i"
            @click="activeImageIndex = i"
            class="shrink-0 w-16 h-10 rounded-lg overflow-hidden ring-2 transition-all"
            :class="i === activeImageIndex ? 'ring-primary opacity-100' : 'ring-transparent opacity-60 hover:opacity-90'"
          >
            <img :src="img" alt="" class="w-full h-full object-cover" />
          </button>
        </div>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Main Content -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Title & Price -->
          <div>
            <h1 class="text-xl sm:text-2xl font-bold text-text-light mb-2">{{ listing.title || 'Untitled' }}</h1>
            <div class="flex items-baseline gap-2">
              <span class="text-2xl font-bold text-primary">₱{{ formatPrice(listing.price || listing.pricing?.dailyRate || 0) }}</span>
              <span class="text-sm text-text-muted-light">/ day</span>
            </div>
          </div>

          <!-- Quick Info Grid -->
          <div class="grid grid-cols-2 gap-4">
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-text-muted-light">directions_car</span>
              <div>
                <p class="text-xs text-text-muted-light">Vehicle Brand</p>
                <p class="text-sm font-medium text-text-light">{{ listing.vehicleBrand || 'N/A' }}</p>
              </div>
            </div>
            <div class="flex items-center gap-2.5">
              <span class="material-symbols-outlined text-text-muted-light">category</span>
              <div>
                <p class="text-xs text-text-muted-light">Category</p>
                <p class="text-sm font-medium text-text-light">{{ formatText(listing.category) || 'N/A' }}</p>
              </div>
            </div>
          </div>

          <!-- Vehicle Specs -->
          <div v-if="details" class="bg-gray-50 rounded-xl p-4 space-y-3">
            <h4 class="text-sm font-semibold text-text-light uppercase tracking-wider">Vehicle Specifications</h4>
            <div class="grid grid-cols-2 gap-3">
              <div>
                <p class="text-xs text-text-muted-light">Transmission</p>
                <p class="text-sm font-medium text-text-light">{{ details.transmission || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-text-muted-light">Fuel Type</p>
                <p class="text-sm font-medium text-text-light">{{ details.fuelType || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-text-muted-light">Seating Capacity</p>
                <p class="text-sm font-medium text-text-light">{{ details.seatingCapacity || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-text-muted-light">Engine Capacity</p>
                <p class="text-sm font-medium text-text-light">{{ details.engineCapacity || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-text-muted-light">Year</p>
                <p class="text-sm font-medium text-text-light">{{ details.year || 'N/A' }}</p>
              </div>
              <div>
                <p class="text-xs text-text-muted-light">Plate Number</p>
                <p class="text-sm font-medium text-text-light">{{ details.plateNumber || 'N/A' }}</p>
              </div>
            </div>
            <div v-if="details.drive_types">
              <p class="text-xs text-text-muted-light">Drive Type</p>
              <p class="text-sm font-medium text-text-light">{{ details.drive_types }}</p>
            </div>
          </div>

          <!-- Description -->
          <div v-if="listing.description" class="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h4 class="text-sm font-semibold text-text-light uppercase tracking-wider">Description</h4>
            <p class="text-sm text-text-light leading-relaxed whitespace-pre-wrap">{{ listing.description }}</p>
          </div>

          <!-- Location -->
          <div v-if="listing.location" class="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h4 class="text-sm font-semibold text-text-light uppercase tracking-wider flex items-center gap-1.5">
              <span class="material-symbols-outlined text-lg">location_on</span>
              Location
            </h4>
            <p class="text-sm text-text-light">{{ listing.location.details || listing.location.stringified_address || 'N/A' }}</p>
          </div>

          <!-- Booking Settings -->
          <div v-if="details?.pricing || details?.inclusions" class="bg-gray-50 rounded-xl p-4 space-y-3">
            <h4 class="text-sm font-semibold text-text-light uppercase tracking-wider">Booking Settings</h4>
            <div v-if="details.pricing" class="grid grid-cols-2 gap-3">
              <div v-if="details.pricing.dailyRate">
                <p class="text-xs text-text-muted-light">Daily Rate</p>
                <p class="text-sm font-medium text-text-light">₱{{ formatPrice(details.pricing.dailyRate) }}</p>
              </div>
              <div v-if="details.pricing.weeklyRate">
                <p class="text-xs text-text-muted-light">Weekly Rate</p>
                <p class="text-sm font-medium text-text-light">₱{{ formatPrice(details.pricing.weeklyRate) }}</p>
              </div>
              <div v-if="details.pricing.monthlyRate">
                <p class="text-xs text-text-muted-light">Monthly Rate</p>
                <p class="text-sm font-medium text-text-light">₱{{ formatPrice(details.pricing.monthlyRate) }}</p>
              </div>
              <div v-if="details.reservationFee">
                <p class="text-xs text-text-muted-light">Reservation Fee</p>
                <p class="text-sm font-medium text-text-light">₱{{ formatPrice(details.reservationFee) }}</p>
              </div>
            </div>
            <div v-if="details.inclusions">
              <p class="text-xs text-text-muted-light mb-1">Inclusions</p>
              <p class="text-sm text-text-light">{{ details.inclusions }}</p>
            </div>
          </div>
        </div>

        <!-- Sidebar -->
        <div class="space-y-4">
          <!-- Owner Card -->
          <div v-if="listing.author" class="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 class="text-xs font-bold text-text-muted-light uppercase tracking-wider">Owner</h3>
            <div class="flex items-center gap-3">
              <img
                v-if="listing.author.photo_url"
                :src="listing.author.photo_url"
                :alt="listing.author.display_name"
                class="w-10 h-10 rounded-full object-cover ring-2 ring-gray-200"
              />
              <div v-else class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold">
                {{ getInitials(listing.author) }}
              </div>
              <div>
                <p class="text-sm font-semibold text-text-light">{{ listing.author.display_name || 'Unknown' }}</p>
                <p class="text-xs text-text-muted-light">{{ listing.author.account_type || 'User' }}</p>
              </div>
            </div>
          </div>

          <!-- Stats Card -->
          <div class="bg-white rounded-xl border border-gray-200 p-5 space-y-3">
            <h3 class="text-xs font-bold text-text-muted-light uppercase tracking-wider">Listing Info</h3>
            <div class="space-y-2">
              <div class="flex justify-between text-sm">
                <span class="text-text-muted-light">Listing ID</span>
                <span class="text-xs font-mono text-text-light">{{ listing.id }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-text-muted-light">Created</span>
                <span class="text-xs text-text-light">{{ formatTimestamp(listing.createdAt) }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-text-muted-light">Updated</span>
                <span class="text-xs text-text-light">{{ formatTimestamp(listing.updatedAt) }}</span>
              </div>
              <div v-if="listing.totalViews !== undefined" class="flex justify-between text-sm">
                <span class="text-text-muted-light">Total Views</span>
                <span class="text-xs text-text-light font-semibold">{{ listing.totalViews }}</span>
              </div>
              <div v-if="listing.totalReviews !== undefined" class="flex justify-between text-sm">
                <span class="text-text-muted-light">Total Reviews</span>
                <span class="text-xs text-text-light font-semibold">{{ listing.totalReviews }}</span>
              </div>
              <div class="flex justify-between text-sm">
                <span class="text-text-muted-light">Availability</span>
                <span
                  class="text-xs font-semibold"
                  :class="listing.isAvailable ? 'text-emerald-600' : 'text-red-500'"
                >
                  {{ listing.isAvailable ? 'Available' : 'Unavailable' }}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import VehicleListingsDataService from '@/services/VehicleListingsDataService';
import { formatText } from '@/utils/format.js';

export default {
  data() {
    return {
      listing: null,
      details: null,
      loading: true,
      error: null,
      activeImageIndex: 0,
    };
  },
  computed: {
    displayStatus() {
      if (this.listing.is_suspended) return 'Suspended';
      const s = (this.listing.status || '').toLowerCase();
      const map = {
        active: 'Active',
        pending: 'Pending',
        suspended: 'Suspended',
        archived: 'Archived'
      };
      return map[s] || this.listing.status || 'Unknown';
    },
    statusBadgeClass() {
      if (this.listing.is_suspended) return 'bg-red-500/90 text-white';
      const s = (this.listing.status || '').toLowerCase();
      const map = {
        active: 'bg-emerald-500/90 text-white',
        pending: 'bg-amber-500/90 text-white',
        suspended: 'bg-red-500/90 text-white',
        archived: 'bg-gray-500/80 text-white'
      };
      return map[s] || 'bg-gray-500/80 text-white';
    }
  },
  methods: {
    formatText,
    formatPrice(price) {
      if (price == null) return '0';
      return Number(price).toLocaleString();
    },
    formatTimestamp(ts) {
      if (!ts) return 'N/A';
      const d = ts.toDate ? ts.toDate() : new Date(ts);
      return d.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    },
    getInitials(author) {
      if (!author || !author.display_name) return '?';
      return author.display_name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2);
    },
    prevImage() {
      if (!this.listing?.images?.length) return;
      this.activeImageIndex = (this.activeImageIndex - 1 + this.listing.images.length) % this.listing.images.length;
    },
    nextImage() {
      if (!this.listing?.images?.length) return;
      this.activeImageIndex = (this.activeImageIndex + 1) % this.listing.images.length;
    },
    async fetchListing() {
      this.loading = true;
      this.error = null;
      try {
        const id = this.$route.params.id;
        const listing = await VehicleListingsDataService.getById(id);
        if (!listing) {
          this.error = 'Listing not found';
          return;
        }
        this.listing = listing;
        const details = await VehicleListingsDataService.getDetails(id);
        this.details = details;
      } catch (err) {
        console.error('Error fetching listing:', err);
        this.error = 'Failed to load listing details';
      }
      this.loading = false;
    }
  },
  mounted() {
    this.fetchListing();
  }
};
</script>

<style scoped>
@reference "tailwindcss";
</style>
