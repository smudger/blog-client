<template>
  <div class="flex flex-col min-h-screen">
    <header class="border-t-8 border-gray-900">
      <div class="max-w-2xl mx-auto">
        <strong>
          <g-link
            class="text-6xl focus:outline-none focus:underline hover:underline tracking-tight"
            to="/">
              {{ $static.metadata.siteName }}
          </g-link>
        </strong>
      </div>
    </header>
    <main class="flex-grow relative p-4">
      <slot/>
    </main>
    <footer>
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320"><path class="fill-current" fill-opacity="1" d="M0,160L720,128L1440,64L1440,320L720,320L0,320Z"></path></svg>
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
