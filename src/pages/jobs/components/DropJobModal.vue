<template>
  <div
    class="modal fade"
    :id="'dropJobModal-' + jobId"
    tabindex="-1"
    aria-labelledby="dropJobModalLabel"
    aria-hidden="true"
    data-bs-backdrop="static"
    data-bs-keyboard="false"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="dropJobModalLabel">Confirm Drop Job</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          Are you sure you want to drop the job posting "{{ jobTitle || 'Untitled' }}"? This will set its status to Dropped.
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button type="button" class="btn btn-danger" @click="confirmDrop">Drop</button>
        </div>
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
      modal: null,
    };
  },
  methods: {
    confirmDrop() {
      this.$emit('confirm', this.jobId);
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
    this.modal = document.getElementById(`dropJobModal-${this.jobId}`);
    if (this.modal) {
      this.modal.classList.add('show');
      this.modal.style.display = 'block';
      document.body.classList.add('modal-open');
      const backdrop = document.createElement('div');
      backdrop.className = 'modal-backdrop fade show';
      document.body.appendChild(backdrop);
    } else {
      console.error('Drop job modal element not found');
    }
  },
};
</script>

<style scoped>
.modal-dialog {
  max-width: 400px;
}
</style>