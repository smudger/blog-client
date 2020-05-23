<template>
    <div class="max-w-lg mx-auto text-xl">
      <div class="flex justify-between">
        <h1 id="title" class="underline">
          {{ $page.post.title.toLowerCase() }}
        </h1>
        <p id="author">{{ $page.post.author.toLowerCase() }}</p>
      </div>
      <div
        id="content"
        class="leading-relaxed"
        v-html="$page.post.content"
      />
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
  #content a {
    @apply underline;
  }
  #content blockquote {
    @apply border-l-4 rounded pl-4 my-2;
  }
  #content p {
    @apply pb-6;
  }
  #content pre {
    @apply bg-gray-900 rounded-lg px-4 py-2 text-base bg-opacity-75 my-2;
  }
</style>
