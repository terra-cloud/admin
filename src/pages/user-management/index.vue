<template>
  <div>
    <div class="px-4 py-5 sm:px-6 sm:py-6 space-y-5 sm:space-y-6">
      <div class="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <h1 class="text-2xl sm:text-3xl font-bold text-text-light tracking-tight">
            User Management
          </h1>
          <p class="text-sm text-text-muted-light mt-1 max-w-2xl leading-relaxed">
            Manage users, admins, and their roles across the platform.
          </p>
        </div>
      </div>

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

      <div v-if="activeTab === 'users'">
        <UsersIndex />
      </div>
      <div v-else-if="activeTab === 'admins'">
        <AdminsIndex />
      </div>
    </div>
  </div>
</template>

<script>
import UsersIndex from '@/pages/users/index.vue';
import AdminsIndex from '@/pages/admins/index.vue';

export default {
  components: { UsersIndex, AdminsIndex },
  data() {
    return {
      activeTab: 'users',
      tabs: [
        { key: 'users', label: 'Users' },
        { key: 'admins', label: 'Admins' },
      ],
    };
  },
  mounted() {
    const tab = this.$route.query.tab || 'users';
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
