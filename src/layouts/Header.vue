<template>
  <header class="fixed top-0 left-0 right-0 h-16 bg-white shadow-sm z-40 font-display flex items-center">
    <div class="flex items-center justify-between w-full h-full px-4 lg:px-6">
      <button
        class="lg:hidden text-text-light hover:text-primary transition-colors text-xl"
        @click="$emit('toggle-mobile-sidebar')"
      >
        <i class="fas fa-bars"></i>
      </button>
      <div class="flex items-center gap-4 ml-auto">
        <div class="relative">
          <i class="fas fa-bell text-text-light hover:text-primary transition-colors cursor-pointer text-xl"></i>
          <span
            v-if="notifications.length"
            class="absolute -top-1.5 -right-1.5 bg-red-500 text-white text-[10px] font-bold rounded-full min-w-[18px] h-[18px] flex items-center justify-center px-1"
          >
            {{ notifications.length }}
          </span>
        </div>
        <div class="relative" ref="dropdown">
          <button
            class="flex items-center gap-2 text-text-light hover:text-primary transition-colors text-sm"
            @click="dropdownOpen = !dropdownOpen"
          >
            <i class="fas fa-user-circle text-xl"></i>
            <span class="hidden sm:inline font-medium">{{ adminName }}</span>
            <i class="fas fa-chevron-down text-[10px]"></i>
          </button>
          <div
            v-if="dropdownOpen"
            class="absolute right-0 top-full mt-2 bg-white shadow-lifted rounded-lg py-1 min-w-[160px] z-50 border border-gray-100"
          >
            <button
              class="w-full text-left px-4 py-2 text-sm text-text-light hover:bg-gray-50 transition-colors flex items-center gap-2"
              @click="logout"
            >
              <i class="fas fa-sign-out-alt"></i> Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
import { apiLogout } from '@/apis/auth';
import { state, clearAuth } from '@/stores/auth';

export default {
  props: ['mobileSidebarOpen'],
  emits: ['toggle-mobile-sidebar'],
  data() {
    return {
      notifications: [
        { id: 1, message: 'New user registered' },
        { id: 2, message: 'System update available' },
      ],
      dropdownOpen: false,
    };
  },
  computed: {
    adminName() {
      const admin = state.admin
      if (admin?.firstname) return admin.firstname
      if (admin?.email) return admin.email
      return 'Admin'
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
  methods: {
    handleClickOutside(event) {
      if (this.$refs.dropdown && !this.$refs.dropdown.contains(event.target)) {
        this.dropdownOpen = false;
      }
    },
    logout() {
      apiLogout().finally(() => {
        clearAuth()
        this.$router.push({ name: 'login' })
      });
    },
  },
};
</script>
