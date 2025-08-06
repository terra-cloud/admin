<template>
  <div>
    <!-- Main Content -->
    <div :class="{ collapsed: !sidebarOpen }">
      <div>
        <h1 class="mb-4">Users</h1>
        <div class="card">
          <div class="card-body">
            <div class="mb-3">
              <input
                type="text"
                class="form-control"
                v-model="searchQuery"
                placeholder="Search users..."
              />
            </div>
            <div class="table-responsive">
              <table class="table table-hover">
                <thead>
                  <tr>
                    <th class="text-center">Photo</th>
                    <th @click="sort('name')">Name <i class="fas" :class="sortIcon('name')"></i></th>
                    <th @click="sort('email')">Email <i class="fas" :class="sortIcon('email')"></i></th>
                    <th @click="sort('account_type')">Type <i class="fas" :class="sortIcon('account_type')"></i></th>
                    <th @click="sort('kyc_validated')">
                      Kyc Status <i class="fas" :class="sortIcon('kyc_validated')"></i>
                    </th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="user in paginatedUsers" :key="user.id">
                    <td class="text-center">
                      <img
                        v-if="user.photo_url"
                        :src="user.photo_url"
                        class="user-photo"
                      />
                      <span v-else>No Photo</span>
                    </td>
                    <td>{{ user.name }} {{ user.last_name }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.type }}</td>
                    <td>{{ displayStatus(user.kyc_validated) }}</td>
                    <td>
                      <button
                        class="btn btn-sm btn-outline-primary me-2"
                        @click="editUser(user)"
                      >
                        Edit
                      </button>
                      <button
                        class="btn btn-sm btn-outline-danger"
                        @click="deleteUser(user.id)"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
            <!-- Pagination Controls -->
            <div class="d-flex justify-content-center align-items-center mt-3">
              <div class="pagination-count mx-4">{{ tableData.from }}-{{ tableData.to }} of {{ tableData.totalItems }}</div>
              <nav class="mt-2">
                <ul class="pagination">
                  <li class="page-item" :class="{ disabled: currentPage === 1 }">
                    <button class="page-link" @click="prevPage">Previous</button>
                  </li>
                  <li
                    class="page-item"
                    v-for="page in totalPages"
                    :key="page"
                    :class="{ active: currentPage === page }"
                  >
                    <button class="page-link" @click="setPage(page)">{{ page }}</button>
                  </li>
                  <li class="page-item" :class="{ disabled: currentPage === totalPages }">
                    <button class="page-link" @click="nextPage">Next</button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase'; // Adjust path to your firebase.js file
import { collection, query, orderBy, limit, startAfter, onSnapshot, deleteDoc, doc, getCountFromServer } from 'firebase/firestore';

export default {
  data() {
    return {
      sidebarOpen: true,
      mobileSidebarOpen: false,
      darkMode: false,
      searchQuery: '',
      sortKey: 'name',
      sortOrder: 'asc',
      currentPage: 1,
      usersPerPage: 20,
      metrics: [
        { id: 1, title: 'Total Users', value: '0', description: 'Active users in the system' },
      ],
      users: [],
      totalUsers: 0,
      lastVisible: null,
      statusSet: [
        { value: 0, message: 'Pending' },
        { value: 1, message: 'Approved' },
        { value: -1, message: 'Not Approved' },
      ],
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => {
        const name = user.name ? user.name.toLowerCase() : '';
        const lastName = user.last_name ? user.last_name.toLowerCase() : '';
        const email = user.email ? user.email.toLowerCase() : '';
        const searchQuery = this.searchQuery ? this.searchQuery.toLowerCase() : '';
        return name.includes(searchQuery) || lastName.includes(searchQuery) || email.includes(searchQuery);
      });
    },
    paginatedUsers() {
      return this.filteredUsers;
    },
    totalPages() {
      return Math.ceil(this.totalUsers / this.usersPerPage);
    },
    tableData() {
      const from = this.totalUsers === 0 ? 0 : (this.currentPage - 1) * this.usersPerPage + 1;
      const to = Math.min(from + this.paginatedUsers.length - 1, this.totalUsers);
      return {
        from,
        to,
        totalItems: this.totalUsers,
      };
    },
  },
  methods: {
    async fetchUsers() {
      let usersQuery = query(
        collection(db, 'users'),
        orderBy(this.sortKey, this.sortOrder),
        limit(this.usersPerPage)
      );
      if (this.currentPage > 1 && this.lastVisible) {
        usersQuery = query(
          collection(db, 'users'),
          orderBy(this.sortKey, this.sortOrder),
          startAfter(this.lastVisible),
          limit(this.usersPerPage)
        );
      }
      onSnapshot(usersQuery, (snapshot) => {
        this.users = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          type: this.mapAccountType(doc.data().account_type),
        }));
        this.lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
        this.metrics[0].value = this.totalUsers.toString();
      }, (error) => {
        console.error('Error fetching users:', error);
        alert('Failed to load users');
      });
    },
    async fetchTotalUsers() {
      const coll = collection(db, 'users');
      const snapshot = await getCountFromServer(coll);
      this.totalUsers = snapshot.data().count;
      this.metrics[0].value = this.totalUsers.toString();
    },
    displayStatus(status) {
      const index = this.statusSet.findIndex(item => item.value === status);
      return index !== -1 ? this.statusSet[index].message : 'Unknown';
    },
    mapAccountType(accountType) {
      const types = {
        1: 'User',
        2: 'Employer',
      };
      return types[accountType] || 'Unknown';
    },
    setPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
        this.fetchUsers();
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        this.fetchUsers();
      }
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
        this.fetchUsers();
      }
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
      this.currentPage = 1;
      this.lastVisible = null;
      this.fetchUsers();
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
          await this.fetchTotalUsers();
          this.fetchUsers();
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
    this.fetchTotalUsers();
    this.fetchUsers();
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
    searchQuery() {
      this.currentPage = 1;
      this.lastVisible = null;
      this.fetchUsers();
    },
  },
};
</script>