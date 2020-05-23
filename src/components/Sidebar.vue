<template>
<div>
    <div
      v-for="edge in $static.allPost.edges"
      :key="edge.node.title"
    >
      <g-link
        class="hover:underline"
        :to="edge.node.title | path"
      >
        {{ edge.node.title.toLowerCase() }}
      </g-link>
    </div>
</div>
</template>

<static-query>
  query {
    allPost(sortBy: "created_at") {
      edges {
        node {
          title
        }
      }
    }
  }
</static-query>

<script>
export default {
  filters: {
    path: function (value) {
      return '/posts/' + value.toString()
        .match(/[A-Z]{2,}(?=[A-Z][a-z0-9]*|\b)|[A-Z]?[a-z0-9]*|[A-Z]|[0-9]+/g)
        .filter(Boolean)
        .map(x => x.toLowerCase())
        .join('-')
    }
  }
}
</script>
