<template>
  <div class="position-fixed top-0 start-50 translate-middle-x p-3" style="z-index: 1055;">
    <div
      class="toast"
      :class="type === 'success' ? 'bg-success text-white' : type === 'error' ? 'bg-danger text-white' : 'bg-warning text-dark'"
      role="alert"
      aria-live="assertive"
      aria-atomic="true"
      ref="toastElement"
    >
      <div class="toast-header">
        <strong class="me-auto">{{ type === 'success' ? 'Success' : type === 'error' ? 'Error' : 'Confirm' }}</strong>
        <button
          type="button"
          class="btn-close"
          data-bs-dismiss="toast"
          aria-label="Close"
          v-if="!showConfirmButtons"
          @click="$emit('cancel')"
        ></button>
      </div>
      <div class="toast-body">
        {{ message }}
        <div v-if="showConfirmButtons" class="mt-2">
          <button class="btn btn-sm btn-outline-success me-2" @click="$emit('confirm', id)">Confirm</button>
          <button class="btn btn-sm btn-outline-secondary" @click="$emit('cancel')">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Toast } from 'bootstrap';

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
  data() {
    return {
      toastInstance: null
    };
  },
  watch: {
    message(newMessage) {
      if (newMessage) {
        this.$nextTick(() => {
          if (this.toastInstance) {
            this.toastInstance.hide();
          }
          this.toastInstance = new Toast(this.$refs.toastElement, {
            autohide: !this.showConfirmButtons,
            delay: 5000
          });
          this.toastInstance.show();
        });
      } else if (this.toastInstance) {
        this.toastInstance.hide();
        this.toastInstance = null;
      }
    }
  },
  beforeUnmount() {
    if (this.toastInstance) {
      this.toastInstance.dispose();
    }
  }
};
</script>