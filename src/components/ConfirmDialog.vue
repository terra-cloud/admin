<template>
  <div v-if="show" class="fixed inset-0 z-50 flex items-center justify-center">
    <div class="fixed inset-0 bg-black/50"></div>
    <div class="relative bg-card-light rounded-lg shadow-lifted w-full max-w-md mx-4">
      <div class="flex items-center justify-between px-6 py-4 border-b border-gray-200">
        <h5 class="text-lg font-semibold text-text-light">Confirm Delete</h5>
        <button class="text-gray-400 hover:text-gray-600 text-xl leading-none" @click="$emit('close')" aria-label="Close">&times;</button>
      </div>
      <div class="px-6 py-4 text-text-light text-sm">
        {{ message }}
      </div>
      <div class="flex justify-end gap-2 px-6 py-4 border-t border-gray-200">
        <button
          class="px-4 py-2 rounded bg-gray-200 text-gray-800 text-sm hover:bg-gray-300 transition-colors"
          @click="$emit('close')"
        >Cancel</button>
        <button
          class="px-4 py-2 rounded bg-red-600 text-white text-sm hover:bg-red-700 transition-colors"
          @click="$emit('confirm', currentId)"
        >Delete</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    currentId: {
      type: String,
      required: true
    },
    message: {
      type: String,
      default: 'Are you sure you want to proceed?'
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  emits: ['confirm', 'close']
};
</script>
