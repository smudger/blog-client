<template>
  <div class="flex">
    <sidebar/>
    <div>
      <p>
        a small collection of idle musings.
      </p>
    </div>
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
