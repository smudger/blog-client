<template>
  <div class="max-w-2xl mx-auto p-4">
    <header class="flex justify-between">
      <strong>
        <g-link
          class="mr-2 hover:underline"
          to="/">
            {{ $static.metadata.siteName }}
        </g-link>
      </strong>
      <nav class="nav">
        <g-link class="mr-2 hover:underline" to="/posts/test-post">test post</g-link>
      </nav>
    </header>
    <main class="mt-8">
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
