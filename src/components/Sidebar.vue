<template>
<div>
    <div
      class="flex justify-center"
      v-for="edge in $static.allPost.edges"
      :key="edge.node.title"
    >
      <g-link
        class="text-center text-2xl font-bold tracking-wide lowercase mb-4 max-w-sm w-full bg-gray-900 p-8 text-gray-100 border-4 border-transparent rounded focus:border-gray-900 focus:outline-none focus:bg-gray-100 focus:text-gray-900 hover:border-gray-900 hover:outline-none hover:bg-gray-100 hover:text-gray-900"
        :to="edge.node.title | path"
      >
        {{ edge.node.title }}
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
