<template>
  <div
    v-if="mobileSidebarOpen"
    class="fixed inset-0 bg-black/50 z-40 lg:hidden"
    @click="$emit('toggle-sidebar')"
  />
  <aside
    class="fixed left-0 top-0 h-full bg-slate-800 transition-all duration-300 font-display flex flex-col z-50 lg:z-30"
    :class="[
      sidebarOpen ? 'lg:w-64' : 'lg:w-[70px]',
      'w-64',
      mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full',
      'lg:translate-x-0'
    ]"
  >
    <div class="flex items-center px-4 h-16 border-b border-slate-700 shrink-0">
      <i class="fas fa-tachometer-alt text-primary text-xl"></i>
      <span v-show="sidebarOpen" class="ml-3 text-white font-semibold text-lg whitespace-nowrap">Admin Panel</span>
    </div>
    <nav class="mt-4 flex-1 space-y-1">
      <router-link
        to="/dashboard"
        class="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors mx-2 rounded-lg"
        active-class="bg-primary/10 text-primary hover:text-primary"
      >
        <i class="fas fa-home w-5 text-center"></i>
        <span v-show="sidebarOpen" class="whitespace-nowrap">Dashboard</span>
      </router-link>
      <router-link
        to="/job-postings"
        class="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors mx-2 rounded-lg"
        active-class="bg-primary/10 text-primary hover:text-primary"
      >
        <i class="fas fa-briefcase w-5 text-center"></i>
        <span v-show="sidebarOpen" class="whitespace-nowrap">Job Posting</span>
      </router-link>
      <router-link
        to="/users"
        class="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors mx-2 rounded-lg"
        active-class="bg-primary/10 text-primary hover:text-primary"
      >
        <i class="fas fa-users w-5 text-center"></i>
        <span v-show="sidebarOpen" class="whitespace-nowrap">Users</span>
      </router-link>
      <router-link
        to="/admins"
        class="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors mx-2 rounded-lg"
        active-class="bg-primary/10 text-primary hover:text-primary"
      >
        <i class="fas fa-user-shield w-5 text-center"></i>
        <span v-show="sidebarOpen" class="whitespace-nowrap">Admins</span>
      </router-link>
      <router-link
        to="/news"
        class="flex items-center gap-3 px-4 py-3 text-slate-300 hover:bg-slate-700 hover:text-white transition-colors mx-2 rounded-lg"
        active-class="bg-primary/10 text-primary hover:text-primary"
      >
        <i class="fas fa-newspaper w-5 text-center"></i>
        <span v-show="sidebarOpen" class="whitespace-nowrap">News</span>
      </router-link>
    </nav>
  </aside>
</template>

<script>
export default {
  props: ['sidebarOpen', 'mobileSidebarOpen'],
  emits: ['toggle-sidebar'],
};
</script>
