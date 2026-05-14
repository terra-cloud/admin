<template>
  <div class="space-y-2">
    <button
      v-if="checkoutUrl"
      class="w-full flex items-center justify-center gap-2 py-2.5 bg-primary text-white rounded-xl text-sm font-bold hover:opacity-90 transition-all"
      @click="openCheckout"
    >
      <span class="material-symbols-outlined text-lg">open_in_new</span>
      Open Checkout URL
    </button>
    <button
      class="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-text-light rounded-xl text-sm font-medium hover:bg-gray-100 transition-all border border-gray-200"
      @click="$emit('copyInvoice')"
    >
      <span class="material-symbols-outlined text-lg">content_copy</span>
      Copy Invoice ID
    </button>
    <button
      class="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-text-light rounded-xl text-sm font-medium hover:bg-gray-100 transition-all border border-gray-200"
      @click="$emit('copyPayment')"
    >
      <span class="material-symbols-outlined text-lg">content_copy</span>
      Copy Payment ID
    </button>
    <button
      class="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-text-light rounded-xl text-sm font-medium hover:bg-gray-100 transition-all border border-gray-200"
      @click="$emit('print')"
    >
      <span class="material-symbols-outlined text-lg">print</span>
      Print Receipt
    </button>
    <button
      class="w-full flex items-center justify-center gap-2 py-2.5 bg-gray-50 text-text-light rounded-xl text-sm font-medium hover:bg-gray-100 transition-all border border-gray-200"
      @click="$emit('downloadPdf')"
    >
      <span class="material-symbols-outlined text-lg">picture_as_pdf</span>
      Download PDF
    </button>
  </div>
</template>

<script>
export default {
  props: {
    checkoutUrl: { type: String, default: '' }
  },
  emits: ['openCheckout', 'copyInvoice', 'copyPayment', 'print', 'downloadPdf'],
  methods: {
    openCheckout() {
      if (this.checkoutUrl) {
        window.open(this.checkoutUrl, '_blank');
      }
      this.$emit('openCheckout');
    }
  }
};
</script>
