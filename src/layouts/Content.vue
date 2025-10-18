<template>
  <main class="ml-[280px] flex-1">

    <div class="pt-36 px-[120px] pb-10">
      <router-view :key="$route.fullPath"/>
    </div>
  </main>
  <!-- <div class="">
  </div> -->
</template>
<style></style>