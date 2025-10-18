<template>
  <div class="mt-6 px-4 flex justify-center">
    <div class="flex items-center gap-2">
      
      <p class="text-sm text-gray-600 dark:text-gray-400">Showing {{ tableData.from }} to {{ tableData.to }} of {{tableData.totalItems}} results</p>

      <button
        @click="$emit('firstPage')"
        class="flex items-center justify-center h-8 w-8 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
        disabled>
        <span class="material-symbols-outlined text-xl">first_page</span>
      </button>

      <button
        @click="$emit('prevPage')"
        class="flex items-center justify-center h-8 w-8 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-50"
        disabled>
        <span class="material-symbols-outlined text-xl">chevron_left</span>
      </button>

      <template v-for="page in totalPages">
        <button
          @click="$emit('setPage', page)"
          :class="{ 'bg-primary': currentPage === page }"
          class="flex items-center justify-center h-8 w-8 rounded-lg text-white text-sm font-medium">
          {{ page }}
        </button>

      </template>
      
      <button
        @click="$emit('nextPage')"
        class="flex items-center justify-center h-8 w-8 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
        <span class="material-symbols-outlined text-xl">chevron_right</span>
      </button>

      <button
        @click="$emit('lastPage')"
        class="flex items-center justify-center h-8 w-8 rounded-lg border border-gray-300 dark:border-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800">
        <span class="material-symbols-outlined text-xl">last_page</span>
      </button>
    </div>
  </div>
  <!-- <div class="d-flex justify-content-center align-items-center mt-3 flex-column">
    <nav>
      <ul class="pagination">
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="$emit('firstPage')">First Page</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === 1 }">
          <button class="page-link" @click="$emit('prevPage')">Previous</button>
        </li>
        <li
          class="page-item"
          v-for="page in totalPages"
          :key="page"
          :class="{ active: currentPage === page }"
        >
          <button class="page-link" @click="$emit('setPage', page)">{{ page }}</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="$emit('nextPage')">Next</button>
        </li>
        <li class="page-item" :class="{ disabled: currentPage === totalPages }">
          <button class="page-link" @click="$emit('lastPage')">Last Page</button>
        </li>
      </ul>
    </nav>
  </div> -->
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

<style scoped>
.pagination-count {
  text-align: center;
}
</style>