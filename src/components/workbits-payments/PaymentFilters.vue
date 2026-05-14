<template>
  <div class="bg-white rounded-xl shadow-soft p-4 space-y-4">
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1 min-w-0">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted-light">search</span>
        <input
          :value="searchQuery"
          type="text"
          placeholder="Search by invoice ID, payment ID, user name, or email..."
          class="w-full pl-9 pr-3 py-2.5 bg-input-light border-none rounded-lg text-sm placeholder:text-text-muted-light focus:ring-2 focus:ring-primary/30 outline-none"
          @input="$emit('update:searchQuery', $event.target.value)"
        />
      </div>
      <select
        :value="filterStatus"
        class="px-3 py-2.5 bg-input-light border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30 text-text-muted-light"
        @change="$emit('update:filterStatus', $event.target.value)"
      >
        <option value="">All Statuses</option>
        <option value="PAID">Paid</option>
        <option value="PENDING">Pending</option>
        <option value="FAILED">Failed</option>
        <option value="EXPIRED">Expired</option>
      </select>
      <select
        :value="filterType"
        class="px-3 py-2.5 bg-input-light border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30 text-text-muted-light"
        @change="$emit('update:filterType', $event.target.value)"
      >
        <option value="">All Types</option>
        <option value="add_fund">Add Fund</option>
        <option value="subscription">Subscription</option>
        <option value="withdrawal">Withdrawal</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    searchQuery: { type: String, default: '' },
    filterStatus: { type: String, default: '' },
    filterType: { type: String, default: '' }
  },
  emits: ['update:searchQuery', 'update:filterStatus', 'update:filterType']
};
</script>
