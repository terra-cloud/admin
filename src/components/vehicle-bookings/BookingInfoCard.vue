<template>
  <div class="bg-white rounded-2xl shadow-soft p-5 border border-gray-100/50">
    <h3 v-if="title" class="text-sm font-semibold text-text-light mb-4 flex items-center gap-2">
      <span v-if="icon" class="material-symbols-outlined text-primary text-lg">{{ icon }}</span>
      {{ title }}
    </h3>
    <div class="space-y-3">
      <div v-for="(item, i) in items" :key="i" class="flex items-center justify-between py-1.5">
        <span class="text-sm text-text-muted-light">{{ item.label }}</span>
        <span class="text-sm font-medium text-text-light text-right" :class="item.valueClass">{{ item.value || '—' }}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    title: { type: String, default: '' },
    icon: { type: String, default: '' },
    items: { type: Array, default: () => [] }
  }
};
</script>
