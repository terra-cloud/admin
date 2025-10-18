<template>
  <div class="relative inline-block text-left">
    <!-- More button -->
    <button
      @click="toggleMenu"
      class="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400"
    >
      <span class="material-symbols-outlined">more_vert</span>
    </button>

    <!-- Dropdown items -->
    <transition name="fade">
      <div
        v-if="open"
        class="absolute right-0 mt-2 w-40 origin-top-right rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg z-50"
      >
        <ul class="py-1">
          <li
            @click="$emit('view', itemId)"
            class="cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            View
          </li>
        </ul>
        <ul class="py-1">
          <li
            @click="$emit('delete', itemId)"
            class="cursor-pointer px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            Delete
          </li>
        </ul>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "MoreMenu",
  props: {
    itemId: {
      type: [String, Number],
      default: () => '',
    },
  },
  data() {
    return {
      open: false,
    };
  },
  methods: {
    toggleMenu() {
      this.open = !this.open;
    },
    selectItem(item) {
      this.$emit("select", item);
      this.open = false;
    },
  },
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.15s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
