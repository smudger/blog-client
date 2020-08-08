<template>
<div>
    <div
      class="flex justify-center"
      v-for="edge in $static.allPost.edges"
      :key="edge.node.title"
    >
      <g-link
        class="text-center p-2 font-semibold tracking-wide max-w-sm w-full text-gray-900 border-2 border-gray-900 rounded-md focus:outline-none focus:bg-gray-900 focus:text-gray-100 hover:outline-none hover:bg-gray-900 hover:text-gray-100"
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
