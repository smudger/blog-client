<template>
  <Layout>
    <div class="sm:text-center mb-4 sm:mb-6 lg:mb-8">
      <h3 class="mt-2 text-4xl leading-8 font-extrabold tracking-tight text-gray-900 xs:text-4xl sm:text-5xl sm:leading-10">
        Latest from the <span class="text-pink-600">Smudgeblog</span>
      </h3>
      <p class="mt-4 max-w-2xl text-xl leading-7 text-gray-700 sm:mx-auto">
        Keep up with the various programming topics I've found interesting recently. Expect guides, musings and general fluff.
      </p>
    </div>
    <post-list />
  </Layout>
</template>

<script>
import PostList from '~/components/PostList.vue'

export default {
  components: {
    PostList
  },

  metaInfo: {
    title: 'home'
  }
}
</script>
