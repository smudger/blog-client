<template>
    <div class="xl:flex xl:justify-around text-xl">
      <div class="mx-auto xl:mx-0  max-w-xl">
        <div id="info-box" class="max-w-xl xl:max-w-xs xl:w-full flex flex-col border rounded-lg bg-gray-900 text-gray-100 p-6 mb-6 shadow-xl">
          <h1 class="border-b-2 text-3xl mr-3 mb-3" id="title">
            {{ $page.post.title.toLowerCase() }}
          </h1>
          <p id="time_to_read">{{ $page.post.timeToRead }} mins to read</p>
          <p id="author">{{ $page.post.author.toLowerCase() }}</p>
          <p id="created_at">{{ $page.post.created_at | humanise }}</p>
          <div class="flex flex-wrap">
            <div
              class="uppercase tracking-wider font-bold text-sm mr-2 mt-4 bg-gray-100 text-gray-900 border px-2 py-1 rounded-lg"
              v-for="tag in $page.post.tags"
              :key="tag"
            >
              {{ tag }}
            </div>
          </div>
        </div>
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
import moment from 'moment'

export default {
  filters: {
    humanise (date) {
      return moment(date).fromNow()
    }
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
