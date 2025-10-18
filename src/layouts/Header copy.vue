<template>
  <nav class="navbar navbar-expand-lg navbar-light bg-light">
    <div class="container-fluid">
      <button
        class="navbar-toggler"
        type="button"
        data-bs-toggle="collapse"
        data-bs-target="#navbarNav"
        aria-controls="navbarNav"
        aria-expanded="false"
        aria-label="Toggle navigation"
        @click="$emit('toggle-mobile-sidebar')"
      >
        <span class="navbar-toggler-icon"></span>
      </button>
      <div class="collapse navbar-collapse" id="navbarNav">
        <ul class="navbar-nav ms-auto align-items-center">
          <li class="nav-item">
            <a class="nav-link" href="#">
              <i class="fas fa-bell"></i>
              <span class="badge bg-danger ms-1">{{ notifications.length }}</span>
            </a>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link dropdown-toggle"
              href="#"
              role="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              @click="toggleDropdown"
            >
              <i class="fas fa-user-circle me-2"></i> Admin
            </a>
            <ul class="dropdown-menu dropdown-menu-end">
              <li><a class="dropdown-item" href="#" @click.prevent="logout">Logout</a></li>
            </ul>
          </li>
        </ul>
      </div>
    </div>
  </nav>
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
    // Initialize dropdown on mount
    const dropdownElement = this.$el.querySelector('.dropdown-toggle');
    if (dropdownElement) {
      this.dropdown = new bootstrap.Dropdown(dropdownElement);
    }
  },
  methods: {
    logout() {
      apiLogout().then(() => this.$router.push({ name: "login" }));
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