<template>
  <div class="bg-white rounded-2xl shadow-soft p-5 border border-gray-100/50">
    <h3 class="text-sm font-semibold text-text-light mb-4 flex items-center gap-2">
      <span class="material-symbols-outlined text-primary text-lg">person</span>
      User Information
    </h3>
    <div class="flex items-center gap-4 mb-4">
      <img
        v-if="user?.profileImage"
        :src="user.profileImage"
        class="w-14 h-14 rounded-full object-cover shrink-0"
        alt=""
      />
      <div v-else class="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg shrink-0">
        {{ initials }}
      </div>
      <div>
        <p class="text-base font-semibold text-text-light">{{ fullName }}</p>
        <p v-if="user?.email" class="text-sm text-text-muted-light">{{ user.email }}</p>
      </div>
    </div>
    <div class="space-y-3 border-t border-gray-100 pt-4">
      <div v-if="user?.phoneNumber" class="flex items-center gap-2">
        <span class="material-symbols-outlined text-text-muted-light text-lg">phone</span>
        <div>
          <p class="text-xs text-text-muted-light">Phone</p>
          <p class="text-sm text-text-light">{{ user.phoneNumber }}</p>
        </div>
      </div>
      <div v-if="userId" class="flex items-center gap-2">
        <span class="material-symbols-outlined text-text-muted-light text-lg">badge</span>
        <div>
          <p class="text-xs text-text-muted-light">User ID</p>
          <p class="text-sm text-text-light font-mono text-xs">{{ userId }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    user: { type: Object, default: () => ({}) },
    userId: { type: String, default: '' }
  },
  computed: {
    fullName() {
      const user = this.user;
      if (!user) return '—';
      return [user.firstname, user.lastname].filter(Boolean).join(' ') || '—';
    },
    initials() {
      const user = this.user;
      const first = (user?.firstname || '?')[0];
      const last = (user?.lastname || '?')[0];
      return (first + last).toUpperCase();
    }
  }
};
</script>
