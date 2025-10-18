<template>
  <div class="relative inline-block">
    <label v-if="label" class="block text-sm font-medium text-gray-700 mb-1">{{label}}</label>
    <button
      @click="toggleDropdown"
      class="flex h-12 w-full items-center justify-center gap-x-2 rounded-lg px-4 text-gray-800 dark:text-gray-200 hover:bg-gray-200 border border-gray-300 dark:border-gray-700 dark:hover:bg-gray-700 transition-colors"
    >
      <p class="text-sm font-medium">{{ selectedItem?.text || 'Select' }}</p>
      <span class="material-symbols-outlined text-xl text-gray-400 dark:text-gray-500">expand_more</span>
    </button>

    <div
      v-if="open"
      class="absolute z-10 mt-2 w-full bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-100 dark:border-gray-700"
    >
      <ul>
        <li
          v-for="(item, index) in items"
          :key="index"
          @click="selectItem(item)"
          class="px-4 py-2 text-sm cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
        >
          {{ item.text }}
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatusDropdown",
  props: {
    label: '',
    items: {
      type: Array,
      required: true,
      default: () => [],
    },
    modelValue: {
      type: [String, Number],
      default: null,
    },
  },
  data() {
    return {
      open: false,
    };
  },
  computed: {
    selectedItem() {
      return this.items.find((i) => i.value === this.modelValue);
    },
  },
  methods: {
    toggleDropdown() {
      this.open = !this.open;
    },
    selectItem(item) {
      this.$emit("update:modelValue", item.value);
      this.open = false;
    },
  },
};
</script>

<style scoped>
.material-symbols-outlined {
  font-family: 'Material Symbols Outlined';
}
</style>
