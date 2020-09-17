<template>
  <div>
    <nav>
      <div class="max-w-2xl mx-auto">
        <g-link
          class="text-6xl focus:outline-none focus:underline hover:underline tracking-tight"
          to="/">
          <h1>{{ $static.metadata.siteName }}</h1>
        </g-link>
      </div>
    </nav>
    <main class="flex-grow relative p-4">
      <slot/>
    </main>
    <footer>
      <svg role="img" aria-labelledby="footer-title footer-description" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
        <title id="footer-title">Footer</title>
        <desc id="footer-description">Footer</desc>
        <path class="fill-current" fill-opacity="1" d="M0,160L720,128L1440,64L1440,320L720,320L0,320Z"></path>
      </svg>
    </footer>
  </div>
</template>

<static-query>
  query {
    metadata {
      siteName
    }
  }
</static-query>
