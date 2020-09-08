<template>
  <Layout>
    <post-list />
  </Layout>
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
