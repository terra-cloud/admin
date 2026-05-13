<template>
  <div>
    <div
      v-if="isOpen"
      class="fixed inset-0 bg-black/30 z-40 transition-opacity"
      @click="$emit('close')"
    ></div>
    <div
      class="fixed top-0 right-0 h-full w-full max-w-xl bg-white shadow-lifted z-50 transform transition-transform duration-300 overflow-hidden"
      :class="isOpen ? 'translate-x-0' : 'translate-x-full'"
    >
      <div class="flex flex-col h-full">
        <!-- Header -->
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200 shrink-0">
          <h2 class="text-lg font-semibold text-text-light">Listing Details</h2>
          <button
            class="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted-light hover:bg-gray-100 transition-colors"
            @click="$emit('close')"
          >
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="flex-1 flex items-center justify-center">
          <div class="flex flex-col items-center gap-3">
            <div class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
            <span class="text-sm text-text-muted-light">Loading details...</span>
          </div>
        </div>

        <!-- Content -->
        <div v-else-if="listing" class="flex-1 overflow-y-auto">
          <!-- Image Gallery -->
          <div class="relative aspect-[16/10] bg-gray-100">
            <img
              v-if="listing.images && listing.images.length"
              :src="listing.images[0]"
              :alt="listing.title"
              class="w-full h-full object-cover"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="material-symbols-outlined text-5xl text-gray-300">image</span>
            </div>
            <div
              v-if="listing.images && listing.images.length > 1"
              class="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5"
            >
              <span
                v-for="(img, i) in listing.images.slice(0, 5)"
                :key="i"
                class="w-2 h-2 rounded-full"
                :class="i === 0 ? 'bg-white' : 'bg-white/50'"
              ></span>
              <span
                v-if="listing.images.length > 5"
                class="text-xs text-white font-medium ml-1"
              >+{{ listing.images.length - 5 }}</span>
            </div>
            <!-- Status Badge -->
            <span
              class="absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-semibold"
              :class="statusBadgeClass"
            >
              {{ displayStatus }}
            </span>
          </div>

          <div class="p-6 space-y-6">
            <!-- Title & Price -->
            <div>
              <h3 class="text-xl font-bold text-text-light mb-1">{{ listing.title || 'Untitled' }}</h3>
              <div class="flex items-baseline gap-2">
                <span class="text-2xl font-bold text-primary">₱{{ formatPrice(listing.price || listing.pricing?.dailyRate || 0) }}</span>
                <span class="text-sm text-text-muted-light">/ day</span>
              </div>
            </div>

            <!-- Quick Info -->
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
            <div v-if="listing.description">
              <h4 class="text-sm font-semibold text-text-light uppercase tracking-wider mb-2">Description</h4>
              <p class="text-sm text-text-light leading-relaxed">{{ listing.description }}</p>
            </div>

            <!-- Owner Details -->
            <div v-if="listing.author">
              <h4 class="text-sm font-semibold text-text-light uppercase tracking-wider mb-3">Owner</h4>
              <div class="flex items-center gap-3">
                <img
                  v-if="listing.author.photo_url"
                  :src="listing.author.photo_url"
                  :alt="listing.author.display_name"
                  class="w-10 h-10 rounded-full object-cover"
                />
                <div
                  v-else
                  class="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary text-sm font-bold"
                >
                  {{ getInitials(listing.author) }}
                </div>
                <div>
                  <p class="text-sm font-semibold text-text-light">{{ listing.author.display_name || 'Unknown' }}</p>
                  <p class="text-xs text-text-muted-light">{{ listing.author.account_type || 'User' }}</p>
                </div>
              </div>
            </div>

            <!-- Location -->
            <div v-if="listing.location">
              <h4 class="text-sm font-semibold text-text-light uppercase tracking-wider mb-2">Location</h4>
              <div class="flex items-start gap-2">
                <span class="material-symbols-outlined text-text-muted-light text-lg mt-0.5">location_on</span>
                <p class="text-sm text-text-light">{{ listing.location.details || listing.location.stringified_address || 'N/A' }}</p>
              </div>
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

            <!-- Timestamps -->
            <div class="border-t border-gray-100 pt-4 space-y-1.5">
              <div class="flex justify-between">
                <span class="text-xs text-text-muted-light">Listing ID</span>
                <span class="text-xs font-mono text-text-light">{{ listing.id }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-xs text-text-muted-light">Created</span>
                <span class="text-xs text-text-light">{{ formatTimestamp(listing.createdAt) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-xs text-text-muted-light">Updated</span>
                <span class="text-xs text-text-light">{{ formatTimestamp(listing.updatedAt) }}</span>
              </div>
              <div v-if="listing.totalViews !== undefined" class="flex justify-between">
                <span class="text-xs text-text-muted-light">Total Views</span>
                <span class="text-xs text-text-light">{{ listing.totalViews }}</span>
              </div>
              <div v-if="listing.totalReviews !== undefined" class="flex justify-between">
                <span class="text-xs text-text-muted-light">Total Reviews</span>
                <span class="text-xs text-text-light">{{ listing.totalReviews }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-xs text-text-muted-light">Availability</span>
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

        <!-- Error -->
        <div v-else class="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <span class="material-symbols-outlined text-4xl text-gray-300 mb-3">error_outline</span>
          <p class="text-sm text-text-muted-light">Could not load listing details.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { formatText } from '@/utils/format.js';

export default {
  name: 'ListingDetailsDrawer',
  props: {
    isOpen: {
      type: Boolean,
      default: false
    },
    listing: {
      type: Object,
      default: null
    },
    details: {
      type: Object,
      default: null
    },
    loading: {
      type: Boolean,
      default: false
    }
  },
  emits: ['close'],
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
    }
  }
};
</script>

<style scoped>
@reference "tailwindcss";
</style>
