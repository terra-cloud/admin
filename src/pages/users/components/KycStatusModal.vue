<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-lg mx-4">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h5 class="text-lg font-semibold text-gray-900">
          Update KYC Status for {{ user.name }} {{ user.last_name }}
        </h5>
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
        <div class="mb-4">
          <label for="kycStatus" class="block text-sm font-medium text-gray-700 mb-1">KYC Status</label>
          <select
            id="kycStatus"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
            v-model="localUser.kyc_validated"
          >
            <option :value="0">Pending</option>
            <option :value="1">Approved</option>
            <option :value="-1">Rejected</option>
          </select>
        </div>
        <div v-if="localUser.kyc_validated === -1" class="mb-4">
          <label for="kycRejectionReason" class="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
          <textarea
            id="kycRejectionReason"
            class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            v-model="localUser.kyc_rejection_reason"
            rows="4"
            placeholder="Enter reason for rejection..."
          ></textarea>
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
          @click="save"
          :disabled="!isFormValid"
        >
          Save
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
      localUser: {
        id: this.user.id,
        kyc_validated: this.user.kyc_validated || 0,
        kyc_rejection_reason: this.user.kyc_rejection_reason || '',
      },
      isVisible: true,
    };
  },
  computed: {
    isFormValid() {
      return this.localUser.kyc_validated !== -1 || this.localUser.kyc_rejection_reason.trim() !== '';
    },
  },
  methods: {
    save() {
      this.$emit('save', {
        id: this.localUser.id,
        kyc_validated: this.localUser.kyc_validated,
        kyc_rejection_reason: this.localUser.kyc_rejection_reason,
      });
      this.closeModal();
    },
    closeModal() {
      this.isVisible = false;
      this.$emit('close');
    },
  },
};
</script>
