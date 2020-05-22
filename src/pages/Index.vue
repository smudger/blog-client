<template>
  <div class="flex">
    <post-list/>
    <div>
      <p>
        a small collection of idle musings.
      </p>
    </div>
  </div>
</template>

<script>
import PostList from '~/components/PostList.vue'

export default {
  components: {
    PostList
  },

  metaInfo: {
    title: 'home'
  }
}
</script>
