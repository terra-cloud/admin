<template>
<!-- Sidebar -->
  <aside
    class="fixed top-0 left-0 h-full w-[280px] bg-card-light dark:bg-card-dark flex flex-col p-6 shadow-soft z-20">
    <div class="flex items-center gap-3 mb-10">
      <div class="size-8 text-primary">
        <svg fill="none" viewbox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
          <path
            d="M44 11.2727C44 14.0109 39.8386 16.3957 33.69 17.6364C39.8386 18.877 44 21.2618 44 24C44 26.7382 39.8386 29.123 33.69 30.3636C39.8386 31.6043 44 33.9891 44 36.7273C44 40.7439 35.0457 44 24 44C12.9543 44 4 40.7439 4 36.7273C4 33.9891 8.16144 31.6043 14.31 30.3636C8.16144 29.123 4 26.7382 4 24C4 21.2618 8.16144 18.877 14.31 17.6364C8.16144 16.3957 4 14.0109 4 11.2727C4 7.25611 12.9543 4 24 4C35.0457 4 44 7.25611 44 11.2727Z"
            fill="currentColor"></path>
        </svg>
      </div>
      <h1 class="text-xl font-bold">Terra PH</h1>
    </div>
    <nav class="flex flex-col gap-2 flex-grow">
      <router-link
        v-for="item in menu"
        :key="item.name"
        :to="{ name: item.route }"
        class="flex items-center gap-4 px-4 py-3 rounded-lg text-primary dark:text-white dark:bg-primary transition"
        :class="{
          'bg-primary/20 text-primary dark:text-white': $route.name === item.route
        }"
      >
        <span class="material-symbols-outlined">{{ item.icon }}</span>
        <span class="text-base font-semibold">{{ item.label }}</span>
      </router-link>
    </nav>
    <button @click="logout" class="flex items-center gap-4 px-4 py-3 rounded-lg hover:bg-primary/10 dark:hover:bg-white/10 text-text-secondary-light dark:text-text-secondary-dark"
      >
      <span class="material-symbols-outlined">logout</span>
      <span class="text-base font-medium">Logout</span>
    </button>
  </aside>
</template>

<script>
import { apiLogout } from '@/apis/auth'

export default {
  props: ['sidebarOpen', 'mobileSidebarOpen'],
  data() {
    return {
      menu: [
        { name: "dashboard", route: "dashboard", icon: "dashboard", label: "Dashboard" },
        // { name: "Bookings", route: "bookings", icon: "event", label: "Bookings" },
        { name: "jobPostings", route: "jobPostings", icon: "work", label: "Job Posting" },
        // { name: "Rentals", route: "rentals", icon: "apartment", label: "Rentals" },
        // { name: "Users", route: "users", icon: "group", label: "Users" },
        // { name: "news", route: "news", icon: "group", label: "News" },
        // { name: "Settings", route: "settings", icon: "settings", label: "Settings" },
      ],
    };
  },
  methods: {
    logout() {
      apiLogout().then(() => {
        this.$router.replace({ name: 'login' });
      });
    }
  }
};
</script>