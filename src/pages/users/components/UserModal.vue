<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h5 class="text-lg font-semibold text-gray-900">Edit User</h5>
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
        <div class="flex flex-wrap -mx-3">
          <div class="w-full md:w-1/3 px-3 text-center">
            <img
              v-if="localUser.photo_url"
              :src="localUser.photo_url"
              class="update-user-photo mb-3 max-w-full h-auto"
              alt="User Photo"
            />
            <span v-else class="block mb-3 text-gray-500">No Photo</span>
          </div>
          <div class="w-full md:w-2/3 px-3">
            <form @submit.prevent="saveUser">
              <div class="mb-4">
                <label for="editName" class="block text-sm font-medium text-gray-700 mb-1">First Name</label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  id="editName"
                  v-model="localUser.name"
                  required
                />
              </div>
              <div class="mb-4">
                <label for="editLastName" class="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
                <input
                  type="text"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  id="editLastName"
                  v-model="localUser.last_name"
                  required
                />
              </div>
              <div class="mb-4">
                <label for="editEmail" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-gray-50"
                  id="editEmail"
                  readonly
                  v-model="localUser.email"
                  required
                />
              </div>
              <div class="mb-4">
                <label for="editBirthdate" class="block text-sm font-medium text-gray-700 mb-1">Birthdate</label>
                <input
                  type="date"
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  id="editBirthdate"
                  v-model="localUser.birthdate"
                  required
                />
              </div>
              <div class="mb-4">
                <label for="editGender" class="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                  id="editGender"
                  v-model="localUser.gender"
                  required
                >
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              <div class="mb-4">
                <label for="editAccountType" class="block text-sm font-medium text-gray-700 mb-1">Account Type</label>
                <select
                  class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
                  id="editAccountType"
                  v-model="localUser.account_type"
                  required
                >
                  <option value="1">User</option>
                  <option value="2">Employer</option>
                </select>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div class="flex items-center justify-end gap-2 px-6 py-4 border-t border-gray-200">
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          @click="closeModal"
        >
          Close
        </button>
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="saveUser"
          :disabled="!isFormValid"
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
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localUser: this.initializeLocalUser(),
      isVisible: true,
    };
  },
  computed: {
    isFormValid() {
      return (
        this.localUser.name.trim() &&
        this.localUser.last_name.trim() &&
        this.localUser.email.trim() &&
        this.localUser.birthdate &&
        this.localUser.gender &&
        this.localUser.account_type &&
        this.localUser.kyc_validated !== null
      );
    },
  },
  methods: {
    initializeLocalUser() {
      return {
        ...this.user,
        birthdate: this.user.birthdate ? new Date(this.user.birthdate).toISOString().split('T')[0] : '',
        gender: this.user.gender || '',
        account_type: this.user.account_type ? String(this.user.account_type) : '1',
        kyc_validated: this.user.kyc_validated !== null && this.user.kyc_validated !== undefined ? String(this.user.kyc_validated) : '0',
        photo_url: this.user.photo_url || '',
      };
    },
    saveUser() {
      if (this.isFormValid) {
        this.$emit('save', this.localUser);
        this.closeModal();
      }
    },
    closeModal() {
      this.isVisible = false;
      this.$emit('close');
    },
  },
  watch: {
    user: {
      handler() {
        this.localUser = this.initializeLocalUser();
      },
      deep: true,
      immediate: true,
    },
  },
};
</script>
