<template>
  <div class="bg-white rounded-2xl shadow-soft p-5 border border-gray-100/50">
    <h3 class="text-sm font-semibold text-text-light mb-4 flex items-center gap-2">
      <span class="material-symbols-outlined text-primary text-lg">person</span>
      Lessee Information
    </h3>
    <div class="flex items-center gap-4 mb-4">
      <div class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
        {{ initials }}
      </div>
      <div>
        <p class="text-base font-semibold text-text-light">{{ fullName }}</p>
        <p class="text-sm text-text-muted-light">{{ lessee.phoneNumber || '—' }}</p>
      </div>
    </div>
    <div class="space-y-3 border-t border-gray-100 pt-4">
      <div v-if="lessee.address" class="flex items-start gap-2">
        <span class="material-symbols-outlined text-text-muted-light text-lg shrink-0 mt-0.5">home</span>
        <div>
          <p class="text-xs text-text-muted-light">Address</p>
          <p class="text-sm text-text-light">{{ lessee.address }}</p>
        </div>
      </div>
      <div v-if="lessee.emergencyName || lessee.emergencyLastName" class="flex items-start gap-2">
        <span class="material-symbols-outlined text-text-muted-light text-lg shrink-0 mt-0.5">emergency</span>
        <div>
          <p class="text-xs text-text-muted-light">Emergency Contact</p>
          <p class="text-sm text-text-light">{{ lessee.emergencyName }} {{ lessee.emergencyLastName }}</p>
          <p v-if="lessee.emergencyContact" class="text-sm text-text-muted-light">{{ lessee.emergencyContact }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    lessee: { type: Object, default: () => ({}) }
  },
  computed: {
    fullName() {
      const parts = [this.lessee.name, this.lessee.lastName].filter(Boolean);
      return parts.length ? parts.join(' ') : '—';
    },
    initials() {
      const first = (this.lessee.name || '?')[0];
      const last = (this.lessee.lastName || '?')[0];
      return (first + last).toUpperCase();
    }
  }
};
</script>
