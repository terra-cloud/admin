<template>
  <div>
    <div class="p-6">
      <h1 class="text-2xl font-bold text-text-primary mb-6">Admins</h1>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
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
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div>
            <label for="searchQuery" class="block text-sm font-medium text-text-light mb-1">Search Admins</label>
            <input
              id="searchQuery"
              type="text"
              class="w-full px-4 py-2.5 rounded-lg bg-input-light border-none text-text-light focus:ring-2 focus:ring-primary/50"
              v-model="searchQuery"
              placeholder="Search by name or email..."
            />
          </div>
          <div>
            <label for="filterStatus" class="block text-sm font-medium text-text-light mb-1">Filter by Status</label>
            <select
              id="filterStatus"
              class="w-full px-4 py-2.5 rounded-lg bg-input-light border-none h-[100px]"
              multiple
              v-model="filterStatuses"
            >
              <option value="All">All</option>
              <option value="pending">Pending</option>
              <option value="active">Active</option>
              <option value="suspended">Suspended</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b border-gray-100">
                <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Name</th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider cursor-pointer"
                  @click="sort('email')"
                >
                  Email <i class="fas" :class="sortIcon('email')"></i>
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider cursor-pointer"
                  @click="sort('type')"
                >
                  Type <i class="fas" :class="sortIcon('type')"></i>
                </th>
                <th
                  class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider cursor-pointer"
                  @click="sort('status')"
                >
                  Status <i class="fas" :class="sortIcon('status')"></i>
                </th>
                <th class="px-4 py-3 text-left text-xs font-medium text-text-muted-light uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="admin in paginatedAdmins" :key="admin.id" class="border-b border-gray-100">
                <td class="px-4 py-3 text-sm text-text-primary">
                  {{ admin.firstname }} {{ admin.middlename ? admin.middlename + ' ' : '' }}{{ admin.lastname }}
                </td>
                <td class="px-4 py-3 text-sm text-text-primary">{{ admin.email }}</td>
                <td class="px-4 py-3 text-sm">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="admin.type === 'partner' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'"
                  >
                    {{ capitalize(admin.type) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm">
                  <span
                    class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                    :class="statusBadgeClass(admin.status)"
                  >
                    {{ capitalize(admin.status) }}
                  </span>
                </td>
                <td class="px-4 py-3 text-sm">
                  <button
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-primary hover:bg-primary/5"
                    @click="openEditModal(admin)"
                  >
                    Edit
                  </button>
                  <button
                    class="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium transition-colors text-red-600 hover:bg-red-50"
                    @click="openDeleteModal(admin.id)"
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

    <AdminModal
      v-if="showEditModal"
      :admin="selectedAdmin"
      :key="selectedAdmin?.id"
      @save="saveAdmin"
      @close="closeEditModal"
    />
    <ConfirmDialog
      :show="showDeleteModal"
      :currentId="selectedDeleteAdminId"
      :key="'delete-' + selectedDeleteAdminId"
      :message="'Are you sure you want to delete this admin? This will also revoke all their sessions.'"
      @confirm="deleteAdmin"
      @close="closeDeleteModal"
    />
  </div>
</template>

<script>
import { apiListAdmins, apiUpdateAdmin, apiDeleteAdmin } from '@/apis/admin';
import AdminModal from '@/pages/admins/components/AdminModal.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import Pagination from '@/components/Pagination.vue';

export default {
  components: {
    AdminModal,
    ConfirmDialog,
    Pagination,
  },
  data() {
    return {
      searchQuery: '',
      filterStatuses: [],
      sortKey: 'email',
      sortOrder: 'asc',
      currentPage: 1,
      adminsPerPage: 20,
      metrics: [
        { id: 1, title: 'Total Admins', value: '0', description: 'All admin accounts' },
        { id: 2, title: 'Active', value: '0', description: 'Admins with active status' },
        { id: 3, title: 'Pending', value: '0', description: 'Admins awaiting activation' },
        { id: 4, title: 'Suspended', value: '0', description: 'Suspended admin accounts' },
        { id: 5, title: 'Partners', value: '0', description: 'Partner-type admins' },
      ],
      admins: [],
      showEditModal: false,
      selectedAdmin: null,
      showDeleteModal: false,
      selectedDeleteAdminId: null,
    };
  },
  computed: {
    filteredAdmins() {
      return this.admins.filter(admin => {
        const firstname = (admin.firstname || '').toLowerCase();
        const middlename = (admin.middlename || '').toLowerCase();
        const lastname = (admin.lastname || '').toLowerCase();
        const email = (admin.email || '').toLowerCase();
        const query = this.searchQuery.toLowerCase();

        const matchesText = query === '' ||
          firstname.includes(query) ||
          middlename.includes(query) ||
          lastname.includes(query) ||
          email.includes(query);

        const effectiveStatuses = this.filterStatuses.includes('All')
          ? ['pending', 'active', 'suspended', 'cancelled']
          : this.filterStatuses;

        const matchesStatus = effectiveStatuses.length === 0 ||
          effectiveStatuses.includes(admin.status);

        return matchesText && matchesStatus;
      });
    },
    sortedAdmins() {
      const sorted = [...this.filteredAdmins];
      sorted.sort((a, b) => {
        const aVal = (a[this.sortKey] || '').toLowerCase();
        const bVal = (b[this.sortKey] || '').toLowerCase();
        if (aVal < bVal) return this.sortOrder === 'asc' ? -1 : 1;
        if (aVal > bVal) return this.sortOrder === 'asc' ? 1 : -1;
        return 0;
      });
      return sorted;
    },
    paginatedAdmins() {
      const start = (this.currentPage - 1) * this.adminsPerPage;
      return this.sortedAdmins.slice(start, start + this.adminsPerPage);
    },
    totalPages() {
      return Math.ceil(this.filteredAdmins.length / this.adminsPerPage);
    },
    tableData() {
      const from = this.filteredAdmins.length === 0 ? 0 : (this.currentPage - 1) * this.adminsPerPage + 1;
      const to = Math.min(from + this.paginatedAdmins.length - 1, this.filteredAdmins.length);
      return {
        from,
        to,
        totalItems: this.filteredAdmins.length,
      };
    },
    adminMetrics() {
      return {
        total: this.admins.length,
        active: this.admins.filter(a => a.status === 'active').length,
        pending: this.admins.filter(a => a.status === 'pending').length,
        suspended: this.admins.filter(a => a.status === 'suspended').length,
        partners: this.admins.filter(a => a.type === 'partner').length,
      };
    },
  },
  methods: {
    updateMetrics() {
      this.metrics[0].value = this.adminMetrics.total.toString();
      this.metrics[1].value = this.adminMetrics.active.toString();
      this.metrics[2].value = this.adminMetrics.pending.toString();
      this.metrics[3].value = this.adminMetrics.suspended.toString();
      this.metrics[4].value = this.adminMetrics.partners.toString();
    },
    async fetchAdmins() {
      try {
        const { data } = await apiListAdmins();
        if (data?.success && data?.admins) {
          this.admins = data.admins;
          this.updateMetrics();
        }
      } catch (error) {
        console.error('Error fetching admins:', error);
      }
    },
    capitalize(str) {
      if (!str) return '';
      return str.charAt(0).toUpperCase() + str.slice(1);
    },
    statusBadgeClass(status) {
      const map = {
        active: 'bg-green-100 text-green-800',
        pending: 'bg-yellow-100 text-yellow-800',
        suspended: 'bg-red-100 text-red-800',
        cancelled: 'bg-gray-100 text-gray-800',
      };
      return map[status] || 'bg-gray-100 text-gray-800';
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
    setPage(page) {
      if (page >= 1 && page <= this.totalPages) {
        this.currentPage = page;
      }
    },
    prevPage() {
      if (this.currentPage > 1) this.currentPage--;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) this.currentPage++;
    },
    openEditModal(admin) {
      this.selectedAdmin = { ...admin };
      this.showEditModal = true;
    },
    async saveAdmin(updatedAdmin) {
      try {
        await apiUpdateAdmin(updatedAdmin.id, updatedAdmin);
        this.closeEditModal();
        this.fetchAdmins();
      } catch (error) {
        console.error('Error updating admin:', error);
        alert('Failed to update admin');
      }
    },
    closeEditModal() {
      this.showEditModal = false;
      this.selectedAdmin = null;
    },
    openDeleteModal(adminId) {
      this.selectedDeleteAdminId = adminId;
      this.showDeleteModal = true;
    },
    async deleteAdmin(adminId) {
      try {
        await apiDeleteAdmin(adminId);
        this.closeDeleteModal();
        this.fetchAdmins();
      } catch (error) {
        console.error('Error deleting admin:', error);
        alert('Failed to delete admin');
      }
    },
    closeDeleteModal() {
      this.showDeleteModal = false;
      this.selectedDeleteAdminId = null;
    },
  },
  mounted() {
    this.fetchAdmins();
  },
  watch: {
    searchQuery() {
      this.currentPage = 1;
    },
    filterStatuses() {
      this.currentPage = 1;
    },
  },
};
</script>
