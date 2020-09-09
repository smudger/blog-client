import { mount } from '@vue/test-utils'
import PostSummary from '~/components/PostSummary.vue'

describe('The post summary', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PostSummary, {
      stubs: ['g-link'],
      propsData: {
        post: {
          title: 'My Post',
          excerpt: 'Here is an excerpt.',
          path: '/posts/my-post',
          author: 'Joanne',
          timeToRead: 6,
          created_at: '2020-05-23T15:00:00.000Z'
        }
      }
    })
  })

  it('renders a link to the full post', () => {
    expect(wrapper.find('g-link-stub').attributes('to')).toEqual('/posts/my-post')
  })

  it('displays the post title', () => {
    expect(wrapper.html()).toEqual(expect.stringContaining('My Post'))
  })

  it('displays the post excerpt', () => {
    expect(wrapper.html()).toEqual(expect.stringContaining('Here is an excerpt.'))
  })

  it('displays the post author', () => {
    expect(wrapper.html()).toEqual(expect.stringContaining('Joanne'))
  })

  it('displays the post time to read', () => {
    expect(wrapper.html()).toEqual(expect.stringContaining('6 min read'))
  })

  it('displays the post created date', () => {
    expect(wrapper.html()).toEqual(expect.stringContaining('May 23, 2020'))
  })
})
