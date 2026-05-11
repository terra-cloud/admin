<template>
  <div class="relative" ref="wrapper">
    <div
      class="w-full rounded-lg bg-input-light border-none min-h-[42px] px-3 py-1.5 flex flex-wrap gap-1.5 items-center cursor-text"
      @click="$refs.input.focus()"
    >
      <span
        v-for="(item, i) in selectedItems"
        :key="item.value"
        class="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-medium bg-primary/10 text-primary"
      >
        {{ item.label }}
        <button
          type="button"
          class="text-primary/60 hover:text-primary cursor-pointer"
          @click.stop="remove(i)"
        >
          <i class="fas fa-times"></i>
        </button>
      </span>
      <input
        ref="input"
        v-model="search"
        :placeholder="selectedItems.length ? '' : placeholder"
        class="flex-1 min-w-[80px] bg-transparent border-none outline-none text-sm text-text-light py-1 placeholder:text-text-muted-light"
        @focus="open = true"
        @input="onInput"
        @keydown.down.prevent="highlightNext"
        @keydown.up.prevent="highlightPrev"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.backspace="onBackspace"
        @keydown.escape="open = false"
      />
    </div>

    <div
      v-if="open && filtered.length > 0"
      class="absolute z-50 mt-1 w-full bg-card-light border border-gray-200 rounded-lg shadow-lifted max-h-60 overflow-y-auto"
    >
      <div
        v-for="(opt, i) in filtered"
        :key="opt.value"
        :class="[
          'flex items-center gap-3 px-4 py-2.5 cursor-pointer text-sm transition-colors',
          isSelected(opt.value)
            ? 'bg-primary/5 text-primary'
            : i === highlightIndex
              ? 'bg-primary/10 text-primary'
              : 'text-text-light hover:bg-gray-50'
        ]"
        @click="toggle(opt)"
        @mouseenter="highlightIndex = i"
      >
        <i
          class="fas w-4 text-center text-xs"
          :class="isSelected(opt.value) ? 'fa-check-square text-primary' : 'fa-square text-gray-300'"
        ></i>
        {{ opt.label }}
      </div>
    </div>
    <div
      v-if="open && search && filtered.length === 0"
      class="absolute z-50 mt-1 w-full bg-card-light border border-gray-200 rounded-lg shadow-lifted px-4 py-3 text-sm text-text-muted-light"
    >
      No results found
    </div>
  </div>
</template>

<script>
export default {
  name: 'MultiSelect',
  props: {
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: 'Select...' },
    modelValue: { type: Array, default: () => [] },
  },
  emits: ['update:modelValue', 'change'],
  data() {
    return {
      search: '',
      open: false,
      highlightIndex: -1,
    };
  },
  computed: {
    selectedItems() {
      return this.options.filter(o => this.modelValue.includes(o.value));
    },
    filtered() {
      const q = this.search.toLowerCase();
      return this.options.filter(o => !q || o.label.toLowerCase().includes(q));
    },
  },
  methods: {
    isSelected(value) {
      return this.modelValue.includes(value);
    },
    toggle(opt) {
      const copy = [...this.modelValue];
      const idx = copy.indexOf(opt.value);
      if (idx > -1) {
        copy.splice(idx, 1);
      } else {
        copy.push(opt.value);
      }
      this.$emit('update:modelValue', copy);
      this.$emit('change', copy);
      this.search = '';
      this.highlightIndex = -1;
      this.$refs.input?.focus();
    },
    remove(index) {
      const copy = [...this.modelValue];
      copy.splice(index, 1);
      this.$emit('update:modelValue', copy);
      this.$emit('change', copy);
    },
    onInput() {
      this.highlightIndex = -1;
    },
    onBackspace() {
      if (!this.search && this.modelValue.length > 0) {
        this.remove(this.modelValue.length - 1);
      }
    },
    highlightNext() {
      if (this.highlightIndex < this.filtered.length - 1) this.highlightIndex++;
    },
    highlightPrev() {
      if (this.highlightIndex > -1) this.highlightIndex--;
    },
    selectHighlighted() {
      if (this.highlightIndex >= 0 && this.highlightIndex < this.filtered.length) {
        this.toggle(this.filtered[this.highlightIndex]);
      }
    },
    handleClickOutside(e) {
      if (this.$refs.wrapper && !this.$refs.wrapper.contains(e.target)) {
        this.open = false;
      }
    },
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  },
};
</script>
