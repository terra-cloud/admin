<template>
  <div class="max-w-3xl mx-auto px-4 sm:px-6">
    <div class="py-6">
      <h1 class="text-2xl font-semibold text-text-primary mb-6">Profile</h1>

      <div class="border-b border-gray-200 mb-6">
        <nav class="flex gap-6">
          <router-link
            :to="{ name: 'profileInformation' }"
            class="pb-3 text-sm font-medium border-b-2 transition-colors inline-flex items-center"
            :class="$route.name === 'profileInformation'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-text-muted-light hover:text-text-light hover:border-gray-300'"
          >
            <i class="fas fa-info-circle mr-2"></i> Information
          </router-link>
          <router-link
            :to="{ name: 'profileSecurity' }"
            class="pb-3 text-sm font-medium border-b-2 transition-colors inline-flex items-center"
            :class="$route.name === 'profileSecurity'
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-text-muted-light hover:text-text-light hover:border-gray-300'"
          >
            <i class="fas fa-shield-alt mr-2"></i> Security
          </router-link>
        </nav>
      </div>

      <router-view />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Profile',
};
</script>
