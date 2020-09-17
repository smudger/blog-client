<template>
  <div class="min-h-screen overflow-x-hidden">
    <nav class="mb-4">
      <svg class="h-32" x="0" y="0" role="img" aria-labelledby="navbar-title navbar-description" xmlns="http://www.w3.org/2000/svg" viewBox="0 100 1440 130" preserveAspectRatio="xMinYMid slice">
        <title id="navbar-title">Navbar</title>
        <desc id="navbar-description">Navbar</desc>
        <path class="fill-current" fill-opacity="1" d="M0,224L720,128L1440,96L1440,0L720,0L0,0Z"></path>
      </svg>
      <g-link class="absolute top-0" to="/">
        <img class="ml-4 mt-4 w-20" src="/favicon.svg" alt="Go to homepage">
      </g-link>
    </nav>
    <main class="p-4">
      <slot/>
    </main>
    <footer>
      <svg class="h-64" x="0" y="0" role="img" aria-labelledby="footer-title footer-description" xmlns="http://www.w3.org/2000/svg" viewBox="0 50 1440 200" preserveAspectRatio="xMinYMid slice">
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
