<template>
<div class="flex flex-wrap justify-center xl:justify-start">
  <div
    class="max-w-lg xl:w-1/3"
    v-for="edge in $static.allPost.edges"
    :key="edge.node.title"
  >
    <post-summary
      class="m-4"
      :post="edge.node"
    />
  </div>
</div>
</template>

<static-query>
  query {
    allPost(sortBy: "created_at", filter: { is_live: { eq: true } }) {
      edges {
        node {
          title
          excerpt
          path
          author
          timeToRead
          created_at
          category
        }
      }
    }
  }
</static-query>

<script>
import PostSummary from '~/components/PostSummary.vue'

export default {
  components: {
    PostSummary
  }
}
</script>
