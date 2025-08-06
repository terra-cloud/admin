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
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="deleteModalLabel">Confirm Delete</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Are you sure you want to delete this user?
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button type="button" class="btn btn-danger" @click="confirmDelete">Delete</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      modal: null,
    };
  },
  methods: {
    confirmDelete() {
      this.$emit('confirm', this.currentId);
      this.closeModal();
    },
    closeModal() {
      this.$emit('close');
      if (this.modal) {
        this.modal.classList.remove('show');
        this.modal.style.display = 'none';
        document.body.classList.remove('modal-open');
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) backdrop.remove();
      }
    },
  },
  mounted() {
    this.modal = document.getElementById(`deleteModal-${this.currentId}`);
    if (this.modal) {
      this.modal.classList.add('show');
      this.modal.style.display = 'block';
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    } else {
      console.error('Delete modal element not found');
    }
  },
};
</script>

<style scoped>
.modal-dialog {
  max-width: 400px;
}
</style>