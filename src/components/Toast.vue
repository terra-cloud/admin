<template>
  <div
    v-show="!!message"
    class="fixed top-4 left-1/2 -translate-x-1/2 z-50 min-w-[320px] rounded-lg shadow-lifted"
    :class="type === 'success' ? 'bg-green-500' : type === 'error' ? 'bg-red-500' : 'bg-amber-500'"
  >
    <div class="flex items-center justify-between px-4 py-3 border-b border-white/20">
      <strong class="text-white text-sm font-semibold">{{ type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Confirm' }}</strong>
      <button
        v-if="!showConfirmButtons"
        class="text-white/80 hover:text-white text-lg leading-none"
        @click="$emit('cancel')"
        aria-label="Close"
      >&times;</button>
    </div>
    <div class="px-4 py-3 text-white text-sm">
      {{ message }}
      <div v-if="showConfirmButtons" class="mt-2 flex gap-2">
        <button
          class="px-3 py-1 rounded border border-white text-white text-sm hover:bg-white/10 transition-colors"
          @click="$emit('confirm', id)"
        >Confirm</button>
        <button
          class="px-3 py-1 rounded border border-white/60 text-white/80 text-sm hover:bg-white/10 transition-colors"
          @click="$emit('cancel')"
        >Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Toast',
  props: {
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: '',
      validator: value => ['success', 'error', 'confirm', ''].includes(value)
    },
    showConfirmButtons: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: null
    }
  },
  emits: ['confirm', 'cancel'],
  data() {
    return {
      timer: null
    };
  },
  watch: {
    message(newMessage) {
      if (this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
      if (newMessage && !this.showConfirmButtons) {
        this.timer = setTimeout(() => {
          this.$emit('cancel');
        }, 2000);
      }
    }
  },
  beforeUnmount() {
    if (this.timer) {
      clearTimeout(this.timer);
    }
  }
};
</script>
