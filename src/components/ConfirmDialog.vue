<template>
  <div
    class="modal fade"
    :id="'deleteModal-' + currentId"
    tabindex="-1"
    aria-labelledby="deleteModalLabel"
    aria-hidden="true"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close" @click="$emit('close')"></button>
        </div>
        <div class="modal-body">
          {{ message }}
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('close')">Cancel</button>
          <button type="button" class="btn btn-danger" @click="$emit('confirm', currentId)">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';

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
  data() {
    return {
      modalInstance: null
    };
  },
  watch: {
    show(newShow) {
      this.$nextTick(() => {
        if (!this.modalInstance) {
          this.modalInstance = new Modal(this.$el, {
            backdrop: 'static',
            keyboard: false
          });
        }
        if (newShow) {
          this.modalInstance.show();
        } else {
          this.modalInstance.hide();
        }
      });
    }
  },
  beforeUnmount() {
    if (this.modalInstance) {
      this.modalInstance.dispose();
    }
  }
};
</script>

<style scoped>
.modal-dialog {
  max-width: 400px;
}
.btn {
  min-height: 38px;
  line-height: 1.5;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
</style>