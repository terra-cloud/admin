<template>
  <div class="bg-white rounded-xl shadow-soft p-4 space-y-4">
    <div class="flex flex-col sm:flex-row gap-3">
      <div class="relative flex-1 min-w-0">
        <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-sm text-text-muted-light">search</span>
        <input
          :value="searchQuery"
          type="text"
          placeholder="Search by booking ID, plate number, lessee name, or phone..."
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
        <option value="active">Active</option>
        <option value="pending">Pending</option>
        <option value="completed">Completed</option>
        <option value="cancelled">Cancelled</option>
      </select>
      <select
        :value="filterDriveType"
        class="px-3 py-2.5 bg-input-light border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30 text-text-muted-light"
        @change="$emit('update:filterDriveType', $event.target.value)"
      >
        <option value="">All Drive Types</option>
        <option value="selfDrive">Self Drive</option>
        <option value="withDriver">With Driver</option>
      </select>
      <select
        :value="filterVehicleType"
        class="px-3 py-2.5 bg-input-light border-none rounded-lg text-sm outline-none focus:ring-2 focus:ring-primary/30 text-text-muted-light"
        @change="$emit('update:filterVehicleType', $event.target.value)"
      >
        <option value="">All Vehicle Types</option>
        <option value="motorcycle">Motorcycle</option>
        <option value="scooter">Scooter</option>
        <option value="car">Car</option>
        <option value="suv">SUV</option>
        <option value="van">Van</option>
        <option value="truck">Truck</option>
      </select>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    searchQuery: { type: String, default: '' },
    filterStatus: { type: String, default: '' },
    filterDriveType: { type: String, default: '' },
    filterVehicleType: { type: String, default: '' }
  },
  emits: ['update:searchQuery', 'update:filterStatus', 'update:filterDriveType', 'update:filterVehicleType']
};
</script>
