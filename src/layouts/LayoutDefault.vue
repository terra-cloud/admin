<template>
  <div class="min-h-screen bg-background-light font-display">
    <LeftSidebar
      :sidebarOpen="sidebarOpen"
      :mobileSidebarOpen="mobileSidebarOpen"
      @toggle-sidebar="toggleSidebar"
    />
    <Header
      :mobileSidebarOpen="mobileSidebarOpen"
      @toggle-mobile-sidebar="toggleMobileSidebar"
    />
    <div
      class="pt-16 transition-all duration-300 min-h-screen"
      :class="sidebarOpen ? 'lg:ml-64' : 'lg:ml-[70px]'"
    >
      <main class="p-6">
        <Content />
      </main>
    </div>
  </div>
</template>

<script>
import LeftSidebar from './LeftSidebar.vue';
import Header from './Header.vue';
import Content from './Content.vue';

export default {
  components: { LeftSidebar, Header, Content },
  data() {
    return {
      sidebarOpen: true,
      mobileSidebarOpen: false,
    };
  },
  methods: {
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
      this.mobileSidebarOpen = false;
    },
    toggleMobileSidebar() {
      this.mobileSidebarOpen = !this.mobileSidebarOpen;
      if (this.mobileSidebarOpen) {
        this.sidebarOpen = true;
      }
    },
  },
};
</script>
