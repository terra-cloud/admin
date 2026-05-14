<template>
  <div class="bg-white rounded-2xl shadow-soft p-5 border border-gray-100/50">
    <h3 class="text-sm font-semibold text-text-light mb-4 flex items-center gap-2">
      <span class="material-symbols-outlined text-primary text-lg">timeline</span>
      Activity Timeline
    </h3>
    <div class="space-y-0">
      <div v-for="(event, i) in events" :key="i" class="flex gap-4">
        <div class="flex flex-col items-center">
          <div
            class="w-7 h-7 rounded-full flex items-center justify-center transition-all duration-300"
            :class="event.active ? 'bg-primary text-white shadow-sm shadow-primary/30' : 'bg-gray-100 text-gray-400'"
          >
            <span class="material-symbols-outlined text-sm" :class="{ 'font-variation-settings-filled': event.active }">{{ event.icon }}</span>
          </div>
          <div v-if="i < events.length - 1" class="w-0.5 flex-1 bg-gray-100 my-1"></div>
        </div>
        <div class="pb-5" :class="{ 'pb-0': i === events.length - 1 }">
          <p class="text-sm font-medium text-text-light" :class="{ 'font-bold text-primary': event.active }">{{ event.label }}</p>
          <p class="text-xs text-text-muted-light mt-0.5">{{ event.date || '—' }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    events: { type: Array, default: () => [] }
  }
};
</script>
