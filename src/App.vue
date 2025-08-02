<template>  
  <component :is="layout"></component>
</template>
<script>
export default {
name: 'App',
  data(){
    return {
      layout: 'LayoutAuth'
    }
  },
  watch: {
    '$route.meta.layout': {
      handler(val){
        this.layout = val || 'LayoutAuth'
      },
      immediate: true,
      deep: true
    }
  }
}
</script>