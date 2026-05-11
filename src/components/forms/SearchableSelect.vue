<template>
  <div class="relative" ref="wrapper">
    <div class="relative flex items-center">
      <span v-if="icon" class="material-symbols-outlined absolute left-4 text-text-muted-light dark:text-text-muted-dark text-base pointer-events-none">{{ icon }}</span>
      <input
        ref="input"
        v-model="search"
        :placeholder="placeholder"
        :disabled="disabled"
        class="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-lg text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary/50 border-none bg-input-light dark:bg-input-dark h-14 placeholder:text-text-muted-light dark:placeholder:text-text-muted-dark text-base font-normal shadow-soft"
        :class="icon ? 'pl-12 pr-10' : 'pl-4 pr-10'"
        @focus="open = true"
        @input="onInput"
        @keydown.down.prevent="highlightNext"
        @keydown.up.prevent="highlightPrev"
        @keydown.enter.prevent="selectHighlighted"
        @keydown.escape="open = false"
      />
      <button v-if="selected && !open" type="button" class="absolute right-3 text-text-muted-light dark:text-text-muted-dark cursor-pointer text-sm hover:text-primary" @click="clear">
        <span class="material-symbols-outlined text-base">close</span>
      </button>
      <span v-else class="material-symbols-outlined absolute right-3 text-text-muted-light dark:text-text-muted-dark text-base pointer-events-none">arrow_drop_down</span>
    </div>
    <div
      v-if="open && filtered.length > 0"
      class="absolute z-50 mt-1 w-full bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-lg shadow-lifted max-h-60 overflow-y-auto"
    >
      <div
        v-for="(opt, i) in filtered"
        :key="opt.id"
        :class="[
          'px-4 py-3 cursor-pointer text-sm transition-colors',
          i === highlightIndex ? 'bg-primary/10 text-primary' : 'text-text-light dark:text-text-dark hover:bg-gray-50 dark:hover:bg-gray-800'
        ]"
        @click="select(opt)"
        @mouseenter="highlightIndex = i"
      >
        {{ opt.display_name || opt.name }}
      </div>
    </div>
    <div
      v-if="open && search && filtered.length === 0 && !loading"
      class="absolute z-50 mt-1 w-full bg-card-light dark:bg-card-dark border border-gray-200 dark:border-gray-700 rounded-lg shadow-lifted px-4 py-3 text-sm text-text-muted-light dark:text-text-muted-dark"
    >
      No results found
    </div>
  </div>
</template>

<script>
export default {
  name: 'SearchableSelect',
  props: {
    options: { type: Array, default: () => [] },
    placeholder: { type: String, default: 'Search...' },
    icon: { type: String, default: '' },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    modelValue: { type: [String, Number], default: null },
  },
  emits: ['update:modelValue', 'change', 'search'],
  data() {
    return {
      search: '',
      open: false,
      highlightIndex: -1,
      selected: null,
    };
  },
  computed: {
    filtered() {
      if (!this.search) return this.options;
      const q = this.search.toLowerCase();
      return this.options.filter(o => (o.display_name || o.name).toLowerCase().includes(q));
    },
  },
  watch: {
    options: {
      handler() {
        if (this.selected && !this.options.some(o => o.id === this.selected.id)) {
          this.selected = null;
        }
        if (this.modelValue && !this.selected) {
          const match = this.options.find(o => o.id === this.modelValue);
          if (match) {
            this.selected = match;
            this.search = match.display_name || match.name;
          }
        }
      },
    },
    modelValue: {
      handler(val) {
        if (val && !this.selected) {
          const match = this.options.find(o => o.id === val);
          if (match) {
            this.selected = match;
            this.search = match.display_name || match.name;
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    onInput() {
      this.selected = null;
      this.highlightIndex = -1;
      this.$emit('search', this.search);
    },
    select(opt) {
      this.selected = opt;
      this.search = opt.display_name || opt.name;
      this.open = false;
      this.$emit('update:modelValue', opt.id);
      this.$emit('change', opt);
    },
    clear() {
      this.selected = null;
      this.search = '';
      this.$emit('update:modelValue', null);
      this.$emit('change', null);
      this.$refs.input?.focus();
    },
    highlightNext() {
      if (this.highlightIndex < this.filtered.length - 1) this.highlightIndex++;
    },
    highlightPrev() {
      if (this.highlightIndex > -1) this.highlightIndex--;
    },
    selectHighlighted() {
      if (this.highlightIndex >= 0 && this.highlightIndex < this.filtered.length) {
        this.select(this.filtered[this.highlightIndex]);
      }
    },
    handleClickOutside(e) {
      if (this.$refs.wrapper && !this.$refs.wrapper.contains(e.target)) {
        this.open = false;
        if (!this.selected && this.search) this.search = '';
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
