<template>
    <div class="shadow-lg p-8 border-transparent rounded-lg flex flex-col bg-white">
        <g-link
            class="font-semibold mb-4 text-2xl focus:outline-none focus:underline hover:underline"
            :to="post.path"
        >
            {{ post.title }}
        </g-link>
        <p class="text-gray-700 text-opacity-75 mb-8 text-xl font-light tracking-tight">{{ post.excerpt }}</p>
        <div class="flex items-center text-base">
            <g-image class="rounded-full w-12 h-12 mr-4 shadow-inner" src="~/assets/img/smudger.png" alt="smudger" blur=2000 />
            <div>
                <p class="font-normal leading-snug">{{ post.author }}</p>
                <p class="text-gray-700 text-opacity-75 font-light leading-snug">{{ formattedCreatedAt }} • {{ post.timeToRead }} min read</p>
            </div>
        </div>
    </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    post: {
      type: Object,
      required: true
    }
  },

  computed: {
    formattedCreatedAt () {
      return moment(this.post.created_at).format('MMM DD, YYYY')
    }
  }

}
</script>
