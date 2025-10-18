<template>
<!-- Sidebar -->
  <aside
    class="fixed top-0 left-0 h-full w-[280px] bg-card-light dark:bg-card-dark flex flex-col p-6 shadow-soft z-20">
    <div class="flex items-center gap-3 mb-10">
      <div class="text-primary">
        <img src="@/assets/images/TerraLogoTrans.png" alt="Logo" class="w-full h-full object-contain" />
      </div>
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