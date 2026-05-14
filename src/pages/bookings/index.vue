<template>
  <div>
    <div class="px-4 py-5 sm:px-6 sm:py-6 space-y-5 sm:space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-text-light tracking-tight">
            Bookings
          </h1>
          <p class="text-sm text-text-muted-light mt-1 max-w-2xl leading-relaxed">
            Manage all booking transactions across the platform — service and vehicle rental.
          </p>
        </div>
      </div>

      <div class="border-b border-gray-200">
        <nav class="flex gap-6">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            class="pb-3 text-sm font-medium transition-colors relative flex items-center gap-2"
            :class="activeTab === tab.key ? 'text-primary' : 'text-text-muted-light hover:text-text-light'"
            @click="activeTab = tab.key"
          >
            <span class="material-symbols-outlined text-lg">{{ tab.icon }}</span>
            {{ tab.label }}
            <span
              v-if="activeTab === tab.key"
              class="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full"
            ></span>
          </button>
        </nav>
      </div>

      <div v-if="activeTab === 'service'">
        <ServiceBookingsPage />
      </div>
      <div v-else-if="activeTab === 'vehicle'">
        <VehicleBookingsPage />
      </div>
    </div>
  </div>
</template>

<script>
import ServiceBookingsPage from '@/pages/service-bookings/index.vue';
import VehicleBookingsPage from '@/pages/vehicle-bookings/index.vue';

export default {
  components: {
    ServiceBookingsPage,
    VehicleBookingsPage
  },
  data() {
    return {
      activeTab: 'service',
      tabs: [
        { key: 'service', label: 'Service Bookings', icon: 'calendar_check' },
        { key: 'vehicle', label: 'Vehicle Bookings', icon: 'directions_car' }
      ]
    };
  }
};
</script>

<style scoped>
@reference "tailwindcss";
</style>
