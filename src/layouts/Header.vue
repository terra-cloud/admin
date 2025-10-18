<template>
  <!-- Header Bar -->
  <header
    class="fixed top-0 left-[280px] right-0 h-20 bg-background-light/80 dark:bg-background-dark/80 backdrop-blur-sm flex items-center px-[120px] z-10 border-b border-border-light dark:border-border-dark">
    <div class="flex items-center justify-between w-full">
      <h2 class="text-2xl font-bold">Dashboard Overview</h2>
      <div class="flex items-center gap-6">
        <div class="relative w-64">
          <span
            class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-text-secondary-light dark:text-text-secondary-dark">search</span>
          <input
            class="w-full h-10 pl-10 pr-4 rounded-lg bg-card-light dark:bg-card-dark border border-border-light dark:border-border-dark focus:ring-2 focus:ring-primary focus:outline-none transition-all duration-300"
            placeholder="Search..." type="text" />
        </div>
        <button class="relative p-2 rounded-full hover:bg-primary/10 dark:hover:bg-white/10">
          <span
            class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">notifications</span>
          <span class="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        <div class="bg-center bg-no-repeat aspect-square bg-cover rounded-full size-10"
          data-alt="User avatar with a stylized person icon on a colored background"
          style='background-image: url("https://lh3.googleusercontent.com/aida-public/AB6AXuAHjn5a7PqrBzpSYBsjCprpohoTU4kcMK8_CGlbJ3u7B6M0_aiFsRsRwWK8xJ3dtA4zReABNCk7WUSaNL_S-3Wh14yK4rwWCQpR4llECEqvvNROLwv0-ozf3kVLlaUUCskQGSJyOoLwVtRUu8wh4V6q37XSzm3hUmltWookLQOtjpn0rh9pCuuFZesXloFzxRW7aSZZ17lESyxSLV4DIbzJP2I4boy4N4VmluXfFvSJQyUujve4g8cQ3nge-G6H_KyTYTBW8paV4zjM");'>
        </div>
      </div>
    </div>
  </header>
</template>
<script>
import * as bootstrap from 'bootstrap';
import { apiLogout } from '@/apis/auth'
export default {
  props: ['mobileSidebarOpen'],
  data() {
    return {
      notifications: [
        { id: 1, message: 'New user registered' },
        { id: 2, message: 'System update available' },
      ],
    };
  },
  mounted() {
    
  },
  methods: {
    logout() {
      apiLogout().then(() => {
        localStorage.removeItem('token');
        this.$router.push('/login');
      });
    },
    toggleDropdown(event) {
      if (!this.dropdown) {
        const dropdownElement = event.currentTarget.nextElementSibling;
        this.dropdown = new bootstrap.Dropdown(dropdownElement);
      }
      this.dropdown.toggle();
    },
  },
};
</script>