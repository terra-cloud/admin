<template>
  <!-- <div class="" style="background: #f6f6f6;"> -->
    <LeftSidebar :sidebarOpen="sidebarOpen" @toggle-sidebar="toggleSidebar" />

    <div class="content">
      <Content />
    </div>
    <Header />

  <!-- </div> -->
</template>
<script>
  export default {
    data() {
      return {
        sidebarOpen: true,
        mobileSidebarOpen: false,
      };
    },
    methods: {
      toggleSidebar() {
        this.sidebarOpen = !this.sidebarOpen;
        this.mobileSidebarOpen = false; // Close mobile sidebar when toggling desktop sidebar
      },
      toggleMobileSidebar() {
        this.mobileSidebarOpen = !this.mobileSidebarOpen;
        if (this.mobileSidebarOpen) {
          this.sidebarOpen = true; // Ensure sidebar is expanded when opened on mobile
        }
      },
    },
    watch: {
      mobileSidebarOpen(newVal) {
        const sidebar = document.querySelector('.sidebar');
        if (sidebar) {
          sidebar.classList.toggle('show', newVal);
        }
      },
      sidebarOpen() {
        // Force layout recalculation to ensure smooth transitions
        this.$nextTick(() => {
          window.dispatchEvent(new Event('resize'));
        });
      },
    },
    computed: {
      cols () {
        const { lg, sm } = this.$vuetify.display
        return lg ? [3, 9]
          : sm ? [9, 3]
            : [6, 6]
      },

    },
  }
</script>