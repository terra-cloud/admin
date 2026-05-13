<template>
  <div class="max-w-5xl mx-auto px-4 sm:px-6">
    <div class="py-6">
      <button @click="$router.back()" class="inline-flex items-center gap-2 text-text-muted-light hover:text-text-light mb-6">
        <i class="fas fa-arrow-left"></i> Back
      </button>

      <div v-if="loading" class="text-center py-12">
        <p class="text-text-muted-light">Loading user...</p>
      </div>

      <div v-else-if="error" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg">
        {{ error }}
      </div>

      <template v-else>
        <div v-if="saved" class="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-6">
          User updated successfully.
        </div>
        <div v-if="saveError" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-6">
          {{ saveError }}
        </div>

        <div class="bg-white rounded-xl shadow-soft overflow-hidden mb-6">
          <div class="px-6 py-4 flex items-center gap-4">
            <img
              v-if="user.photo_url"
              :src="user.photo_url"
              class="w-12 h-12 rounded-full object-cover"
              alt="User Photo"
            />
            <div class="flex-1">
              <h2 class="text-lg font-semibold text-text-primary">{{ user.name }} {{ user.last_name }}</h2>
              <p class="text-sm text-text-muted-light">{{ user.email }}</p>
            </div>
            <span
              class="px-2.5 py-0.5 rounded-full text-xs font-medium"
              :class="statusClass(user.account_state)"
            >
              {{ user.account_state }}
            </span>
          </div>
        </div>

        <div class="border-b border-gray-200 mb-6">
          <nav class="flex gap-6 -mb-px">
            <router-link
              v-for="tab in tabs"
              :key="tab.key"
              :to="`/users/${$route.params.id}/edit/${tab.key}`"
              class="pb-3 text-sm font-medium border-b-2 transition-colors"
              :class="isActive(tab.key) ? 'border-blue-600 text-blue-600' : 'border-transparent text-text-muted-light hover:text-text-light hover:border-gray-300'"
            >
              {{ tab.label }}
            </router-link>
          </nav>
        </div>

        <router-view
          :user="user"
          @saved="onSaved"
          @save-error="onSaveError"
        />
      </template>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase';
import { doc, getDoc } from 'firebase/firestore';

export default {
  props: {
    user: Object,
  },
  data() {
    return {
      user: {},
      loading: true,
      error: null,
      saved: false,
      saveError: null,
    };
  },
  computed: {
    previousRoute() {
      return this.$store.state.previousRoute;
    },
  },
  async mounted() {
    await this.fetchUser();
  },
  computed: {
    tabs() {
      const allTabs = [
        { key: 'overview', label: 'Overview' },
        { key: 'account', label: 'Account' },
        { key: 'verification', label: 'Verification' },
        { key: 'employer', label: 'Employer' },
        { key: 'terran', label: 'Terran' },
        { key: 'preferences', label: 'Preferences' },
      ];
      return allTabs.filter(tab => {
        if (tab.key === 'employer') return this.user.account_type === 2;
        if (tab.key === 'terran') return this.user.account_type === 1;
        return true;
      });
    },
  },
  methods: {
    async fetchUser() {
      this.loading = true;
      this.error = null;
      try {
        const docRef = doc(db, 'users', this.$route.params.id);
        const docSnap = await getDoc(docRef);
        if (!docSnap.exists()) {
          this.error = 'User not found.';
          return;
        }
        this.user = docSnap.data();
      } catch (err) {
        this.error = 'Failed to load user.';
      } finally {
        this.loading = false;
      }
    },
    isActive(key) {
      return this.$route.name === `userEdit${key.charAt(0).toUpperCase() + key.slice(1)}`;
    },
    onSaved() {
      this.saved = true;
      this.fetchUser();
      setTimeout(() => { this.saved = false; }, 3000);
    },
    onSaveError(msg) {
      this.saveError = msg;
      setTimeout(() => { this.saveError = null; }, 5000);
    },
    statusClass(state) {
      if (state === 'active') return 'bg-green-100 text-green-700';
      if (state === 'suspended') return 'bg-red-100 text-red-700';
      return 'bg-gray-100 text-gray-700';
    },
  },
};
</script>
