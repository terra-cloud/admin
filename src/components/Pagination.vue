<template>
  <div class="d-flex justify-content-center align-items-center mt-3 flex-column">
    <div class="pagination-count mb-2">{{ tableData.from }}-{{ tableData.to }} of {{ tableData.totalItems }}</div>
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

<style scoped>
.pagination-count {
  text-align: center;
}
</style>