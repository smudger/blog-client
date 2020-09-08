import { mount } from '@vue/test-utils'
import PostList from '~/components/PostList.vue'

describe('The post list', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(PostList, {
      stubs: ['g-link'],
      computed: {
        $static () {
          return {
            allPost: {
              edges: [
                { node: { title: 'First Post' } },
                { node: { title: 'Second Post' } },
                { node: { title: 'Third Post' } }
              ]
            }
          }
        }
      }
    })
  })

  it('can display a list of post titles', () => {
    expect(wrapper.html()).toEqual(expect.stringContaining('First Post'))
    expect(wrapper.html()).toEqual(expect.stringContaining('Second Post'))
    expect(wrapper.html()).toEqual(expect.stringContaining('Third Post'))
  })
})
