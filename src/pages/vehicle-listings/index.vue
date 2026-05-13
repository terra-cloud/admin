<template>
  <div>
    <!-- Toast -->
    <Toast
      :message="toastMessage"
      :type="toastType"
      :showConfirmButtons="false"
      @cancel="clearToast"
    />

    <!-- Page Container -->
    <div class="px-4 py-5 sm:px-6 sm:py-6 space-y-5 sm:space-y-6">
      <!-- Header -->
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-text-light tracking-tight">
            Vehicle Listings Management
          </h1>
          <p class="text-sm text-text-muted-light mt-1 max-w-2xl leading-relaxed">
            Manage and monitor all vehicle rental listings across the Philippines.
          </p>
        </div>
        <div class="flex items-center gap-2.5">
          <button
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors border border-gray-200 text-text-muted-light hover:bg-gray-50 hover:text-text-light"
            @click="exportData"
            :disabled="exporting"
          >
            <i v-if="exporting" class="fas fa-spinner fa-spin"></i>
            <span v-else class="material-symbols-outlined text-lg">file_download</span>
            {{ exporting ? 'Exporting...' : 'Export Data' }}
          </button>
          <button
            class="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors bg-primary text-white hover:bg-primary/90 shadow-sm"
            @click="openCreateModal"
          >
            <span class="material-symbols-outlined text-lg">add</span>
            Create Listing
          </button>
        </div>
      </div>

      <!-- Stats Cards -->
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-primary hover:shadow-lifted transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Total Listings</span>
            <span class="material-symbols-outlined text-text-muted-light text-xl">directions_car</span>
          </div>
          <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ formatNumber(stats.total) }}</p>
          <p class="text-xs text-text-muted-light mt-1">All registered listings</p>
        </div>
        <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-emerald-500 hover:shadow-lifted transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Active</span>
            <span class="material-symbols-outlined text-emerald-500 text-xl">check_circle</span>
          </div>
          <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ formatNumber(stats.active) }}</p>
          <p class="text-xs text-text-muted-light mt-1">{{ activePercent }}% of total fleet</p>
        </div>
        <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-amber-400 hover:shadow-lifted transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Pending Review</span>
            <span class="material-symbols-outlined text-amber-400 text-xl">hourglass_empty</span>
          </div>
          <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ formatNumber(stats.pending) }}</p>
          <p class="text-xs text-text-muted-light mt-1">Requires attention</p>
        </div>
        <div class="bg-white rounded-xl shadow-soft p-4 sm:p-5 border-l-4 border-red-500 hover:shadow-lifted transition-shadow">
          <div class="flex items-center justify-between mb-2">
            <span class="text-xs font-medium text-text-muted-light uppercase tracking-wider">Suspended</span>
            <span class="material-symbols-outlined text-red-500 text-xl">block</span>
          </div>
          <p class="text-2xl sm:text-3xl font-bold text-text-light tabular-nums">{{ formatNumber(stats.suspended) }}</p>
          <p class="text-xs text-red-500 mt-1 flex items-center gap-1">
            <span class="material-symbols-outlined text-sm">warning</span>
            Flagged violations
          </p>
        </div>
      </div>

      <!-- Filters -->
      <div class="bg-white rounded-xl shadow-soft p-4 space-y-4">
        <!-- Search & Primary Filters -->
        <div class="flex flex-col sm:flex-row gap-3">
          <div class="relative flex-1 min-w-0">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted-light">search</span>
            <input
              v-model="searchQuery"
              type="text"
              placeholder="Search by title, owner, plate number, location, or ID..."
              class="w-full pl-9 pr-3 py-2.5 bg-input-light border-none rounded-lg text-sm placeholder:text-text-muted-light focus:ring-2 focus:ring-primary/30 outline-none"
            />
          </div>
          <button
            class="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-lg text-sm font-medium text-text-muted-light hover:bg-gray-100 transition-colors border border-gray-200"
            @click="showAdvancedFilters = !showAdvancedFilters"
          >
            <span class="material-symbols-outlined text-lg">filter_list</span>
            {{ showAdvancedFilters ? 'Hide Filters' : 'More Filters' }}
            <span v-if="activeFilterCount > 0" class="ml-1 w-5 h-5 rounded-full bg-primary text-white text-xs flex items-center justify-center font-bold">{{ activeFilterCount }}</span>
          </button>
        </div>

        <!-- Advanced Filters -->
        <div v-if="showAdvancedFilters" class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <div>
            <label class="block text-xs font-medium text-text-muted-light mb-1.5">Category</label>
            <select
              v-model="filters.category"
              class="w-full px-3 py-2 bg-input-light border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Categories</option>
              <option v-for="cat in uniqueCategories" :key="cat" :value="cat">{{ formatText(cat) }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-text-muted-light mb-1.5">Status</label>
            <select
              v-model="filters.status"
              class="w-full px-3 py-2 bg-input-light border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="suspended">Suspended</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-text-muted-light mb-1.5">Province</label>
            <select
              v-model="filters.province"
              class="w-full px-3 py-2 bg-input-light border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Provinces</option>
              <option v-for="prov in uniqueProvinces" :key="prov" :value="prov">{{ prov }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-text-muted-light mb-1.5">Vehicle Brand</label>
            <select
              v-model="filters.vehicleBrand"
              class="w-full px-3 py-2 bg-input-light border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Brands</option>
              <option v-for="brand in uniqueBrands" :key="brand" :value="brand">{{ brand }}</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-text-muted-light mb-1.5">Fuel Type</label>
            <select
              v-model="filters.fuelType"
              class="w-full px-3 py-2 bg-input-light border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Fuel Types</option>
              <option value="Gasoline">Gasoline</option>
              <option value="Diesel">Diesel</option>
              <option value="Electric">Electric</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-text-muted-light mb-1.5">Transmission</label>
            <select
              v-model="filters.transmission"
              class="w-full px-3 py-2 bg-input-light border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Transmissions</option>
              <option value="Automatic">Automatic</option>
              <option value="Manual">Manual</option>
              <option value="CVT">CVT</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-text-muted-light mb-1.5">Seating Capacity</label>
            <select
              v-model="filters.seatingCapacity"
              class="w-full px-3 py-2 bg-input-light border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Any</option>
              <option value="2">2 Seats</option>
              <option value="4">4 Seats</option>
              <option value="5">5 Seats</option>
              <option value="7">7 Seats</option>
              <option value="8">8+ Seats</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-text-muted-light mb-1.5">Availability</label>
            <select
              v-model="filters.availability"
              class="w-full px-3 py-2 bg-input-light border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All</option>
              <option value="available">Available</option>
              <option value="unavailable">Unavailable</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-text-muted-light mb-1.5">KYC Verified</label>
            <select
              v-model="filters.kycVerified"
              class="w-full px-3 py-2 bg-input-light border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">All Owners</option>
              <option value="verified">KYC Verified</option>
              <option value="unverified">KYC Unverified</option>
            </select>
          </div>
          <div>
            <label class="block text-xs font-medium text-text-muted-light mb-1.5">Date Range</label>
            <div class="flex items-center gap-1">
              <input
                v-model="filters.dateFrom"
                type="date"
                class="flex-1 min-w-0 px-2 py-2 bg-input-light border-none rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/30"
              />
              <span class="text-text-muted-light text-xs">to</span>
              <input
                v-model="filters.dateTo"
                type="date"
                class="flex-1 min-w-0 px-2 py-2 bg-input-light border-none rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/30"
              />
            </div>
          </div>
        </div>

        <!-- Active Filters Pills -->
        <div v-if="activeFilterCount > 0" class="flex flex-wrap items-center gap-2">
          <span class="text-xs text-text-muted-light font-medium">Active filters:</span>
          <span
            v-for="(filter, key) in activeFilterPills"
            :key="key"
            class="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-primary/5 text-primary border border-primary/10"
          >
            {{ filter.label }}: {{ filter.value }}
            <button class="hover:text-primary/70" @click="clearFilter(key)">
              <span class="material-symbols-outlined text-sm">close</span>
            </button>
          </span>
          <button
            class="text-xs text-text-muted-light hover:text-text-light underline"
            @click="clearAllFilters"
          >
            Clear all
          </button>
        </div>
      </div>

      <!-- Bulk Actions -->
      <div
        v-if="selectedIds.length > 0"
        class="bg-primary/5 border border-primary/10 rounded-xl px-4 py-3 flex items-center justify-between"
      >
        <span class="text-sm font-medium text-text-light">
          <span class="font-bold">{{ selectedIds.length }}</span> listing{{ selectedIds.length !== 1 ? 's' : '' }} selected
        </span>
        <div class="flex items-center gap-2">
          <button
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200"
            @click="bulkApprove"
            :disabled="bulkProcessing"
          >
            <span class="material-symbols-outlined text-sm">check_circle</span>
            Approve
          </button>
          <button
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-amber-50 text-amber-700 hover:bg-amber-100 border border-amber-200"
            @click="bulkSuspend"
            :disabled="bulkProcessing"
          >
            <span class="material-symbols-outlined text-sm">block</span>
            Suspend
          </button>
          <button
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-gray-50 text-text-light hover:bg-gray-100 border border-gray-200"
            @click="bulkArchive"
            :disabled="bulkProcessing"
          >
            <span class="material-symbols-outlined text-sm">archive</span>
            Archive
          </button>
          <button
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
            @click="confirmBulkDelete"
            :disabled="bulkProcessing"
          >
            <span class="material-symbols-outlined text-sm">delete</span>
            Delete
          </button>
          <button
            class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors hover:bg-gray-100 border border-gray-200 text-text-muted-light"
            @click="selectedIds = []"
            :disabled="bulkProcessing"
          >
            Clear
          </button>
        </div>
      </div>

      <!-- Loading State -->
      <div v-if="loading" class="bg-white rounded-xl shadow-soft overflow-hidden">
        <div class="p-6 space-y-4">
          <div v-for="n in 5" :key="n" class="flex items-center gap-4 animate-pulse">
            <div class="w-5 h-5 bg-gray-100 rounded"></div>
            <div class="w-16 h-12 bg-gray-100 rounded-lg"></div>
            <div class="flex-1 space-y-2">
              <div class="h-4 w-48 bg-gray-100 rounded"></div>
              <div class="h-3 w-24 bg-gray-100 rounded"></div>
            </div>
            <div class="h-4 w-16 bg-gray-100 rounded"></div>
            <div class="h-4 w-24 bg-gray-100 rounded"></div>
            <div class="h-6 w-16 bg-gray-100 rounded-full"></div>
            <div class="h-4 w-12 bg-gray-100 rounded"></div>
            <div class="h-8 w-8 bg-gray-100 rounded-lg"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="bg-white rounded-xl shadow-soft p-12 text-center">
        <span class="material-symbols-outlined text-5xl text-red-300 mb-4">error_outline</span>
        <h3 class="text-lg font-semibold text-text-light mb-2">Failed to Load Listings</h3>
        <p class="text-sm text-text-muted-light mb-4 max-w-md mx-auto">{{ error }}</p>
        <button
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90"
          @click="fetchListings"
        >
          Try Again
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="listings.length === 0" class="bg-white rounded-xl shadow-soft p-12 text-center">
        <span class="material-symbols-outlined text-5xl text-gray-300 mb-4">directions_car_off</span>
        <h3 class="text-lg font-semibold text-text-light mb-2">No Listings Yet</h3>
        <p class="text-sm text-text-muted-light mb-4 max-w-md mx-auto">
          There are no vehicle listings in the system. Create your first listing to get started.
        </p>
        <button
          class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium bg-primary text-white hover:bg-primary/90"
          @click="openCreateModal"
        >
          <span class="material-symbols-outlined text-lg">add</span>
          Create Listing
        </button>
      </div>

      <!-- No Results State -->
      <div v-else-if="filteredListings.length === 0" class="bg-white rounded-xl shadow-soft p-12 text-center">
        <span class="material-symbols-outlined text-5xl text-gray-300 mb-4">search_off</span>
        <h3 class="text-lg font-semibold text-text-light mb-2">No Results Found</h3>
        <p class="text-sm text-text-muted-light mb-4 max-w-md mx-auto">
          No listings match your current filters. Try adjusting your search criteria.
        </p>
        <button
          class="text-sm text-primary hover:text-primary/80 font-medium"
          @click="clearAllFilters"
        >
          Clear all filters
        </button>
      </div>

      <!-- Data Table (Desktop) -->
      <div v-else class="bg-white rounded-xl shadow-soft overflow-hidden hidden lg:block">
        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-gray-100 bg-gray-50/50">
                <th class="px-3 py-3 w-10">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 text-primary focus:ring-primary/30"
                    :checked="isAllSelected"
                    @change="toggleSelectAll"
                  />
                </th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-text-muted-light uppercase tracking-wider min-w-[200px]">Vehicle</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-text-muted-light uppercase tracking-wider">Category</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-text-muted-light uppercase tracking-wider min-w-[180px]">Owner</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-text-muted-light uppercase tracking-wider whitespace-nowrap">Daily Rate</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-text-muted-light uppercase tracking-wider whitespace-nowrap">Date Created</th>
                <th class="px-3 py-3 text-left text-xs font-semibold text-text-muted-light uppercase tracking-wider">Status</th>
                <th class="px-3 py-3 text-center text-xs font-semibold text-text-muted-light uppercase tracking-wider">Avail.</th>
                <th class="px-3 py-3 text-center text-xs font-semibold text-text-muted-light uppercase tracking-wider">Views</th>
                <th class="px-3 py-3 text-center text-xs font-semibold text-text-muted-light uppercase tracking-wider">Reviews</th>
                <th class="px-3 py-3 text-center text-xs font-semibold text-text-muted-light uppercase tracking-wider w-16">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr
                v-for="listing in paginatedListings"
                :key="listing.id"
                class="hover:bg-gray-50/50 transition-colors"
                :class="{ 'bg-primary/[0.02]': selectedIds.includes(listing.id) }"
              >
                <!-- Checkbox -->
                <td class="px-3 py-3">
                  <input
                    type="checkbox"
                    class="rounded border-gray-300 text-primary focus:ring-primary/30"
                    :checked="selectedIds.includes(listing.id)"
                    @change="toggleSelect(listing.id)"
                  />
                </td>
                <!-- Vehicle Column -->
                <td class="px-3 py-3">
                  <div class="flex items-center gap-3">
                    <div class="w-14 h-11 bg-gray-100 rounded-lg overflow-hidden shrink-0">
                      <img
                        v-if="listing.images && listing.images.length"
                        :src="listing.images[0]"
                        :alt="listing.title"
                        class="w-full h-full object-cover"
                        loading="lazy"
                      />
                      <div v-else class="w-full h-full flex items-center justify-center">
                        <span class="material-symbols-outlined text-lg text-gray-300">directions_car</span>
                      </div>
                    </div>
                    <div class="min-w-0">
                      <p class="text-sm font-medium text-text-light truncate max-w-[200px]">{{ listing.title || 'Untitled' }}</p>
                      <div class="flex items-center gap-1.5 mt-0.5">
                        <span class="text-xs text-text-muted-light">{{ listing.plateNumber || detailsMap[listing.id]?.plateNumber || 'No Plate' }}</span>
                        <span v-if="listing.vehicleBrand" class="text-xs text-text-muted-light">· {{ listing.vehicleBrand }}</span>
                      </div>
                    </div>
                  </div>
                </td>
                <!-- Category -->
                <td class="px-3 py-3">
                  <span class="text-sm text-text-light">{{ formatText(listing.category) || 'N/A' }}</span>
                </td>
                <!-- Owner -->
                <td class="px-3 py-3">
                  <div class="flex items-center gap-2">
                    <img
                      v-if="listing.author?.photo_url"
                      :src="listing.author.photo_url"
                      :alt="listing.author.display_name"
                      class="w-7 h-7 rounded-full object-cover shrink-0"
                    />
                    <div
                      v-else
                      class="w-7 h-7 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[10px] font-bold shrink-0"
                    >
                      {{ getInitials(listing.author) }}
                    </div>
                    <div class="min-w-0">
                      <div class="flex items-center gap-1">
                        <span class="text-sm text-text-light truncate max-w-[100px]">{{ listing.author?.display_name || 'Unknown' }}</span>
                        <span v-if="listing.author?.kyc_validated === 1 || listing.author?.kyc_validated === 'Approved'" class="material-symbols-outlined text-xs text-primary" title="KYC Verified">verified</span>
                      </div>
                      <p class="text-xs text-text-muted-light">{{ listing.author?.account_type || 'User' }}</p>
                    </div>
                  </div>
                </td>
                <!-- Daily Rate -->
                <td class="px-3 py-3">
                  <span class="text-sm font-semibold text-text-light tabular-nums">₱{{ formatPrice(listing.price || listing.pricing?.dailyRate || 0) }}</span>
                </td>
                <!-- Date Created -->
                <td class="px-3 py-3">
                  <span class="text-sm text-text-muted-light whitespace-nowrap">{{ formatDate(listing.createdAt) }}</span>
                </td>
                <!-- Status -->
                <td class="px-3 py-3">
                  <span
                    class="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
                    :class="statusBadgeClass(listing)"
                  >
                    {{ displayStatus(listing) }}
                  </span>
                </td>
                <!-- Availability -->
                <td class="px-3 py-3 text-center">
                  <span
                    class="inline-flex items-center justify-center w-7 h-7 rounded-full"
                    :class="listing.isAvailable ? 'bg-emerald-50 text-emerald-600' : 'bg-gray-100 text-gray-400'"
                    :title="listing.isAvailable ? 'Available' : 'Unavailable'"
                  >
                    <span class="material-symbols-outlined text-sm">{{ listing.isAvailable ? 'check' : 'close' }}</span>
                  </span>
                </td>
                <!-- Views -->
                <td class="px-3 py-3 text-center">
                  <span class="text-sm text-text-muted-light tabular-nums">{{ listing.totalViews ?? '-' }}</span>
                </td>
                <!-- Reviews -->
                <td class="px-3 py-3 text-center">
                  <span class="text-sm text-text-muted-light tabular-nums">{{ listing.totalReviews ?? '-' }}</span>
                </td>
                <!-- Actions -->
                <td class="px-3 py-3 text-center">
                  <ListingActions
                    :listing="listing"
                    @action="handleAction"
                  />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Mobile Card Layout -->
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
        <div
          v-for="listing in paginatedListings"
          :key="listing.id"
          class="bg-white rounded-xl shadow-soft overflow-hidden hover:shadow-lifted transition-shadow border border-gray-100"
        >
          <div class="relative aspect-[16/10] bg-gray-50">
            <img
              v-if="listing.images && listing.images.length"
              :src="listing.images[0]"
              :alt="listing.title"
              class="w-full h-full object-cover"
              loading="lazy"
            />
            <div v-else class="w-full h-full flex items-center justify-center">
              <span class="material-symbols-outlined text-4xl text-gray-200">directions_car</span>
            </div>
            <span
              class="absolute top-2 right-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold"
              :class="statusBadgeClass(listing)"
            >
              {{ displayStatus(listing) }}
            </span>
          </div>
          <div class="p-4 space-y-2.5">
            <div class="flex items-start justify-between gap-2">
              <div class="min-w-0 flex-1">
                <h3 class="text-sm font-semibold text-text-light truncate">{{ listing.title || 'Untitled' }}</h3>
                <p class="text-xs text-text-muted-light">{{ listing.vehicleBrand || '' }}{{ listing.vehicleBrand && listing.category ? ' · ' : '' }}{{ formatText(listing.category) || '' }}</p>
              </div>
              <div class="flex items-center gap-1.5 shrink-0">
                <input
                  type="checkbox"
                  class="rounded border-gray-300 text-primary focus:ring-primary/30"
                  :checked="selectedIds.includes(listing.id)"
                  @change="toggleSelect(listing.id)"
                />
                <ListingActions
                  :listing="listing"
                  @action="handleAction"
                />
              </div>
            </div>
            <div class="flex items-center gap-2">
              <img
                v-if="listing.author?.photo_url"
                :src="listing.author.photo_url"
                class="w-5 h-5 rounded-full object-cover"
              />
              <div v-else class="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-[8px] font-bold">
                {{ getInitials(listing.author) }}
              </div>
              <span class="text-xs text-text-muted-light truncate">{{ listing.author?.display_name || 'Unknown' }}</span>
            </div>
            <div class="flex items-center justify-between pt-2 border-t border-gray-50">
              <span class="text-base font-bold text-primary">₱{{ formatPrice(listing.price || listing.pricing?.dailyRate || 0) }}/day</span>
              <div class="flex items-center gap-3 text-xs text-text-muted-light">
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">visibility</span>
                  {{ listing.totalViews ?? 0 }}
                </span>
                <span class="flex items-center gap-1">
                  <span class="material-symbols-outlined text-sm">star</span>
                  {{ listing.totalReviews ?? 0 }}
                </span>
                <span
                  class="flex items-center gap-1"
                  :class="listing.isAvailable ? 'text-emerald-600' : 'text-gray-400'"
                >
                  <span class="material-symbols-outlined text-sm">{{ listing.isAvailable ? 'check_circle' : 'cancel' }}</span>
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <Pagination
        v-if="!loading && !error && listings.length > 0"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :tableData="tableData"
        :rowsPerPage="rowsPerPage"
        :itemLabel="'listings'"
        @setPage="setPage"
        @prevPage="prevPage"
        @nextPage="nextPage"
        @update:rowsPerPage="rowsPerPage = $event"
      />
    </div>

    <!-- Suspend Modal -->
    <div
      v-if="showSuspendModal"
      class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      @click.self="closeSuspendModal"
    >
      <div class="bg-white rounded-xl shadow-lifted max-w-md w-full mx-4">
        <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 class="text-lg font-semibold text-text-light">Suspend Listing</h2>
          <button class="w-8 h-8 flex items-center justify-center rounded-lg text-text-muted-light hover:bg-gray-100 transition-colors" @click="closeSuspendModal">
            <span class="material-symbols-outlined">close</span>
          </button>
        </div>
        <div class="p-6 space-y-4">
          <p class="text-sm text-text-muted-light">
            Are you sure you want to suspend this listing? Provide a reason for this action.
          </p>
          <div>
            <label class="block text-sm font-medium text-text-muted-light mb-1.5">Suspend Reason</label>
            <select
              v-model="suspendReason"
              class="w-full px-4 py-2.5 rounded-lg bg-input-light border-none text-sm outline-none focus:ring-2 focus:ring-primary/30"
            >
              <option value="">Select a reason...</option>
              <option value="Violation of terms">Violation of terms</option>
              <option value="Inaccurate information">Inaccurate information</option>
              <option value="Spam or duplicate">Spam or duplicate</option>
              <option value="Owner verification issue">Owner verification issue</option>
              <option value="Safety concern">Safety concern</option>
              <option value="User complaint">User complaint</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div v-if="suspendReason === 'Other'">
            <label class="block text-sm font-medium text-text-muted-light mb-1.5">Custom Reason</label>
            <textarea
              v-model="suspendCustomReason"
              class="w-full px-4 py-2.5 rounded-lg bg-input-light border-none text-sm outline-none focus:ring-2 focus:ring-primary/30"
              rows="3"
              placeholder="Describe the reason..."
            ></textarea>
          </div>
        </div>
        <div class="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium border border-gray-200 text-text-light hover:bg-gray-50 transition-colors"
            @click="closeSuspendModal"
            :disabled="suspending"
          >
            Cancel
          </button>
          <button
            class="px-4 py-2 rounded-lg text-sm font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors disabled:opacity-50"
            @click="confirmSuspend"
            :disabled="suspending || !suspendReason"
          >
            <i v-if="suspending" class="fas fa-spinner fa-spin mr-1.5"></i>
            {{ suspending ? 'Suspending...' : 'Confirm Suspend' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <DeleteConfirmModal
      v-if="showDeleteConfirm"
      :currentId="deleteTargetId"
      :message="deleteMessage"
      :show="showDeleteConfirm"
      @confirm="confirmDelete"
      @close="closeDeleteConfirm"
    />

    <!-- Details Drawer -->
    <ListingDetailsDrawer
      :isOpen="showDetailsDrawer"
      :listing="selectedListing"
      :details="selectedDetails"
      :loading="detailsLoading"
      @close="closeDetailsDrawer"
    />
  </div>
</template>

<script>
import VehicleListingsDataService from '@/services/VehicleListingsDataService';
import { formatText } from '@/utils/format.js';
import Toast from '@/components/Toast.vue';
import DeleteConfirmModal from '@/components/ConfirmDialog.vue';
import Pagination from '@/components/Pagination.vue';
import ListingActions from '@/pages/vehicle-listings/components/ListingActions.vue';
import ListingDetailsDrawer from '@/pages/vehicle-listings/components/ListingDetailsDrawer.vue';

export default {
  components: {
    Toast,
    DeleteConfirmModal,
    Pagination,
    ListingActions,
    ListingDetailsDrawer
  },
  data() {
    return {
      listings: [],
      detailsCache: {},
      loading: true,
      error: null,
      searchQuery: '',
      showAdvancedFilters: false,
      filters: {
        category: '',
        status: '',
        province: '',
        vehicleBrand: '',
        fuelType: '',
        transmission: '',
        seatingCapacity: '',
        availability: '',
        kycVerified: '',
        dateFrom: '',
        dateTo: ''
      },
      sortKey: 'createdAt',
      sortOrder: 'desc',
      currentPage: 1,
      rowsPerPage: 20,
      selectedIds: [],
      bulkProcessing: false,
      exporting: false,
      toastMessage: '',
      toastType: '',
      // Suspend modal
      showSuspendModal: false,
      suspendTarget: null,
      suspendReason: '',
      suspendCustomReason: '',
      suspending: false,
      // Delete confirm
      showDeleteConfirm: false,
      deleteTargetId: null,
      deleteMessage: 'Are you sure you want to delete this listing? This action cannot be undone.',
      // Details drawer
      showDetailsDrawer: false,
      selectedListing: null,
      selectedDetails: null,
      detailsLoading: false,
      // Firestore listeners
      unsubscribe: null
    };
  },
  computed: {
    stats() {
      const total = this.listings.length;
      let active = 0;
      let pending = 0;
      let suspended = 0;
      this.listings.forEach(l => {
        const s = (l.status || '').toLowerCase();
        if (l.is_suspended || s === 'suspended') suspended++;
        else if (s === 'active' || l.isAvailable) active++;
        else if (s === 'pending') pending++;
      });
      return { total, active, pending, suspended };
    },
    activePercent() {
      if (this.stats.total === 0) return 0;
      return ((this.stats.active / this.stats.total) * 100).toFixed(1);
    },
    uniqueCategories() {
      return [...new Set(this.listings.map(l => l.category).filter(Boolean))].sort();
    },
    uniqueProvinces() {
      const provinces = this.listings
        .map(l => l.location?.details || l.location?.province)
        .filter(Boolean);
      return [...new Set(provinces)].sort();
    },
    uniqueBrands() {
      return [...new Set(this.listings.map(l => l.vehicleBrand).filter(Boolean))].sort();
    },
    detailsMap() {
      return this.detailsCache;
    },
    activeFilterCount() {
      let count = 0;
      for (const key in this.filters) {
        if (this.filters[key]) count++;
      }
      return count;
    },
    activeFilterPills() {
      const pills = {};
      const labels = {
        category: 'Category',
        status: 'Status',
        province: 'Province',
        vehicleBrand: 'Brand',
        fuelType: 'Fuel',
        transmission: 'Transmission',
        seatingCapacity: 'Seats',
        availability: 'Availability',
        kycVerified: 'KYC',
        dateFrom: 'From',
        dateTo: 'To'
      };
      for (const key in this.filters) {
        if (this.filters[key]) {
          pills[key] = {
            label: labels[key] || key,
            value: this.filters[key]
          };
        }
      }
      return pills;
    },
    filteredListings() {
      return this.listings.filter(l => {
        const q = this.searchQuery.toLowerCase().trim();
        if (q) {
          const searchable = [
            l.title,
            l.keywords ? (Array.isArray(l.keywords) ? l.keywords.join(' ') : l.keywords) : '',
            l.author?.display_name,
            l.vehicleBrand,
            l.id,
            l.plateNumber || this.detailsMap[l.id]?.plateNumber,
            l.location?.details,
            l.location?.stringified_address
          ].filter(Boolean).join(' ').toLowerCase();
          if (!searchable.includes(q)) return false;
        }
        if (this.filters.category && l.category !== this.filters.category) return false;
        if (this.filters.status) {
          const s = (l.status || '').toLowerCase();
          if (this.filters.status === 'suspended' && !l.is_suspended && s !== 'suspended') return false;
          else if (this.filters.status !== 'suspended' && s !== this.filters.status) return false;
          else if (this.filters.status === 'suspended' && l.is_suspended) return true;
        }
        if (this.filters.province) {
          const loc = l.location?.details || l.location?.province || '';
          if (loc !== this.filters.province) return false;
        }
        if (this.filters.vehicleBrand && (l.vehicleBrand || '') !== this.filters.vehicleBrand) return false;
        if (this.filters.availability) {
          if (this.filters.availability === 'available' && !l.isAvailable) return false;
          if (this.filters.availability === 'unavailable' && l.isAvailable) return false;
        }
        if (this.filters.kycVerified) {
          const kyc = l.author?.kyc_validated;
          const isVerified = kyc === 1 || kyc === 'Approved' || kyc === true;
          if (this.filters.kycVerified === 'verified' && !isVerified) return false;
          if (this.filters.kycVerified === 'unverified' && isVerified) return false;
        }
        if (this.filters.dateFrom || this.filters.dateTo) {
          const created = l.createdAt?.toDate ? l.createdAt.toDate() : new Date(l.createdAt || 0);
          if (this.filters.dateFrom) {
            const from = new Date(this.filters.dateFrom);
            if (created < from) return false;
          }
          if (this.filters.dateTo) {
            const to = new Date(this.filters.dateTo);
            to.setHours(23, 59, 59, 999);
            if (created > to) return false;
          }
        }
        return true;
      });
    },
    sortedListings() {
      const sorted = [...this.filteredListings];
      const dir = this.sortOrder === 'asc' ? 1 : -1;
      sorted.sort((a, b) => {
        let aVal, bVal;
        if (this.sortKey === 'createdAt') {
          aVal = a.createdAt?.toDate ? a.createdAt.toDate().getTime() : new Date(a.createdAt || 0).getTime();
          bVal = b.createdAt?.toDate ? b.createdAt.toDate().getTime() : new Date(b.createdAt || 0).getTime();
        } else if (this.sortKey === 'price') {
          aVal = Number(a.price || a.pricing?.dailyRate || 0);
          bVal = Number(b.price || b.pricing?.dailyRate || 0);
        } else if (this.sortKey === 'title') {
          aVal = (a.title || '').toLowerCase();
          bVal = (b.title || '').toLowerCase();
        } else {
          aVal = a[this.sortKey];
          bVal = b[this.sortKey];
        }
        if (aVal == null) return 1;
        if (bVal == null) return -1;
        if (aVal < bVal) return -1 * dir;
        if (aVal > bVal) return 1 * dir;
        return 0;
      });
      return sorted;
    },
    paginatedListings() {
      const start = (this.currentPage - 1) * this.rowsPerPage;
      return this.sortedListings.slice(start, start + this.rowsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredListings.length / this.rowsPerPage);
    },
    tableData() {
      const total = this.filteredListings.length;
      const from = total === 0 ? 0 : (this.currentPage - 1) * this.rowsPerPage + 1;
      const to = Math.min(from + this.paginatedListings.length - 1, total);
      return { from, to, totalItems: total };
    },
    isAllSelected() {
      return this.paginatedListings.length > 0 && this.paginatedListings.every(l => this.selectedIds.includes(l.id));
    }
  },
  methods: {
    formatText,
    formatNumber(n) {
      if (n == null) return '0';
      return Number(n).toLocaleString();
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
    displayStatus(listing) {
      if (listing.is_suspended) return 'Suspended';
      const s = (listing.status || '').toLowerCase();
      const map = {
        active: 'Active',
        pending: 'Pending',
        suspended: 'Suspended',
        archived: 'Archived'
      };
      return map[s] || listing.status || 'Unknown';
    },
    statusBadgeClass(listing) {
      if (listing.is_suspended) return 'bg-red-50 text-red-700 border border-red-200/50';
      const s = (listing.status || '').toLowerCase();
      const map = {
        active: 'bg-emerald-50 text-emerald-700 border border-emerald-200/50',
        pending: 'bg-amber-50 text-amber-700 border border-amber-200/50',
        suspended: 'bg-red-50 text-red-700 border border-red-200/50',
        archived: 'bg-gray-100 text-gray-600 border border-gray-200/50'
      };
      return map[s] || 'bg-gray-50 text-gray-600 border border-gray-200/50';
    },
    showToast(message, type) {
      this.toastMessage = message;
      this.toastType = type;
    },
    clearToast() {
      this.toastMessage = '';
      this.toastType = '';
    },

    // Firestore
    fetchListings() {
      this.loading = true;
      this.error = null;
      if (this.unsubscribe) {
        this.unsubscribe();
      }
      this.unsubscribe = VehicleListingsDataService.getAll(
        (listings) => {
          this.listings = listings.filter(l => l.id);
          this.loading = false;
        },
        (error) => {
          this.error = error.message || 'Failed to load listings';
          this.loading = false;
        }
      );
    },

    async fetchDetails(listingId) {
      if (this.detailsCache[listingId]) return this.detailsCache[listingId];
      try {
        const details = await VehicleListingsDataService.getDetails(listingId);
        if (details) {
          this.detailsCache = { ...this.detailsCache, [listingId]: details };
        }
        return details;
      } catch (err) {
        console.error('Error fetching details:', err);
        return null;
      }
    },

    // Selection
    toggleSelect(id) {
      const idx = this.selectedIds.indexOf(id);
      if (idx === -1) {
        this.selectedIds.push(id);
      } else {
        this.selectedIds.splice(idx, 1);
      }
    },
    toggleSelectAll() {
      if (this.isAllSelected) {
        this.selectedIds = [];
      } else {
        this.selectedIds = this.paginatedListings.map(l => l.id);
      }
    },

    // Pagination
    setPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },

    // Filters
    clearFilter(key) {
      this.filters[key] = '';
    },
    clearAllFilters() {
      for (const key in this.filters) {
        this.filters[key] = '';
      }
      this.searchQuery = '';
      this.currentPage = 1;
    },

    // Actions
    handleAction({ action, listing }) {
      this.currentPage = 1;
      switch (action) {
        case 'view':
          this.openDetails(listing);
          break;
        case 'edit':
          this.openEdit(listing);
          break;
        case 'approve':
          this.approveListing(listing);
          break;
        case 'suspend':
          this.openSuspendModal(listing);
          break;
        case 'activate':
          this.activateListing(listing);
          break;
        case 'archive':
          this.archiveListing(listing);
          break;
        case 'delete':
          this.openDeleteConfirm(listing);
          break;
        case 'viewOwner':
          this.viewOwner(listing);
          break;
        case 'copyId':
          this.copyListingId(listing);
          break;
      }
    },

    async approveListing(listing) {
      try {
        await VehicleListingsDataService.updateStatus(listing.id, {
          status: 'Active',
          is_suspended: false,
          isAvailable: true
        });
        this.showToast('Listing approved successfully', 'success');
      } catch (err) {
        this.showToast('Failed to approve listing', 'error');
      }
    },

    openSuspendModal(listing) {
      this.suspendTarget = listing;
      this.suspendReason = '';
      this.suspendCustomReason = '';
      this.showSuspendModal = true;
    },
    closeSuspendModal() {
      this.showSuspendModal = false;
      this.suspendTarget = null;
      this.suspendReason = '';
      this.suspendCustomReason = '';
    },
    async confirmSuspend() {
      if (!this.suspendTarget || !this.suspendReason) return;
      this.suspending = true;
      try {
        const reason = this.suspendReason === 'Other' ? this.suspendCustomReason : this.suspendReason;
        await VehicleListingsDataService.updateStatus(this.suspendTarget.id, {
          status: 'Suspended',
          is_suspended: true,
          isAvailable: false,
          suspendReason: reason,
          suspendedAt: new Date().toISOString()
        });
        this.showToast('Listing suspended successfully', 'success');
        this.closeSuspendModal();
      } catch (err) {
        this.showToast('Failed to suspend listing', 'error');
      } finally {
        this.suspending = false;
      }
    },

    async activateListing(listing) {
      try {
        await VehicleListingsDataService.updateStatus(listing.id, {
          status: 'Active',
          is_suspended: false,
          isAvailable: true
        });
        this.showToast('Listing activated successfully', 'success');
      } catch (err) {
        this.showToast('Failed to activate listing', 'error');
      }
    },

    async archiveListing(listing) {
      try {
        await VehicleListingsDataService.updateStatus(listing.id, {
          status: 'Archived',
          isAvailable: false
        });
        this.showToast('Listing archived successfully', 'success');
      } catch (err) {
        this.showToast('Failed to archive listing', 'error');
      }
    },

    openDeleteConfirm(listing) {
      this.deleteTargetId = listing.id;
      this.deleteMessage = `Are you sure you want to delete "${listing.title || 'Untitled'}"? This action cannot be undone.`;
      this.showDeleteConfirm = true;
    },
    closeDeleteConfirm() {
      this.showDeleteConfirm = false;
      this.deleteTargetId = null;
    },

    openEdit(listing) {
      this.$router.push(`/vehicle-listings/${listing.id}/edit`);
    },

    viewOwner(listing) {
      if (listing.ownerId) {
        this.$router.push(`/users`);
      } else {
        this.showToast('Owner information not available', 'error');
      }
    },

    copyListingId(listing) {
      navigator.clipboard.writeText(listing.id).then(() => {
        this.showToast('Listing ID copied to clipboard', 'success');
      }).catch(() => {
        this.showToast('Failed to copy ID', 'error');
      });
    },

    // Details Drawer
    async openDetails(listing) {
      this.selectedListing = listing;
      this.selectedDetails = null;
      this.showDetailsDrawer = true;
      this.detailsLoading = true;
      const details = await this.fetchDetails(listing.id);
      this.selectedDetails = details;
      this.detailsLoading = false;
    },
    closeDetailsDrawer() {
      this.showDetailsDrawer = false;
      this.selectedListing = null;
      this.selectedDetails = null;
    },

    // Create Listing
    openCreateModal() {
      this.$router.push('/vehicle-listings/create');
    },

    // Bulk Actions
    async bulkApprove() {
      if (this.selectedIds.length === 0) return;
      this.bulkProcessing = true;
      try {
        await VehicleListingsDataService.bulkUpdateStatus(this.selectedIds, {
          status: 'Active',
          is_suspended: false,
          isAvailable: true
        });
        this.showToast(`${this.selectedIds.length} listings approved successfully`, 'success');
        this.selectedIds = [];
      } catch (err) {
        this.showToast('Failed to approve listings', 'error');
      } finally {
        this.bulkProcessing = false;
      }
    },

    async bulkSuspend() {
      if (this.selectedIds.length === 0) return;
      this.bulkProcessing = true;
      try {
        await VehicleListingsDataService.bulkUpdateStatus(this.selectedIds, {
          status: 'Suspended',
          is_suspended: true,
          isAvailable: false
        });
        this.showToast(`${this.selectedIds.length} listings suspended successfully`, 'success');
        this.selectedIds = [];
      } catch (err) {
        this.showToast('Failed to suspend listings', 'error');
      } finally {
        this.bulkProcessing = false;
      }
    },

    async bulkArchive() {
      if (this.selectedIds.length === 0) return;
      this.bulkProcessing = true;
      try {
        await VehicleListingsDataService.bulkUpdateStatus(this.selectedIds, {
          status: 'Archived',
          isAvailable: false
        });
        this.showToast(`${this.selectedIds.length} listings archived successfully`, 'success');
        this.selectedIds = [];
      } catch (err) {
        this.showToast('Failed to archive listings', 'error');
      } finally {
        this.bulkProcessing = false;
      }
    },

    confirmBulkDelete() {
      if (this.selectedIds.length === 0) return;
      this.deleteTargetId = 'bulk';
      this.deleteMessage = `Are you sure you want to delete ${this.selectedIds.length} selected listings? This action cannot be undone.`;
      this.showDeleteConfirm = true;
    },

    async confirmDelete(id) {
      if (id === 'bulk') {
        try {
          await VehicleListingsDataService.bulkDelete(this.selectedIds);
          this.showToast(`${this.selectedIds.length} listings deleted successfully`, 'success');
          this.selectedIds = [];
          this.closeDeleteConfirm();
        } catch (err) {
          this.showToast('Failed to delete listings', 'error');
        }
      } else {
        try {
          await VehicleListingsDataService.delete(id);
          this.selectedIds = this.selectedIds.filter(sid => sid !== id);
          this.showToast('Listing deleted successfully', 'success');
          this.closeDeleteConfirm();
        } catch (err) {
          this.showToast('Failed to delete listing', 'error');
        }
      }
    },

    // Export
    exportData() {
      this.exporting = true;
      try {
        const data = this.filteredListings.length > 0 ? this.filteredListings : this.listings;
        const headers = ['ID', 'Title', 'Category', 'Vehicle Brand', 'Plate Number', 'Owner', 'Owner Email', 'Daily Rate', 'Status', 'Available', 'Views', 'Reviews', 'Created At', 'Location'];
        const rows = data.map(l => [
          l.id,
          `"${(l.title || '').replace(/"/g, '""')}"`,
          l.category || '',
          l.vehicleBrand || '',
          (l.plateNumber || this.detailsMap[l.id]?.plateNumber || ''),
          `"${(l.author?.display_name || '').replace(/"/g, '""')}"`,
          l.author?.email || '',
          l.price || l.pricing?.dailyRate || 0,
          this.displayStatus(l),
          l.isAvailable ? 'Yes' : 'No',
          l.totalViews ?? 0,
          l.totalReviews ?? 0,
          this.formatDate(l.createdAt),
          `"${(l.location?.details || l.location?.stringified_address || '').replace(/"/g, '""')}"`
        ]);

        const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
        const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `vehicle-listings-export-${new Date().toISOString().split('T')[0]}.csv`;
        a.click();
        URL.revokeObjectURL(url);
        this.showToast('Data exported successfully', 'success');
      } catch (err) {
        this.showToast('Failed to export data', 'error');
      } finally {
        this.exporting = false;
      }
    },

    // Sort
    sort(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'desc';
      }
    },
    sortIcon(key) {
      if (this.sortKey === key) {
        return this.sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
      }
      return 'fa-sort';
    }
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
    filters: {
      deep: true,
      handler() {
        this.currentPage = 1;
      }
    },
    rowsPerPage() {
      this.currentPage = 1;
    }
  },
  mounted() {
    this.fetchListings();
  },
  beforeUnmount() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  }
};
</script>

<style scoped>
@reference "tailwindcss";
</style>
