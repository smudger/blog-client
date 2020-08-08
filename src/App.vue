<template>
  <div id="app">
    <router-view />
  </div>
</template>

<static-query>
  query {
    metadata {
      siteName
      siteDescription
    }
  }
</static-query>

<script>
import Layout from '~/layouts/Default.vue'

export default {
  components: {
    Layout
  },

  metaInfo () {
    return {
      title: this.$static.metadata.siteName,
      meta: [
        {
          key: 'description',
          name: 'description',
          content: this.$static.metadata.siteDescription
        }
      ]
    }
  }
}
</script>
