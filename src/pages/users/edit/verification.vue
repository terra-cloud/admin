<template>
  <div class="bg-white rounded-xl shadow-soft overflow-hidden">
    <div class="px-6 py-4 border-b border-gray-200">
      <h2 class="text-lg font-semibold text-text-primary">Verification Status</h2>
    </div>
    <div class="px-6 py-4 space-y-4">
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Email Verification</span>
        <span class="text-sm font-medium" :class="verificationClass(user.email_verification_state)">{{ user.email_verification_state }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">Phone Verification</span>
        <span class="text-sm font-medium" :class="verificationClass(user.phone_verification_state)">{{ user.phone_verification_state }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">ID Verification</span>
        <span class="text-sm font-medium" :class="verificationClass(user.id_verification_state)">{{ user.id_verification_state }}</span>
      </div>
      <div class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">KYC Status</span>
        <span class="text-sm font-medium" :class="kycClass(user.kyc_validated)">{{ kycLabel }}</span>
      </div>
      <div v-if="user.kyc_rejection_reason" class="flex justify-between py-3 border-b border-gray-100">
        <span class="text-sm text-text-muted-light">KYC Rejection Reason</span>
        <span class="text-sm font-medium text-red-600">{{ user.kyc_rejection_reason }}</span>
      </div>
    </div>

    <div class="px-6 py-4 border-t border-gray-200 bg-gray-50">
      <h3 class="text-sm font-semibold text-text-primary mb-4">Update KYC Status</h3>
      <div class="mb-4">
        <label for="kycStatus" class="block text-sm font-medium text-gray-700 mb-1">KYC Status</label>
        <select
          id="kycStatus"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm bg-white"
          v-model.number="kycForm.kyc_validated"
        >
          <option :value="0">Pending</option>
          <option :value="1">Approved</option>
          <option :value="-1">Rejected</option>
        </select>
      </div>
      <div v-if="kycForm.kyc_validated === -1" class="mb-4">
        <label for="kycRejectionReason" class="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
        <textarea
          id="kycRejectionReason"
          class="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          v-model="kycForm.kyc_rejection_reason"
          rows="3"
          placeholder="Enter reason for rejection..."
        ></textarea>
      </div>
      <div v-if="kycSaved" class="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4">
        KYC status updated successfully.
      </div>
      <div v-if="kycError" class="bg-red-50 text-red-700 px-4 py-3 rounded-lg mb-4">
        {{ kycError }}
      </div>
      <div class="flex justify-end">
        <button
          type="button"
          class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="saveKyc"
          :disabled="kycSaving || !kycFormValid"
        >
          {{ kycSaving ? 'Saving...' : 'Save KYC Status' }}
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '@/firebase';
import { doc, setDoc } from 'firebase/firestore';

export default {
  props: {
    user: { type: Object, required: true },
  },
  data() {
    return {
      kycForm: {
        kyc_validated: this.user.kyc_validated ?? 0,
        kyc_rejection_reason: this.user.kyc_rejection_reason || '',
      },
      kycSaving: false,
      kycSaved: false,
      kycError: null,
    };
  },
  computed: {
    kycLabel() {
      const map = { 1: 'Approved', 0: 'Pending', '-1': 'Rejected' };
      return map[this.user.kyc_validated] || 'Unknown';
    },
    kycFormValid() {
      return this.kycForm.kyc_validated !== -1 || this.kycForm.kyc_rejection_reason.trim() !== '';
    },
  },
  methods: {
    verificationClass(state) {
      if (state === 'verified') return 'text-green-600';
      if (state === 'unverified') return 'text-amber-600';
      return 'text-red-600';
    },
    kycClass(status) {
      if (status === 1) return 'text-green-600';
      if (status === 0) return 'text-amber-600';
      if (status === -1) return 'text-red-600';
      return 'text-gray-600';
    },
    async saveKyc() {
      this.kycSaving = true;
      this.kycSaved = false;
      this.kycError = null;
      try {
        await setDoc(doc(db, 'users', this.$route.params.id), {
          kyc_validated: this.kycForm.kyc_validated,
          kyc_rejection_reason: this.kycForm.kyc_validated === -1 ? this.kycForm.kyc_rejection_reason : '',
        }, { merge: true });
        this.kycSaved = true;
        this.$emit('saved');
        setTimeout(() => { this.kycSaved = false; }, 3000);
      } catch (err) {
        this.kycError = 'Failed to update KYC status.';
      } finally {
        this.kycSaving = false;
      }
    },
  },
};
</script>
