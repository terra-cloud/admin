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
      <div v-if="user.kyc_rejection_reason" class="flex justify-between py-3">
        <span class="text-sm text-text-muted-light">KYC Rejection Reason</span>
        <span class="text-sm font-medium text-red-600">{{ user.kyc_rejection_reason }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: { type: Object, required: true },
  },
  computed: {
    kycLabel() {
      const map = { 1: 'Approved', 0: 'Pending', '-1': 'Rejected' };
      return map[this.user.kyc_validated] || 'Unknown';
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
  },
};
</script>
