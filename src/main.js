// This is the main.js file. Import global CSS and scripts here.
// The Client API can be used here. Learn more: gridsome.org/docs/client-api
import Layout from '~/layouts/Default.vue'
require('~/main.css')

export default function (Vue, { router, head, isClient }) {
  Vue.component('Layout', Layout)

  head.link.push({
    rel: 'mask-icon',
    href: '/favicon.svg'
  })

  head.bodyAttrs = { class: 'bg-gray-100 font-sans text-base text-gray-900' }
}
