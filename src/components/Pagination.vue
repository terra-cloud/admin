<template>
  <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
    <p class="text-sm text-text-muted-light">
      Showing
      <span class="font-semibold text-text-light">{{ tableData.from }}</span>
      to
      <span class="font-semibold text-text-light">{{ tableData.to }}</span>
      of
      <span class="font-semibold text-text-light">{{ tableData.totalItems }}</span>
      {{ itemLabel }}
    </p>
    <div class="flex items-center gap-2">
      <div v-if="showRowsPerPage" class="flex items-center gap-1.5 mr-2">
        <label class="text-xs text-text-muted-light">Rows:</label>
        <select
          :value="rowsPerPage"
          @change="$emit('update:rowsPerPage', Number($event.target.value))"
          class="px-2 py-1.5 bg-input-light border-none rounded-lg text-xs outline-none focus:ring-2 focus:ring-primary/30"
        >
          <option
            v-for="opt in rowsPerPageOptions"
            :key="opt"
            :value="opt"
          >{{ opt }}</option>
        </select>
      </div>
      <button
        class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-text-muted-light hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="currentPage === 1"
        @click="$emit('prevPage')"
      >
        <span class="material-symbols-outlined text-lg">chevron_left</span>
      </button>
      <template v-for="page in visiblePages" :key="page">
        <span v-if="page === '...'" class="px-1 text-text-muted-light text-sm">...</span>
        <button
          v-else
          class="min-w-[32px] h-8 px-2 rounded-lg text-sm font-medium transition-colors"
          :class="page === currentPage ? 'bg-primary text-white' : 'text-text-muted-light hover:bg-gray-50'"
          @click="$emit('setPage', page)"
        >
          {{ page }}
        </button>
      </template>
      <button
        class="w-8 h-8 flex items-center justify-center rounded-lg border border-gray-200 text-text-muted-light hover:bg-gray-50 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        :disabled="currentPage === totalPages"
        @click="$emit('nextPage')"
      >
        <span class="material-symbols-outlined text-lg">chevron_right</span>
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentPage: {
      type: Number,
      required: true,
    },
    totalPages: {
      type: Number,
      required: true,
    },
    tableData: {
      type: Object,
      required: true,
      validator: (tableData) => {
        return 'from' in tableData && 'to' in tableData && 'totalItems' in tableData;
      },
    },
    rowsPerPage: {
      type: Number,
      default: 20,
    },
    rowsPerPageOptions: {
      type: Array,
      default: () => [10, 20, 50, 100],
    },
    itemLabel: {
      type: String,
      default: 'items',
    },
    showRowsPerPage: {
      type: Boolean,
      default: true,
    },
  },
  emits: ['setPage', 'prevPage', 'nextPage', 'firstPage', 'lastPage', 'update:rowsPerPage'],
  computed: {
    visiblePages() {
      const total = this.totalPages;
      const current = this.currentPage;
      if (total <= 7) {
        return Array.from({ length: total }, (_, i) => i + 1);
      }
      const pages = [];
      pages.push(1);
      if (current > 3) pages.push('...');
      const start = Math.max(2, current - 1);
      const end = Math.min(total - 1, current + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (current < total - 2) pages.push('...');
      pages.push(total);
      return pages;
    },
  },
};
</script>
