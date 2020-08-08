<template>
<div>
    <div class="p-2 md:p-0 md:pl-4 h-full text-center md:text-left">
        <div class="z-10 md:absolute h-full flex flex-col justify-center items-center md:items-start">
            <h1 class="tracking-wide text-4xl mb-6">
                Page Not Found
            </h1>

            <p class="text-gray-900 mb-8 text-xl leading-normal font-light">
                There's nothing here but empty space.
            </p>

            <g-link
                class="text-center p-2 font-semibold tracking-wide uppercase max-w-xs w-full text-gray-900 border-2 border-gray-900 rounded-md focus:outline-none focus:bg-gray-900 focus:text-gray-100 hover:outline-none hover:bg-gray-900 hover:text-gray-100"
                to="/"
            >
                Take Me Home
            </g-link>
        </div>
    </div>
    <div class="hidden md:block overflow-hidden fixed w-full" id="animation"></div>
</div>
</template>

<script>
import lottie from 'lottie-web'

export default {
  mounted () {
    lottie.loadAnimation({
      container: document.getElementById('animation'),
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/animations/404.json'
    })
  }
}
</script>
