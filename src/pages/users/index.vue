<template>
<div>

  <!-- Main Content -->
  <div :class="{ collapsed: !sidebarOpen }">

    <div>
      <h1 class="mb-4">User Management</h1>
      <div class="card">
        <div class="card-body">
          <div class="mb-3">
            <input type="text" class="form-control" v-model="searchQuery" placeholder="Search users...">
          </div>
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th @click="sort('id')">ID <i class="fas" :class="sortIcon('id')"></i></th>
                  <th @click="sort('name')">Name <i class="fas" :class="sortIcon('name')"></i></th>
                  <th @click="sort('email')">Email <i class="fas" :class="sortIcon('email')"></i></th>
                  <th @click="sort('role')">Role <i class="fas" :class="sortIcon('role')"></i></th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td>{{ user.id }}</td>
                  <td>{{ user.name }}</td>
                  <td>{{ user.email }}</td>
                  <td>{{ user.role }}</td>
                  <td>
                    <button class="btn btn-sm btn-outline-primary me-2" @click="editUser(user)">Edit</button>
                    <button class="btn btn-sm btn-outline-danger" @click="deleteUser(user.id)">Delete</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
    
  </div>
</div>
</template>
<script>

export default {
  data() {
    return {
      sidebarOpen: true,
      mobileSidebarOpen: false,
      darkMode: false,
      emailNotifications: true,
      searchQuery: '',
      sortKey: 'id',
      sortOrder: 'asc',
      metrics: [
        { id: 1, title: 'Total Users', value: '2,456', description: 'Active users in the system' },
        { id: 2, title: 'Revenue', value: '$24,789', description: 'Monthly revenue' },
        { id: 3, title: 'Active Sessions', value: '1,123', description: 'Current active sessions' },
      ],
      users: [
        { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin' },
        { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
        { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Editor' },
        { id: 4, name: 'Alice Brown', email: 'alice@example.com', role: 'User' },
      ],
      notifications: [
        { id: 1, message: 'New user registered' },
        { id: 2, message: 'System update available' },
      ],
      chart: null,
    };
  },
  computed: {
    filteredUsers() {
      return this.users
        .filter(user =>
          user.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
          user.email.toLowerCase().includes(this.searchQuery.toLowerCase())
        )
        .sort((a, b) => {
          const modifier = this.sortOrder === 'asc' ? 1 : -1;
          return a[this.sortKey] < b[this.sortKey] ? -1 * modifier : 1 * modifier;
        });
    },
  },
  methods: {
    setPage(page) {
      this.mobileSidebarOpen = false;
    },
    toggleSidebar() {
      this.sidebarOpen = !this.sidebarOpen;
    },
    toggleMobileSidebar() {
      this.mobileSidebarOpen = !this.mobileSidebarOpen;
    },
    toggleTheme() {
      document.body.classList.toggle('bg-dark', this.darkMode);
      document.body.classList.toggle('text-white', this.darkMode);
      document.querySelectorAll('.card').forEach(card => {
        card.classList.toggle('bg-dark', this.darkMode);
        card.classList.toggle('text-white', this.darkMode);
      });
    },
    sort(key) {
      if (this.sortKey === key) {
        this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
      } else {
        this.sortKey = key;
        this.sortOrder = 'asc';
      }
    },
    sortIcon(key) {
      if (this.sortKey === key) {
        return this.sortOrder === 'asc' ? 'fa-sort-up' : 'fa-sort-down';
      }
      return 'fa-sort';
    },
    editUser(user) {
      alert(`Editing user: ${user.name}`);
    },
    deleteUser(id) {
      if (confirm('Are you sure you want to delete this user?')) {
        this.users = this.users.filter(user => user.id !== id);
      }
    },
    logout() {
      alert('Logging out...');
    },
    initChart() {
      const ctx = document.getElementById('activityChart').getContext('2d');
      this.chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
          datasets: [{
            label: 'User Activity',
            data: [65, 59, 80, 81, 56, 55],
            borderColor: '#3b82f6',
            fill: false,
          }],
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        },
      });
    },
  },
  mounted() {
    // this.initChart();
  },
  watch: {
    mobileSidebarOpen(newVal) {
      const sidebar = document.querySelector('.sidebar');
      if (newVal) {
        sidebar.classList.add('show');
      } else {
        sidebar.classList.remove('show');
      }
    },
    darkMode() {
      this.toggleTheme();
    },
  },
}
</script>