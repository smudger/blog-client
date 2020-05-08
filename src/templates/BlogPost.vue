<template>
    <div>
        <h1 v-html="$page.blogPost.title" />
        <div v-html="$page.blogPost.content" />
    </div>
</template>

<page-query>
query ($id: ID!) {
  blogPost(id: $id) {
    title
    content
  }
}
</page-query>
