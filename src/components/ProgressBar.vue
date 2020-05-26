<template>
    <div :style="`width: ${progress}%;`"/>
</template>

<script>
export default {
  data () {
    return {
      progress: 0
    }
  },

  mounted () {
    window.addEventListener('scroll', this.updateProgressBar)
  },

  destroyed () {
    window.removeEventListener('scroll', this.updateProgressBar)
  },

  methods: {
    updateProgressBar () {
      const scrollPosition = window.pageYOffset

      const documentHeight = document.documentElement.scrollHeight
      const windowHeight = window.innerHeight

      this.progress = 100 * scrollPosition / (documentHeight - windowHeight)
    }
  }
}
</script>
