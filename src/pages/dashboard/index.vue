<template>
  <div>
    <div class="grid grid-cols-12 gap-6">
      <!-- Metric Cards -->
      <div class="col-span-12">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div
            class="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft flex flex-col justify-between h-[140px]">
            <div class="flex justify-between items-start">
              <p class="text-base font-medium text-text-secondary-light dark:text-text-secondary-dark">Total Users
              </p>
              <span
                class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">people</span>
            </div>
            <div>
              <p class="text-3xl font-bold">1,450</p>
              <div class="flex items-center text-sm text-green-500">
                <span class="material-symbols-outlined text-base">arrow_upward</span>
                <span>+1.5%</span>
              </div>
            </div>
          </div>
          <div
            class="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft flex flex-col justify-between h-[140px]">
            <div class="flex justify-between items-start">
              <p class="text-base font-medium text-text-secondary-light dark:text-text-secondary-dark">Active
                Subscriptions</p>
              <span
                class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">subscriptions</span>
            </div>
            <div>
              <p class="text-3xl font-bold">1,200</p>
              <div class="flex items-center text-sm text-green-500">
                <span class="material-symbols-outlined text-base">arrow_upward</span>
                <span>+2.1%</span>
              </div>
            </div>
          </div>
          <div
            class="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft flex flex-col justify-between h-[140px]">
            <div class="flex justify-between items-start">
              <p class="text-base font-medium text-text-secondary-light dark:text-text-secondary-dark">Monthly
                Revenue</p>
              <span
                class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">paid</span>
            </div>
            <div>
              <p class="text-3xl font-bold">$25,000</p>
              <div class="flex items-center text-sm text-red-500">
                <span class="material-symbols-outlined text-base">arrow_downward</span>
                <span>-0.5%</span>
              </div>
            </div>
          </div>
          <div
            class="bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft flex flex-col justify-between h-[140px]">
            <div class="flex justify-between items-start">
              <p class="text-base font-medium text-text-secondary-light dark:text-text-secondary-dark">New Sign-ups
              </p>
              <span
                class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">person_add</span>
            </div>
            <div>
              <p class="text-3xl font-bold">50</p>
              <div class="flex items-center text-sm text-green-500">
                <span class="material-symbols-outlined text-base">arrow_upward</span>
                <span>+10%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
      <!-- Charts -->
      <div class="col-span-6 bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft">
        <p class="text-lg font-semibold">User Growth Over Time</p>
        <div class="mt-4 h-[300px]">
          <svg class="w-full h-full" fill="none" preserveaspectratio="none" viewbox="0 0 478 150"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25V149H0V109Z"
              fill="url(#paint0_linear_chart)"></path>
            <path
              d="M0 109C18.1538 109 18.1538 21 36.3077 21C54.4615 21 54.4615 41 72.6154 41C90.7692 41 90.7692 93 108.923 93C127.077 93 127.077 33 145.231 33C163.385 33 163.385 101 181.538 101C199.692 101 199.692 61 217.846 61C236 61 236 45 254.154 45C272.308 45 272.308 121 290.462 121C308.615 121 308.615 149 326.769 149C344.923 149 344.923 1 363.077 1C381.231 1 381.231 81 399.385 81C417.538 81 417.538 129 435.692 129C453.846 129 453.846 25 472 25"
              stroke="#6B7A8F" stroke-linecap="round" stroke-width="3"></path>
            <defs>
              <lineargradient gradientunits="userSpaceOnUse" id="paint0_linear_chart" x1="236" x2="236" y1="1" y2="149">
                <stop stop-color="#6B7A8F" stop-opacity="0.2"></stop>
                <stop offset="1" stop-color="#6B7A8F" stop-opacity="0"></stop>
              </lineargradient>
            </defs>
          </svg>
        </div>
      </div>
      <div class="col-span-6 bg-card-light dark:bg-card-dark p-6 rounded-xl shadow-soft">
        <p class="text-lg font-semibold">Subscription Tiers</p>
        <div class="mt-4 h-[300px] flex items-center justify-center">
          <div class="relative w-48 h-48">
            <svg class="w-full h-full" viewbox="0 0 36 36">
              <path class="stroke-current text-primary/20 dark:text-white/20"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
                stroke-width="3"></path>
              <path class="stroke-current text-primary"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
                stroke-dasharray="70, 100" stroke-linecap="round" stroke-width="3"></path>
              <path class="stroke-current text-teal-400"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none"
                stroke-dasharray="20, 100" stroke-dashoffset="-70" stroke-linecap="round" stroke-width="3"></path>
            </svg>
            <div class="absolute inset-0 flex flex-col items-center justify-center">
              <span class="text-2xl font-bold">1,200</span>
              <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Total</span>
            </div>
          </div>
          <div class="ml-8 space-y-4">
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-primary"></div>
              <span class="ml-2">Pro (70%)</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-teal-400"></div>
              <span class="ml-2">Basic (20%)</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 rounded-full bg-primary/20 dark:bg-white/20"></div>
              <span class="ml-2">Enterprise (10%)</span>
            </div>
          </div>
        </div>
      </div>
      <!-- Data Table -->
      <div class="col-span-12 bg-card-light dark:bg-card-dark rounded-xl shadow-soft overflow-hidden">
        <div class="p-6">
          <h3 class="text-lg font-semibold">Latest Sign-ups</h3>
        </div>
        <div class="overflow-x-auto">
          <table class="w-full text-left">
            <thead>
              <tr
                class="bg-background-light dark:bg-background-dark border-y border-border-light dark:border-border-dark">
                <th class="px-6 py-4 font-semibold">User Name</th>
                <th class="px-6 py-4 font-semibold">Email</th>
                <th class="px-6 py-4 font-semibold">Plan Type</th>
                <th class="px-6 py-4 font-semibold">Join Date</th>
                <th class="px-6 py-4 font-semibold">Status</th>
                <th class="px-6 py-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr
                class="border-b border-border-light dark:border-border-dark hover:bg-primary/5 dark:hover:bg-white/5 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">John Doe</td>
                <td class="px-6 py-4 whitespace-nowrap text-text-secondary-light dark:text-text-secondary-dark">
                  john.doe@example.com</td>
                <td class="px-6 py-4 whitespace-nowrap"><span
                    class="px-3 py-1 text-sm font-medium rounded-full bg-primary/20 text-primary dark:text-white dark:bg-primary/50">Pro</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-text-secondary-light dark:text-text-secondary-dark">
                  2023-10-27</td>
                <td class="px-6 py-4 whitespace-nowrap"><span
                    class="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Active</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap space-x-2">
                  <button class="p-2 rounded-lg hover:bg-primary/10"><span
                      class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">edit</span></button>
                  <button class="p-2 rounded-lg hover:bg-red-500/10"><span
                      class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500">delete</span></button>
                </td>
              </tr>
              <tr
                class="border-b border-border-light dark:border-border-dark hover:bg-primary/5 dark:hover:bg-white/5 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">Jane Smith</td>
                <td class="px-6 py-4 whitespace-nowrap text-text-secondary-light dark:text-text-secondary-dark">
                  jane.smith@example.com</td>
                <td class="px-6 py-4 whitespace-nowrap"><span
                    class="px-3 py-1 text-sm font-medium rounded-full bg-teal-100 text-teal-800 dark:bg-teal-900/50 dark:text-teal-300">Basic</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-text-secondary-light dark:text-text-secondary-dark">
                  2023-10-26</td>
                <td class="px-6 py-4 whitespace-nowrap"><span
                    class="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Active</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap space-x-2">
                  <button class="p-2 rounded-lg hover:bg-primary/10"><span
                      class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">edit</span></button>
                  <button class="p-2 rounded-lg hover:bg-red-500/10"><span
                      class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500">delete</span></button>
                </td>
              </tr>
              <tr
                class="border-b border-border-light dark:border-border-dark hover:bg-primary/5 dark:hover:bg-white/5 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">Sam Wilson</td>
                <td class="px-6 py-4 whitespace-nowrap text-text-secondary-light dark:text-text-secondary-dark">
                  sam.wilson@example.com</td>
                <td class="px-6 py-4 whitespace-nowrap"><span
                    class="px-3 py-1 text-sm font-medium rounded-full bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300">Enterprise</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-text-secondary-light dark:text-text-secondary-dark">
                  2023-10-25</td>
                <td class="px-6 py-4 whitespace-nowrap"><span
                    class="px-3 py-1 text-sm font-medium rounded-full bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-gray-300">Inactive</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap space-x-2">
                  <button class="p-2 rounded-lg hover:bg-primary/10"><span
                      class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">edit</span></button>
                  <button class="p-2 rounded-lg hover:bg-red-500/10"><span
                      class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500">delete</span></button>
                </td>
              </tr>
              <tr class="hover:bg-primary/5 dark:hover:bg-white/5 transition-colors">
                <td class="px-6 py-4 whitespace-nowrap">Alice Johnson</td>
                <td class="px-6 py-4 whitespace-nowrap text-text-secondary-light dark:text-text-secondary-dark">
                  alice.johnson@example.com</td>
                <td class="px-6 py-4 whitespace-nowrap"><span
                    class="px-3 py-1 text-sm font-medium rounded-full bg-primary/20 text-primary dark:text-white dark:bg-primary/50">Pro</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-text-secondary-light dark:text-text-secondary-dark">
                  2023-10-24</td>
                <td class="px-6 py-4 whitespace-nowrap"><span
                    class="px-3 py-1 text-sm font-medium rounded-full bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300">Active</span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap space-x-2">
                  <button class="p-2 rounded-lg hover:bg-primary/10"><span
                      class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark">edit</span></button>
                  <button class="p-2 rounded-lg hover:bg-red-500/10"><span
                      class="material-symbols-outlined text-text-secondary-light dark:text-text-secondary-dark hover:text-red-500">delete</span></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="flex items-center justify-between p-6 border-t border-border-light dark:border-border-dark">
          <span class="text-sm text-text-secondary-light dark:text-text-secondary-dark">Showing 1 to 4 of 50
            entries</span>
          <div class="flex items-center gap-2">
            <button
              class="px-3 py-1 border rounded-lg border-border-light dark:border-border-dark hover:bg-primary/10">Previous</button>
            <button
              class="px-3 py-1 border rounded-lg border-border-light dark:border-border-dark hover:bg-primary/10">Next</button>
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