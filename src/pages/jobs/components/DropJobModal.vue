<template>
  <div
    v-if="isVisible"
    class="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
    @click.self="closeModal"
  >
    <div class="bg-white rounded-lg shadow-xl w-full max-w-md mx-4">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h5 class="text-lg font-semibold text-gray-900">Confirm Drop Job</h5>
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
      <div class="px-6 py-4 text-sm text-gray-700">
        Are you sure you want to drop the job posting "{{ jobTitle || 'Untitled' }}"? This will set its status to Dropped.
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
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          @click="confirmDrop"
        >
          Drop
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    jobId: {
      type: String,
      required: true,
    },
    jobTitle: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      isVisible: true,
    };
  },
  methods: {
    confirmDrop() {
      this.$emit('confirm', this.jobId);
      this.closeModal();
    },
    closeModal() {
      this.isVisible = false;
      this.$emit('close');
    },
  },
};
</script>
