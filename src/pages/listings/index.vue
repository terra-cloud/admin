<template>
  <div>
    <div class="px-4 py-5 sm:px-6 sm:py-6 space-y-5 sm:space-y-6">
      <div class="border-b border-gray-200">
        <nav class="flex gap-6 -mb-px">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="pb-3 text-sm font-medium border-b-2 transition-colors"
            :class="activeTab === tab.key ? 'border-blue-600 text-blue-600' : 'border-transparent text-text-muted-light hover:text-text-light hover:border-gray-300'"
          >
            {{ tab.label }}
          </button>
        </nav>
      </div>

      <div v-if="activeTab === 'jobs'">
        <JobPostings />
      </div>
      <div v-else-if="activeTab === 'vehicle-listings'">
        <VehicleListings />
      </div>
    </div>
  </div>
</template>

<script>
import JobPostings from '@/pages/jobs/JobPostings.vue';
import VehicleListings from '@/pages/vehicle-listings/index.vue';

export default {
  components: { JobPostings, VehicleListings },
  data() {
    return {
      activeTab: 'jobs',
      tabs: [
        { key: 'jobs', label: 'Service Listing' },
        { key: 'vehicle-listings', label: 'Vehicle Listings' },
      ],
    };
  },
  mounted() {
    const tab = this.$route.query.tab || 'jobs';
    if (this.tabs.some(t => t.key === tab)) {
      this.activeTab = tab;
    }
  },
  watch: {
    activeTab(tab) {
      this.$router.replace({ query: { tab } }).catch(() => {});
    },
  },
};
</script>
