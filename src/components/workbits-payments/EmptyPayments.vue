<template>
  <div class="bg-white rounded-xl shadow-soft p-12 text-center">
    <span class="material-symbols-outlined text-5xl text-text-muted-light">payments</span>
    <h3 class="text-lg font-semibold text-text-light mt-4">{{ title }}</h3>
    <p class="text-sm text-text-muted-light mt-1 max-w-sm mx-auto">{{ message }}</p>
    <button v-if="actionLabel" class="mt-4 inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-sm font-medium hover:opacity-90 transition-opacity" @click="$emit('action')">
      <span class="material-symbols-outlined text-lg">refresh</span>
      {{ actionLabel }}
    </button>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: 'No payments found' },
    message: { type: String, default: 'Try adjusting your search or filters.' },
    actionLabel: { type: String, default: '' }
  },
  emits: ['action']
};
</script>
