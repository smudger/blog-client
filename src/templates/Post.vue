<template>
    <div>
        <h1>
          {{ $page.post.title}} | {{ $page.post.author }}
        </h1>
        <div v-html="$page.post.content" />
    </div>
</template>

<page-query>
query ($id: ID!) {
  post(id: $id) {
    author
    title
    content
  }
}
</page-query>
