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
        <div class="flex flex-col sm:flex-row xl:flex-col justify-between">
            <div class="flex mb-2 sm:mb-0 xl:mb-2 items-center">
                <clock-icon class="w-8 h-auto mr-2" />
                <p id="time_to_read">{{ timeToRead }} mins</p>
            </div>
            <div class="flex mb-2 sm:mb-0 xl:mb-2 items-center">
                <user-icon class="w-8 h-auto mr-2" />
                <p id="author" v-text="author.toLowerCase()"/>
            </div>
            <div class="flex items-center">
                <calendar-icon class="w-8 h-auto mr-2" />
                <p id="created_at" v-text="friendlyCreatedAt" />
            </div>
        </div>
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
import UserIcon from '~/components/icons/UserIcon.vue'
import ClockIcon from '~/components/icons/ClockIcon.vue'
import CalendarIcon from '~/components/icons/CalendarIcon.vue'

export default {
  components: {
    UserIcon,
    ClockIcon,
    CalendarIcon
  },

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
