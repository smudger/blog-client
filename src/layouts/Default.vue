<template>
  <div class="max-w-2xl mx-auto p-4">
    <header>
      <strong>
        <g-link
          class="text-6xl"
          to="/">
            {{ $static.metadata.siteName }}
        </g-link>
      </strong>
    </header>
    <main>
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
