<template>
  <div>
    <div class="p-6">
      <h1 class="text-2xl font-bold text-text-primary mb-6">Users</h1>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
        <div
          v-for="metric in metrics"
          :key="metric.id"
          class="bg-white rounded-xl shadow-soft p-6 text-center"
        >
          <h5 class="text-sm font-medium text-text-light mb-1">{{ metric.title }}</h5>
          <p class="text-3xl font-bold text-text-primary mb-1">{{ metric.value }}</p>
          <p class="text-xs text-text-muted-light">{{ metric.description }}</p>
        </div>
      </div>

      <div class="bg-white rounded-xl shadow-soft p-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label for="searchQuery" class="block text-sm font-medium text-text-light mb-1">Search Users</label>
            <input
              id="searchQuery"
              type="text"
              class="w-full px-4 py-2.5 rounded-lg bg-input-light border-none text-text-light focus:ring-2 focus:ring-primary/50"
              v-model="searchQuery"
              placeholder="Search by name or email..."
            />
          </div>
          <div>
            <label for="filterType" class="block text-sm font-medium text-text-light mb-1">Filter by Type</label>
            <select
              id="filterType"
              class="w-full px-4 py-2.5 rounded-lg bg-input-light border-none h-[100px]"
              multiple
              v-model="filterTypes"
            >
              <option value="All">All</option>
              <option value="User">User</option>
              <option value="Employer">Employer</option>
            </select>
          </div>
          <div>
            <label for="filterKycStatus" class="block text-sm font-medium text-text-light mb-1">Filter by KYC Status</label>
            <select
              id="filterKycStatus"
              class="w-full px-4 py-2.5 rounded-lg bg-input-light border-none h-[100px]"
              multiple
              v-model="filterKycStatuses"
            >
              <option value="All">All</option>
              <option value="Pending">Pending</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Photo</th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider cursor-pointer"
                  @click="sort('name')"
                >
                  Name <i class="fas" :class="sortIcon('name')"></i>
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider cursor-pointer"
                  @click="sort('email')"
                >
                  Email <i class="fas" :class="sortIcon('email')"></i>
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider cursor-pointer"
                  @click="sort('account_type')"
                >
                  Type <i class="fas" :class="sortIcon('account_type')"></i>
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider cursor-pointer"
                  @click="sort('kyc_validated')"
                >
                  Kyc Status <i class="fas" :class="sortIcon('kyc_validated')"></i>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="user in paginatedUsers" :key="user.id" class="border-b border-gray-100">
                <td class="px-4 py-3 text-sm">
                  <img
                    v-if="user.photo_url"
                    :src="user.photo_url"
                    class="w-8 h-8 rounded-full object-cover"
                    alt="User Photo"
                  />
                  <span v-else class="text-text-muted-light text-xs">No Photo</span>
                </td>
                <td class="px-4 py-3 text-sm text-text-primary">{{ user.name }} {{ user.last_name }}</td>
                <td class="px-4 py-3 text-sm text-text-primary">{{ user.email }}</td>
                <td class="px-4 py-3 text-sm text-text-primary">{{ user.type }}</td>
                <td class="px-4 py-3 text-sm text-text-primary">{{ displayStatus(user.kyc_validated) }}</td>
                <td class="px-4 py-3 text-sm">
                  <button
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-primary hover:bg-primary/5"
                    @click="openEditModal(user)"
                  >
                    Edit
                  </button>
                  <button
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-amber-600 hover:bg-amber-50"
                    @click="openKycModal(user)"
                  >
                    KYC
                  </button>
                  <button
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-red-600 hover:bg-red-50"
                    @click="openDeleteModal(user.id)"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <Pagination
          :currentPage="currentPage"
          :totalPages="totalPages"
          :tableData="tableData"
          @setPage="setPage"
          @prevPage="prevPage"
          @nextPage="nextPage"
          @firstPage="setPage(1)"
          @lastPage="setPage(totalPages)"
        />
      </div>
    </div>

    <UserModal
      v-if="showEditModal"
      :user="selectedUser"
      :key="selectedUser?.id"
      @save="saveUser"
      @close="closeEditModal"
    />
    <KycStatusModal
      v-if="showKycModal"
      :user="selectedKycUser"
      :key="'kyc-' + selectedKycUser?.id"
      @save="saveKycStatus"
      @close="closeKycModal"
    />
    <ConfirmDialog
      v-if="showDeleteModal"
      :currentId="selectedDeleteUserId"
      :key="'delete-' + selectedDeleteUserId"
      @confirm="deleteUser"
      @close="closeDeleteModal"
    />
  </div>
</template>

<script>
import { db } from '@/firebase';
import { collection, query, orderBy, limit, startAfter, onSnapshot, deleteDoc, doc, setDoc, getCountFromServer } from 'firebase/firestore';
import UserModal from '@/pages/users/components/UserModal.vue';
import KycStatusModal from '@/pages/users/components/KycStatusModal.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Pagination from '@/components/Pagination.vue';

export default {
  components: {
    UserModal,
    KycStatusModal,
    ConfirmDialog,
    Pagination,
  },
  data() {
    return {
      sidebarOpen: true,
      mobileSidebarOpen: false,
      darkMode: false,
      searchQuery: '',
      filterTypes: [],
      filterKycStatuses: [],
      sortKey: 'name',
      sortOrder: 'asc',
      currentPage: 1,
      usersPerPage: 20,
      metrics: [
        { id: 1, title: 'Total Users', value: '0', description: 'Active users in the system' },
        { id: 2, title: 'Pending KYC', value: '0', description: 'Users with pending KYC status' },
        { id: 3, title: 'Approved KYC', value: '0', description: 'Users with approved KYC status' },
        { id: 4, title: 'Rejected KYC', value: '0', description: 'Users with rejected KYC status' },
        { id: 5, title: 'Employers', value: '0', description: 'Users with Employer account type' },
        { id: 6, title: 'Users', value: '0', description: 'Users with User account type' },
      ],
      users: [],
      totalUsers: 0,
      lastVisible: null,
      statusSet: [
        { value: 0, message: 'Pending' },
        { value: 1, message: 'Approved' },
        { value: -1, message: 'Rejected' },
      ],
      showEditModal: false,
      selectedUser: null,
      showKycModal: false,
      selectedKycUser: null,
      showDeleteModal: false,
      selectedDeleteUserId: null,
    };
  },
  computed: {
    filteredUsers() {
      return this.users.filter(user => {
        const name = user.name ? user.name.toLowerCase() : '';
        const lastName = user.last_name ? user.last_name.toLowerCase() : '';
        const email = user.email ? user.email.toLowerCase() : '';
        const gender = user.gender ? user.gender.toLowerCase() : '';
        const birthdate = user.birthdate ? user.birthdate.toLowerCase() : '';
        const userType = this.mapAccountType(user.account_type).toLowerCase();
        const kycStatus = this.displayStatus(user.kyc_validated).toLowerCase();
        const kycRejectionReason = user.kyc_rejection_reason ? user.kyc_rejection_reason.toLowerCase() : '';
        const searchQuery = this.searchQuery ? this.searchQuery.toLowerCase() : '';
        const matchesText = searchQuery === '' ||
          name.includes(searchQuery) ||
          lastName.includes(searchQuery) ||
          email.includes(searchQuery) ||
          gender.includes(searchQuery) ||
          birthdate.includes(searchQuery) ||
          userType.includes(searchQuery) ||
          kycStatus.includes(searchQuery) ||
          kycRejectionReason.includes(searchQuery);
        const effectiveTypes = this.filterTypes.includes('All') ? ['User', 'Employer'] : this.filterTypes;
        const effectiveKycStatuses = this.filterKycStatuses.includes('All') ? ['Pending', 'Approved', 'Rejected'] : this.filterKycStatuses;
        const matchesType = effectiveTypes.length === 0 || effectiveTypes.includes(this.mapAccountType(user.account_type));
        const matchesKycStatus = effectiveKycStatuses.length === 0 || effectiveKycStatuses.includes(this.displayStatus(user.kyc_validated));
        return matchesText && matchesType && matchesKycStatus;
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
    userMetrics() {
      return {
        totalUsers: this.totalUsers,
        pendingKyc: this.users.filter(user => user.kyc_validated === 0).length,
        approvedKyc: this.users.filter(user => user.kyc_validated === 1).length,
        rejectedKyc: this.users.filter(user => user.kyc_validated === -1).length,
        employerCount: this.users.filter(user => this.mapAccountType(user.account_type) === 'Employer').length,
        userCount: this.users.filter(user => this.mapAccountType(user.account_type) === 'User').length,
      };
    },
  },
  methods: {
    updateMetrics() {
      this.metrics[0].value = this.userMetrics.totalUsers.toString();
      this.metrics[1].value = this.userMetrics.pendingKyc.toString();
      this.metrics[2].value = this.userMetrics.approvedKyc.toString();
      this.metrics[3].value = this.userMetrics.rejectedKyc.toString();
      this.metrics[4].value = this.userMetrics.employerCount.toString();
      this.metrics[5].value = this.userMetrics.userCount.toString();
    },
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
          birthdate: doc.data().birthdate ? new Date(doc.data().birthdate).toISOString().split('T')[0] : '',
          gender: doc.data().gender || '',
          kyc_rejection_reason: doc.data().kyc_rejection_reason || '',
        }));
        this.lastVisible = snapshot.docs[snapshot.docs.length - 1] || null;
        this.updateMetrics();
      }, (error) => {
        console.error('Error fetching users:', error);
        alert('Failed to load users');
      });
    },
    async fetchTotalUsers() {
      const coll = collection(db, 'users');
      const snapshot = await getCountFromServer(coll);
      this.totalUsers = snapshot.data().count;
      this.updateMetrics();
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
    formatDate(date) {
      if (!date) return 'N/A';
      const d = new Date(date);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
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
      document.documentElement.classList.toggle('dark', this.darkMode);
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
    openEditModal(user) {
      this.selectedUser = { ...user };
      this.showEditModal = true;
    },
    async saveUser(updatedUser) {
      try {
        await setDoc(doc(db, 'users', updatedUser.id), {
          name: updatedUser.name,
          last_name: updatedUser.last_name,
          email: updatedUser.email,
          birthdate: updatedUser.birthdate,
          gender: updatedUser.gender,
          account_type: parseInt(updatedUser.account_type),
          kyc_validated: parseInt(updatedUser.kyc_validated),
          kyc_rejection_reason: updatedUser.kyc_rejection_reason || '',
          photo_url: updatedUser.photo_url || '',
        }, { merge: true });
        this.closeEditModal();
        this.fetchUsers();
      } catch (error) {
        console.error('Error updating user:', error);
        alert('Failed to update user');
      }
    },
    closeEditModal() {
      this.showEditModal = false;
      this.selectedUser = null;
    },
    openKycModal(user) {
      this.selectedKycUser = { ...user };
      this.showKycModal = true;
    },
    async saveKycStatus({ id, kyc_validated, kyc_rejection_reason }) {
      try {
        await setDoc(doc(db, 'users', id), {
          kyc_validated: parseInt(kyc_validated),
          kyc_rejection_reason: kyc_validated === -1 ? kyc_rejection_reason || '' : '',
        }, { merge: true });
        this.closeKycModal();
        this.fetchUsers();
      } catch (error) {
        console.error('Error updating KYC status:', error);
        alert('Failed to update KYC status');
      }
    },
    closeKycModal() {
      this.showKycModal = false;
      this.selectedKycUser = null;
    },
    openDeleteModal(userId) {
      this.selectedDeleteUserId = userId;
      this.showDeleteModal = true;
    },
    async deleteUser(userId) {
      try {
        await deleteDoc(doc(db, 'users', userId));
        await this.fetchTotalUsers();
        this.fetchUsers();
        this.closeDeleteModal();
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Failed to delete user');
      }
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.selectedDeleteUserId = null;
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
    filterTypes() {
      this.currentPage = 1;
      this.lastVisible = null;
      this.fetchUsers();
    },
    filterKycStatuses() {
      this.currentPage = 1;
      this.lastVisible = null;
      this.fetchUsers();
    },
  },
};
</script>