<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h5 class="text-lg font-semibold text-gray-900">Edit Admin</h5>
        <button
          type="button"
          class="text-gray-400 hover:text-gray-600 focus:outline-none"
          @click="closeModal"
          aria-label="Close"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div class="px-6 py-4">
        <form @submit.prevent="saveAdmin">
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="mb-4">
              <label for="editFirstname" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
              <input
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                id="editFirstname"
                v-model="localAdmin.firstname"
              />
            </div>
            <div class="mb-4">
              <label for="editMiddlename" class="block text-sm font-medium text-gray-700 mb-1">Middle Name</label>
              <input
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                id="editMiddlename"
                v-model="localAdmin.middlename"
              />
            </div>
            <div class="mb-4">
              <label for="editLastname" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
              <input
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                id="editLastname"
                v-model="localAdmin.lastname"
              />
            </div>
            <div class="mb-4">
              <label for="editEmail" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                id="editEmail"
                v-model="localAdmin.email"
                required
              />
            </div>
            <div class="mb-4">
              <label for="editCompany" class="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                id="editCompany"
                v-model="localAdmin.company"
              />
            </div>
            <div class="mb-4">
              <label for="editType" class="block text-sm font-medium text-gray-700 mb-1">Type</label>
              <select
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                id="editType"
                v-model="localAdmin.type"
                required
              >
                <option value="partner">Partner</option>
                <option value="staff">Staff</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="editStatus" class="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                id="editStatus"
                v-model="localAdmin.status"
                required
              >
                <option value="pending">Pending</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div class="mb-4">
              <label for="editCity" class="block text-sm font-medium text-gray-700 mb-1">City</label>
              <input
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                id="editCity"
                v-model="localAdmin.city"
              />
            </div>
            <div class="mb-4">
              <label for="editState" class="block text-sm font-medium text-gray-700 mb-1">State</label>
              <input
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                id="editState"
                v-model="localAdmin.state"
              />
            </div>
            <div class="mb-4">
              <label for="editAddress" class="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <input
                type="text"
                class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                id="editAddress"
                v-model="localAdmin.address"
              />
            </div>
          </div>
        </form>
      </div>
      <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200">
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          @click="closeModal"
        >
          Cancel
        </button>
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          @click="saveAdmin"
        >
          Save changes
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    admin: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localAdmin: { ...this.admin },
      isVisible: true,
    };
  },
  methods: {
    saveAdmin() {
      this.$emit('save', this.localAdmin);
      this.closeModal();
    },
    closeModal() {
      this.isVisible = false;
      this.$emit('close');
    },
  },
  watch: {
    admin: {
      handler() {
        this.localAdmin = { ...this.admin };
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
