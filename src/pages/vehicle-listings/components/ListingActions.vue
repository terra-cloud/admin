<template>
  <div class="relative" ref="dropdownRef">
    <button
      class="p-1.5 rounded-lg hover:bg-gray-100 transition-colors text-text-muted-light hover:text-text-light"
      @click.stop="toggleMenu"
      aria-label="Actions"
    >
      <span class="material-symbols-outlined text-xl">more_vert</span>
    </button>
    <div
      v-if="isOpen"
      class="absolute right-0 top-full mt-1 z-50 w-56 rounded-xl bg-white shadow-lifted border border-gray-100 py-1.5"
      @click.stop
    >
      <button
        class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-light hover:bg-gray-50 transition-colors text-left"
        @click="emitAction('view')"
      >
        <span class="material-symbols-outlined text-lg text-text-muted-light">visibility</span>
        View Listing
      </button>
      <div class="h-px bg-gray-100 my-1"></div>
      <button
        v-if="canApprove"
        class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-700 hover:bg-emerald-50 transition-colors text-left"
        @click="emitAction('approve')"
      >
        <span class="material-symbols-outlined text-lg text-emerald-500">check_circle</span>
        Approve Listing
      </button>
      <button
        v-if="canSuspend"
        class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-amber-700 hover:bg-amber-50 transition-colors text-left"
        @click="emitAction('suspend')"
      >
        <span class="material-symbols-outlined text-lg text-amber-500">block</span>
        Suspend Listing
      </button>
      <button
        v-if="canActivate"
        class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-blue-700 hover:bg-blue-50 transition-colors text-left"
        @click="emitAction('activate')"
      >
        <span class="material-symbols-outlined text-lg text-blue-500">play_circle</span>
        Activate Listing
      </button>
      <button
        v-if="canArchive"
        class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-light hover:bg-gray-50 transition-colors text-left"
        @click="emitAction('archive')"
      >
        <span class="material-symbols-outlined text-lg text-text-muted-light">archive</span>
        Archive Listing
      </button>
      <div class="h-px bg-gray-100 my-1"></div>
      <button
        class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-700 hover:bg-red-50 transition-colors text-left"
        @click="emitAction('delete')"
      >
        <span class="material-symbols-outlined text-lg text-red-500">delete</span>
        Delete Listing
      </button>
      <div class="h-px bg-gray-100 my-1"></div>
      <button
        class="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-text-light hover:bg-gray-50 transition-colors text-left"
        @click="emitAction('viewOwner')"
      >
        <span class="material-symbols-outlined text-lg text-text-muted-light">person</span>
        View Owner
      </button>
    </div>
  </div>
</template>

<script>
import { formatText } from '@/utils/format';
export default {
  name: 'ListingActions',
  props: {
    listing: {
      type: Object,
      required: true
    }
  },
  emits: ['action'],
  data() {
    return {
      isOpen: false,
    };
  },
  computed: {
    status() {
      return (this.listing.status || '').toLowerCase();
    },
    isSuspended() {
      return this.listing.is_suspended === true;
    },
    isAvailable() {
      return this.listing.isAvailable;
    },
    canApprove() {
      return this.status === 'pending';
    },
    canSuspend() {
      return (this.status === 'active' || this.status === 'pending') && !this.isSuspended;
    },
    canActivate() {
      return this.status === 'suspended' || this.isSuspended || this.status === 'archived';
    },
    canArchive() {
      return this.status === 'active' || this.status === 'pending';
    }
  },
  methods: {
    formatText,
    toggleMenu() {
      this.isOpen = !this.isOpen;
    },
    handleClickOutside(e) {
      if (this.$refs.dropdownRef && !this.$refs.dropdownRef.contains(e.target)) {
        this.isOpen = false;
      }
    },
    emitAction(action) {
      this.isOpen = false;
      this.$emit('action', { action, listing: this.listing });
    }
  },
  mounted() {
    document.addEventListener('click', this.handleClickOutside);
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside);
  }
};
</script>

<style scoped>
@reference "tailwindcss";
</style>
