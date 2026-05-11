<template>
<div>

  <!-- Main Content -->
  <div :class="{ collapsed: !sidebarOpen }">
    <div class="p-6">
      <h1 class="text-2xl font-bold mb-6">Dashboard</h1>

      <!-- Metric Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div v-for="metric in metrics" :key="metric.id" class="bg-white rounded-xl shadow-soft p-6">
          <h5 class="text-sm font-medium text-gray-500">{{ metric.title }}</h5>
          <h2 class="text-3xl font-bold mt-2">{{ metric.value }}</h2>
          <p class="text-sm text-gray-400 mt-1">{{ metric.description }}</p>
        </div>
      </div>

      <!-- User Activity -->
      <div class="bg-white rounded-xl shadow-soft p-6 mb-8">
        <h5 class="text-lg font-semibold mb-4">User Activity</h5>
      </div>

      <!-- Users Table -->
      <div class="bg-white rounded-xl shadow-soft p-6 mb-8">
        <div class="flex items-center justify-between mb-4">
          <h5 class="text-lg font-semibold">Users</h5>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search users..."
            class="w-64 px-4 py-3 rounded-lg bg-gray-100 border-none text-sm"
          />
        </div>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-gray-200">
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer" @click="sort('id')">
                  ID <i :class="['fas', sortIcon('id')]"></i>
                </th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer" @click="sort('name')">
                  Name <i :class="['fas', sortIcon('name')]"></i>
                </th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer" @click="sort('email')">
                  Email <i :class="['fas', sortIcon('email')]"></i>
                </th>
                <th class="text-left py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer" @click="sort('role')">
                  Role <i :class="['fas', sortIcon('role')]"></i>
                </th>
                <th class="text-right py-3 px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in filteredUsers" :key="user.id" class="border-b border-gray-100 hover:bg-gray-50 transition">
                <td class="py-3 px-4 text-sm">{{ user.id }}</td>
                <td class="py-3 px-4 text-sm font-medium">{{ user.name }}</td>
                <td class="py-3 px-4 text-sm text-gray-600">{{ user.email }}</td>
                <td class="py-3 px-4 text-sm">
                  <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium" :class="{
                    'bg-blue-100 text-blue-800': user.role === 'Admin',
                    'bg-green-100 text-green-800': user.role === 'User',
                    'bg-purple-100 text-purple-800': user.role === 'Editor'
                  }">{{ user.role }}</span>
                </td>
                <td class="py-3 px-4 text-right">
                  <button @click="editUser(user)" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-blue-600 hover:bg-blue-50 transition">
                    <i class="fas fa-edit"></i> Edit
                  </button>
                  <button @click="deleteUser(user.id)" class="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:text-red-600 hover:bg-red-50 transition">
                    <i class="fas fa-trash"></i> Delete
                  </button>
                </td>
              </tr>
              <tr v-if="filteredUsers.length === 0">
                <td colspan="5" class="py-6 text-center text-sm text-gray-400">No users found</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Notifications -->
      <div class="bg-white rounded-xl shadow-soft p-6">
        <div class="flex items-center justify-between mb-4">
          <h5 class="text-lg font-semibold">Notifications</h5>
          <label class="inline-flex items-center gap-2 text-sm text-gray-600">
            <input type="checkbox" v-model="emailNotifications" class="rounded border-gray-300" />
            Email notifications
          </label>
        </div>
        <ul class="space-y-3">
          <li v-for="notif in notifications" :key="notif.id" class="flex items-center gap-3 text-sm text-gray-700">
            <i class="fas fa-bell text-gray-400"></i>
            {{ notif.message }}
          </li>
        </ul>
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
      document.documentElement.classList.toggle('dark', this.darkMode);
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
