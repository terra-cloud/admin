<template>
  <v-app class="rounded rounded-md" style="background: #f6f6f6;">
    <LeftSidebar />

    <Header />

    <Content />
  </v-app>
</template>
<script>
  export default {
    computed: {
      cols () {
        const { lg, sm } = this.$vuetify.display
        return lg ? [3, 9]
          : sm ? [9, 3]
            : [6, 6]
      },

    },
  }
</script>