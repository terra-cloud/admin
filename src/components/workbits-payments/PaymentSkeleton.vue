<template>
  <div class="space-y-4">
    <div v-for="n in count" :key="n" class="bg-white rounded-xl shadow-soft p-5 animate-pulse">
      <div class="flex gap-4">
        <div class="w-12 h-12 rounded-full bg-gray-200 shrink-0"></div>
        <div class="flex-1 space-y-3">
          <div class="h-4 bg-gray-200 rounded w-1/3"></div>
          <div class="h-3 bg-gray-200 rounded w-1/2"></div>
          <div class="h-3 bg-gray-200 rounded w-2/3"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    count: { type: Number, default: 6 }
  }
};
</script>
