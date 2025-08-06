<template>
<div>

  <!-- Main Content -->
  <div :class="{ collapsed: !sidebarOpen }">

    <div>
      <h1 class="mb-4">Users</h1>
      <div class="card">
        <div class="card-body">
          <div class="mb-3">
            <input type="text" class="form-control" v-model="searchQuery" placeholder="Search users...">
          </div>
          <div class="table-responsive">
            <table class="table table-hover">
              <thead>
                <tr>
                  <th class="text-center">Photo</th>
                  <th @click="sort('name')">Name <i class="fas" :class="sortIcon('name')"></i></th>
                  <th @click="sort('email')">Email <i class="fas" :class="sortIcon('email')"></i></th>
                  <th @click="sort('role')">Kyc Status <i class="fas" :class="sortIcon('kyc_validated')"></i></th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in filteredUsers" :key="user.id">
                  <td class="text-center">
                    <img
                      v-if="user.photo_url"
                      :src="user.photo_url"
                      class="user-photo"
                    />
                    <span v-else>No Photo</span>
                  </td>
                  <td>{{ user.name }} {{ user.last_name }}</td>
                  <td>{{ user.email }} </td>
                  <td>{{ displayStatus(user.kyc_validated) }}</td>
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
import { db } from '@/firebase'; // Adjust path to your firebase.js file
import { collection, onSnapshot, deleteDoc, doc } from 'firebase/firestore';

export default {
  data() {
    return {
      sidebarOpen: true,
      mobileSidebarOpen: false,
      darkMode: false,
      searchQuery: '',
      sortKey: 'id',
      sortOrder: 'asc',
      metrics: [
        { id: 1, title: 'Total Users', value: '0', description: 'Active users in the system' },
      ],
      users: [], // Initialize as empty; will be populated from Firestore
      statusSet: [
        { value: 0, message: 'Pending' },
        { value: 1, message: 'Approved' },
        { value: -1, message: 'Not Approved' },
      ],
    };
  },
  computed: {
    filteredUsers() {
      return this.users
        .filter(user => {
          // Safely convert name and email to strings, defaulting to empty string if undefined/null
          const name = user.name ? user.name.toLowerCase() : '';
          const email = user.email ? user.email.toLowerCase() : '';
          const searchQuery = this.searchQuery ? this.searchQuery.toLowerCase() : '';
          return name.includes(searchQuery) || email.includes(searchQuery);
        })
        .sort((a, b) => {
          const modifier = this.sortOrder === 'asc' ? 1 : -1;
          // Handle undefined/null in sortKey as well
          const valueA = a[this.sortKey] || '';
          const valueB = b[this.sortKey] || '';
          return valueA < valueB ? -1 * modifier : 1 * modifier;
        });
    }
  },
  methods: {
    displayStatus(status){
      let index = this.statusSet.findIndex(item => item.value == status)
      if(index != -1){
        return this.statusSet[index]['message']
      }
      return 'Unknown'
    },
    mapAccountTypeToRole(accountType) {
      const roles = {
        1: 'User',
        2: 'Admin',
        3: 'Editor',
        // Add more mappings as needed
      };
      return roles[accountType] || 'Unknown';
    },
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
    async deleteUser(id) {
      if (confirm('Are you sure you want to delete this user?')) {
        try {
          await deleteDoc(doc(db, 'users', id));
          // No need to manually update this.users; onSnapshot will handle it
        } catch (error) {
          console.error('Error deleting user:', error);
          alert('Failed to delete user');
        }
      }
    },
    logout() {
      alert('Logging out...');
    },
  },
  mounted() {
    // Fetch users from Firestore in real-time
    const usersCollection = collection(db, 'users');
    onSnapshot(usersCollection, (snapshot) => {
      this.users = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        role: this.mapAccountTypeToRole(doc.data().account_type) // Map account_type to role
      }));
      // Update Total Users metric
      this.metrics[0].value = this.users.length.toString();
    }, (error) => {
      console.error('Error fetching users:', error);
      alert('Failed to load users');
    });
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
};
</script>