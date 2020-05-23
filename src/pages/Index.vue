<template>
  <div class="max-w-lg mx-auto text-xl">
    <sidebar/>
  </div>
</template>

<script>
import Sidebar from '~/components/Sidebar.vue'

export default {
  components: {
    Sidebar
  },

  metaInfo: {
    title: 'home'
  }
}
</script>
