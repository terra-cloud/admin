<template>
  <div class="sidebar" :class="{ collapsed: !sidebarOpen, show: mobileSidebarOpen }">
    <div class="d-flex align-items-center justify-content-between p-3">
      <a href="#" class="text-white text-decoration-none" :class="{ 'd-none': !sidebarOpen }">
        <i class="fas fa-tachometer-alt me-2"></i>
        <span class="fs-4">Admin Panel</span>
      </a>
      <!-- <button class="btn btn-link text-white" @click="$emit('toggle-sidebar')">
        <i class="fas" :class="sidebarOpen ? 'fa-chevron-left' : 'fa-chevron-right'"></i>
      </button> -->
    </div>
    <hr class="text-white" />
    <ul class="nav nav-pills flex-column mb-auto">
      <li class="nav-item">
        <router-link to="/dashboard" class="nav-link" active-class="active">
          <i class="fas fa-home me-2"></i>
          <span class="nav-text">Dashboard</span>
        </router-link>
      </li>
      <li>
        <router-link to="/job-postings" class="nav-link" active-class="active">
          <i class="fas fa-briefcase me-2"></i>
          <span class="nav-text">Job Posting</span>
        </router-link>
      </li>
      <li>
        <router-link to="/users" class="nav-link" active-class="active">
          <i class="fas fa-users me-2"></i>
          <span class="nav-text">Users</span>
        </router-link>
      </li>
      
    </ul>
  </div>
</template>

<script>
export default {
  props: ['sidebarOpen', 'mobileSidebarOpen'],
};
</script>