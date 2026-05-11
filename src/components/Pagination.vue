<template>
  <div class="flex flex-col items-center mt-3">
    <nav>
      <div class="flex gap-1">
        <button
          class="px-3 py-1.5 rounded border border-gray-300 text-sm leading-tight transition-colors"
          :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'"
          :disabled="currentPage === 1"
          @click="$emit('firstPage')"
        >First Page</button>
        <button
          class="px-3 py-1.5 rounded border border-gray-300 text-sm leading-tight transition-colors"
          :class="currentPage === 1 ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'"
          :disabled="currentPage === 1"
          @click="$emit('prevPage')"
        >Previous</button>
        <button
          v-for="page in totalPages"
          :key="page"
          class="px-3 py-1.5 rounded border border-gray-300 text-sm leading-tight transition-colors"
          :class="currentPage === page ? 'bg-primary text-white border-primary' : 'hover:bg-gray-100'"
          @click="$emit('setPage', page)"
        >{{ page }}</button>
        <button
          class="px-3 py-1.5 rounded border border-gray-300 text-sm leading-tight transition-colors"
          :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'"
          :disabled="currentPage === totalPages"
          @click="$emit('nextPage')"
        >Next</button>
        <button
          class="px-3 py-1.5 rounded border border-gray-300 text-sm leading-tight transition-colors"
          :class="currentPage === totalPages ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'"
          :disabled="currentPage === totalPages"
          @click="$emit('lastPage')"
        >Last Page</button>
      </div>
    </nav>
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
  },
  emits: ['setPage', 'prevPage', 'nextPage', 'firstPage', 'lastPage'],
};
</script>
