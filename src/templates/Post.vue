<template>
    <div class="xl:flex xl:justify-around text-xl">
      <div class="mx-auto xl:mx-0 max-w-xl">
        <post-meta
          class="xl:max-w-xs xl:w-full"
          :title="$page.post.title"
          :timeToRead="$page.post.timeToRead"
          :author="$page.post.author"
          :created_at="$page.post.created_at"
          :tags="$page.post.tags"
        />
      </div>
      <div
        id="content"
        class="leading-relaxed mx-auto xl:mx-0 max-w-xl"
        v-html="$page.post.content"
      />
    <div class="max-w-xl xl:max-w-xs xl:w-full">
    </div>
  </div>
</template>

<script>
import PostMeta from '~/components/PostMeta.vue'

export default {
  components: {
    PostMeta
  }
}
</script>

<page-query>
  query($id: ID!) {
    post(id: $id) {
      author
      created_at
      title
      content
      tags
      timeToRead
    }
  }
</page-query>

<style>
  #content a {
    @apply underline;
  }
  #content blockquote {
    @apply border-l-4 border-gray-800 rounded pl-4 mb-6;
  }
  #content p {
    @apply pb-6;
  }
  #content pre {
    @apply bg-gray-900 text-gray-100 rounded-lg px-4 py-2 text-base mb-6;
  }
</style>
