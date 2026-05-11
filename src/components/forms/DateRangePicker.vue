<template>
  <div class="relative" ref="wrapper">
    <div
      class="flex items-center gap-2 w-full px-4 py-2.5 rounded-lg bg-input-light border-none cursor-pointer text-sm"
      @click="open = !open"
    >
      <i class="fas fa-calendar-alt text-gray-400"></i>
      <span v-if="displayText" class="text-text-light">{{ displayText }}</span>
      <span v-else class="text-text-muted-light">Select date range...</span>
      <i class="fas fa-chevron-down text-[10px] text-gray-400 ml-auto"></i>
    </div>

    <div
      v-if="open"
      class="absolute z-50 mt-1 bg-white border border-gray-200 rounded-lg shadow-lifted p-4 w-[340px]"
    >
      <div class="flex items-center justify-between mb-3">
        <button
          type="button"
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600"
          @click="prevMonth"
        >
          <i class="fas fa-chevron-left text-sm"></i>
        </button>
        <span class="text-sm font-semibold text-gray-800">{{ monthYearDisplay }}</span>
        <button
          type="button"
          class="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100 text-gray-600"
          @click="nextMonth"
        >
          <i class="fas fa-chevron-right text-sm"></i>
        </button>
      </div>

      <div class="grid grid-cols-7 gap-1 mb-1">
        <div
          v-for="d in dayHeaders"
          :key="d"
          class="text-center text-xs font-medium text-gray-400 py-1"
        >
          {{ d }}
        </div>
      </div>

      <div class="grid grid-cols-7 gap-1">
        <button
          v-for="(day, i) in calendarDays"
          :key="i"
          type="button"
          :disabled="!day"
          :class="dayClass(day)"
          @click="selectDay(day)"
        >
          {{ day || '' }}
        </button>
      </div>

      <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
        <button
          type="button"
          class="text-xs text-gray-500 hover:text-gray-700"
          @click="clear"
        >
          Clear
        </button>
        <button
          type="button"
          class="text-xs font-medium text-primary hover:text-primary/80"
          @click="open = false"
        >
          Done
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'DateRangePicker',
  props: {
    startDate: { type: String, default: null },
    endDate: { type: String, default: null },
  },
  emits: ['update:startDate', 'update:endDate', 'change'],
  data() {
    return {
      open: false,
      currentMonth: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      selectingStart: true,
      dayHeaders: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'],
      localStart: this.startDate || null,
      localEnd: this.endDate || null,
    };
  },
  computed: {
    monthYearDisplay() {
      const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
      return `${months[this.currentMonth]} ${this.currentYear}`;
    },
    calendarDays() {
      const firstDay = new Date(this.currentYear, this.currentMonth, 1).getDay();
      const daysInMonth = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();
      const days = [];
      for (let i = 0; i < firstDay; i++) days.push(null);
      for (let d = 1; d <= daysInMonth; d++) days.push(d);
      return days;
    },
    displayText() {
      if (!this.localStart) return '';
      const fmt = (d) => {
        const date = new Date(d + 'T00:00:00');
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
      };
      if (this.localStart && this.localEnd) return `${fmt(this.localStart)} — ${fmt(this.localEnd)}`;
      if (this.localStart) return `From ${fmt(this.localStart)}`;
      return '';
    },
  },
  watch: {
    startDate(val) { this.localStart = val; },
    endDate(val) { this.localEnd = val; },
  },
  methods: {
    prevMonth() {
      if (this.currentMonth === 0) {
        this.currentMonth = 11;
        this.currentYear--;
      } else {
        this.currentMonth--;
      }
    },
    nextMonth() {
      if (this.currentMonth === 11) {
        this.currentMonth = 0;
        this.currentYear++;
      } else {
        this.currentMonth++;
      }
    },
    dateStr(day) {
      return `${this.currentYear}-${String(this.currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    },
    isInRange(day) {
      if (!day || !this.localStart) return false;
      const d = this.dateStr(day);
      if (this.localStart && this.localEnd) {
        return d >= this.localStart && d <= this.localEnd;
      }
      return d === this.localStart;
    },
    isRangeStart(day) {
      if (!day || !this.localStart) return false;
      return this.dateStr(day) === this.localStart;
    },
    isRangeEnd(day) {
      if (!day || !this.localEnd) return false;
      return this.dateStr(day) === this.localEnd;
    },
    isToday(day) {
      if (!day) return false;
      const today = new Date();
      return today.getFullYear() === this.currentYear &&
        today.getMonth() === this.currentMonth &&
        today.getDate() === day;
    },
    dayClass(day) {
      if (!day) return 'invisible';
      const classes = ['w-9 h-9 text-sm rounded-full flex items-center justify-center transition-colors'];

      if (this.isRangeStart(day) || this.isRangeEnd(day)) {
        classes.push('bg-primary text-white font-medium');
      } else if (this.isInRange(day)) {
        classes.push('bg-primary/10 text-primary');
      } else if (this.isToday(day)) {
        classes.push('text-primary font-medium hover:bg-gray-100');
      } else {
        classes.push('text-gray-700 hover:bg-gray-100');
      }

      return classes.join(' ');
    },
    selectDay(day) {
      if (!day) return;
      const d = this.dateStr(day);

      if (!this.localStart || (this.localStart && this.localEnd)) {
        this.localStart = d;
        this.localEnd = null;
      } else {
        if (d < this.localStart) {
          this.localStart = d;
          this.localEnd = null;
        } else if (d === this.localStart) {
          this.localStart = null;
          this.localEnd = null;
        } else {
          this.localEnd = d;
        }
      }

      this.$emit('update:startDate', this.localStart);
      this.$emit('update:endDate', this.localEnd);
      this.$emit('change', { start: this.localStart, end: this.localEnd });
    },
    clear() {
      this.localStart = null;
      this.localEnd = null;
      this.$emit('update:startDate', null);
      this.$emit('update:endDate', null);
      this.$emit('change', { start: null, end: null });
      this.open = false;
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
