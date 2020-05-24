<template>
    <div
        id="info-box"
        class="max-w-xl flex flex-col border rounded-lg bg-gray-900 text-gray-100 p-6 mb-6 shadow-xl"
    >
        <h1
            id="title"
            class="border-b-2 text-3xl mr-3 mb-3"
            v-text="title.toLowerCase()"
        />
        <p id="time_to_read">{{ timeToRead }} mins to read</p>
        <p id="author" v-text="author.toLowerCase()" />
        <p id="created_at" v-text="friendlyCreatedAt" />
        <div class="flex flex-wrap">
            <div
                class="uppercase tracking-wider font-bold text-sm mr-2 mt-4 bg-gray-100 text-gray-900 border px-2 py-1 rounded-lg"
                v-for="tag in tags"
                :key="tag"
                v-text="tag"
            />
        </div>
    </div>
</template>

<script>
import moment from 'moment'

export default {
  props: {
    title: String,
    timeToRead: Number,
    author: String,
    created_at: String,
    tags: Array
  },

  data () {
    return { now: new Date() }
  },

  computed: {
    friendlyCreatedAt () {
      return moment(this.created_at).from(this.now)
    }
  },

  created () {
    setInterval(() => {
      this.now = new Date()
    }, 30000)
  }
}
</script>
