<template>
  <div class="p-4">
    <header class="max-w-2xl mx-auto">
      <strong>
        <g-link
          class="text-6xl focus:outline-none focus:underline"
          to="/">
            {{ $static.metadata.siteName }}
        </g-link>
      </strong>
    </header>
    <main class="relative">
      <slot/>
    </main>
  </div>
</template>

<static-query>
  query {
    metadata {
      siteName
    }
  }
</static-query>
