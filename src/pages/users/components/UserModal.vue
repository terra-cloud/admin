<template>
  <div
    class="modal fade"
    id="editUserModal"
    tabindex="-1"
    aria-labelledby="editUserModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="editUserModalLabel">Edit User</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="closeModal"
          ></button>
        </div>
        <div class="modal-body">
          <div class="row">
            <!-- Left Column: Photo -->
            <div class="col-md-4 text-center">
              <img
                v-if="localUser.photo_url"
                :src="localUser.photo_url"
                class="update-user-photo mb-3"
                alt="User Photo"
              />
              <span v-else class="d-block mb-3">No Photo</span>
            </div>
            <!-- Right Column: Form Inputs -->
            <div class="col-md-8">
              <form @submit.prevent="saveUser">
                <div class="mb-3">
                  <label for="editName" class="form-label">First Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="editName"
                    v-model="localUser.name"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="editLastName" class="form-label">Last Name</label>
                  <input
                    type="text"
                    class="form-control"
                    id="editLastName"
                    v-model="localUser.last_name"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="editEmail" class="form-label">Email</label>
                  <input
                    type="email"
                    class="form-control"
                    id="editEmail"
                    readonly
                    v-model="localUser.email"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="editBirthdate" class="form-label">Birthdate</label>
                  <input
                    type="date"
                    class="form-control"
                    id="editBirthdate"
                    v-model="localUser.birthdate"
                    required
                  />
                </div>
                <div class="mb-3">
                  <label for="editGender" class="form-label">Gender</label>
                  <select
                    class="form-select"
                    id="editGender"
                    v-model="localUser.gender"
                    required
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="editAccountType" class="form-label">Account Type</label>
                  <select
                    class="form-select"
                    id="editAccountType"
                    v-model="localUser.account_type"
                    required
                  >
                    <option value="1">User</option>
                    <option value="2">Employer</option>
                  </select>
                </div>
                <div class="mb-3">
                  <label for="editKycStatus" class="form-label">KYC Status</label>
                  <select
                    class="form-select"
                    id="editKycStatus"
                    v-model="localUser.kyc_validated"
                    required
                  >
                    <option value="0">Pending</option>
                    <option value="1">Approved</option>
                    <option value="-1">Not Approved</option>
                  </select>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button
            type="button"
            class="btn btn-secondary"
            data-bs-dismiss="modal"
            @click="closeModal"
          >
            Close
          </button>
          <button
            type="button"
            class="btn btn-primary"
            @click="saveUser"
            :disabled="!isFormValid"
          >
            Save changes
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Modal } from 'bootstrap';

export default {
  props: {
    user: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      localUser: this.initializeLocalUser(),
      modal: null,
    };
  },
  computed: {
    isFormValid() {
      return (
        this.localUser.name.trim() &&
        this.localUser.last_name.trim() &&
        this.localUser.email.trim() &&
        this.localUser.birthdate &&
        this.localUser.gender &&
        this.localUser.account_type &&
        this.localUser.kyc_validated !== null
      );
    },
  },
  methods: {
    initializeLocalUser() {
      return {
        ...this.user,
        birthdate: this.user.birthdate ? new Date(this.user.birthdate).toISOString().split('T')[0] : '',
        gender: this.user.gender || '',
        account_type: this.user.account_type ? String(this.user.account_type) : '1',
        kyc_validated: this.user.kyc_validated !== null && this.user.kyc_validated !== undefined ? String(this.user.kyc_validated) : '0',
        photo_url: this.user.photo_url || '',
      };
    },
    saveUser() {
      if (this.isFormValid) {
        this.$emit('save', this.localUser);
        this.closeModal();
      }
    },
    closeModal() {
      this.$emit('close');
      if (this.modal) {
        this.modal.hide();
      }
    },
  },
  watch: {
    user: {
      handler(newUser) {
        this.localUser = this.initializeLocalUser();
      },
      deep: true,
      immediate: true,
    },
  },
  mounted() {
    // Initialize Bootstrap modal
    this.modal = new Modal(document.getElementById('editUserModal'));
    this.modal.show();
  },
  beforeUnmount() {
    // Clean up modal instance
    if (this.modal) {
      this.modal.dispose();
    }
  },
};
</script>