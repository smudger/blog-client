<template>
    <div>
      <div class="flex justify-between">
        <h1 class="underline">
          {{ $page.post.title.toLowerCase() }}
        </h1>
        <p>{{ $page.post.author.toLowerCase() }}</p>
      </div>
      <div v-html="$page.post.content" />
    </div>
</template>

<page-query>
  query($id: ID!) {
    post(id: $id) {
      author
      title
      content
    }
  }
</page-query>

<style>
blockquote {
  @apply border-l-4 rounded pl-4 my-2;
}
pre {
  @apply bg-gray-900 rounded-lg px-4 py-2 text-base bg-opacity-75 my-2;
}
</style>
