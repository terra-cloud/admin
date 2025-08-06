<template>
  <div class="modal fade" :id="'kycModal-' + user.id" tabindex="-1" aria-labelledby="kycModalLabel" aria-hidden="true" ref="modalRef">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="kycModalLabel">Update KYC Status for {{ user.name }} {{ user.last_name }}</h5>
          <button type="button" class="btn-close" @click="closeModal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <div class="mb-3">
            <label for="kycStatus" class="form-label">KYC Status</label>
            <select
              id="kycStatus"
              class="form-select"
              v-model="localUser.kyc_validated"
            >
              <option :value="0">Pending</option>
              <option :value="1">Approved</option>
              <option :value="-1">Rejected</option>
            </select>
          </div>
          <div v-if="localUser.kyc_validated === -1" class="mb-3">
            <label for="kycRejectionReason" class="form-label">Rejection Reason</label>
            <textarea
              id="kycRejectionReason"
              class="form-control"
              v-model="localUser.kyc_rejection_reason"
              rows="4"
              placeholder="Enter reason for rejection..."
            ></textarea>
          </div>
        </div>
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Close</button>
          <button
            type="button"
            class="btn btn-primary"
            @click="save"
            :disabled="!isFormValid"
          >
            Save
          </button>
        </div>
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
      this.$emit('close');
      const modalElement = this.$refs.modalRef;
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
      document.body.classList.remove('modal-open');
      const backdrop = document.querySelector('.modal-backdrop');
      if (backdrop) backdrop.remove();
    },
  },
  mounted() {
    const modalElement = this.$refs.modalRef;
    modalElement.classList.add('show');
    modalElement.style.display = 'block';
    document.body.classList.add('modal-open');
    const backdrop = document.createElement('div');
    backdrop.className = 'modal-backdrop fade show';
    document.body.appendChild(backdrop);
    this.$nextTick(() => {
      this.$el.querySelector('select').focus();
    });
  },
};
</script>

<style scoped>
.modal-dialog {
  max-width: 500px;
}
</style>