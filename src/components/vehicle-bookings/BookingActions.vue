<template>
  <div class="space-y-2">
    <button
      v-if="showApprove"
      class="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all"
      @click="$emit('approve')"
    >
      <span class="material-symbols-outlined text-lg">check_circle</span>
      Approve Booking
    </button>
    <button
      v-if="showComplete"
      class="w-full flex items-center justify-center gap-2 py-2.5 bg-green-600 text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all"
      @click="$emit('complete')"
    >
      <span class="material-symbols-outlined text-lg">task_alt</span>
      Complete Booking
    </button>
    <button
      v-if="showCancel"
      class="w-full flex items-center justify-center gap-2 py-2.5 bg-red-50 text-red-700 rounded-xl text-sm font-bold hover:bg-red-100 transition-all border border-red-200"
      @click="$emit('cancel')"
    >
      <span class="material-symbols-outlined text-lg">cancel</span>
      Cancel Booking
    </button>
    <button
      class="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-text-light rounded-xl text-sm font-medium hover:bg-gray-100 transition-all border border-gray-200"
      @click="$emit('print')"
    >
      <span class="material-symbols-outlined text-lg">print</span>
      Print Booking
    </button>
  </div>
</template>

<script>
export default {
  props: {
    status: { type: String, default: '' }
  },
  emits: ['approve', 'complete', 'cancel', 'print'],
  computed: {
    statusKey() {
      return (this.status || '').toLowerCase();
    },
    showApprove() {
      return this.statusKey === 'pending';
    },
    showComplete() {
      return this.statusKey === 'active';
    },
    showCancel() {
      return ['pending', 'active'].includes(this.statusKey);
    }
  }
};
</script>
