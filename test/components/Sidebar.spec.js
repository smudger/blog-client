import { mount } from '@vue/test-utils'
import Sidebar from '~/components/Sidebar.vue'

describe('The sidebar', () => {
  let wrapper

  beforeEach(() => {
    wrapper = mount(Sidebar, {
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

  it('links to the view post page', () => {
    expect(wrapper.findAll('g-link-stub').at(0).attributes('to')).toEqual('/posts/first-post')
    expect(wrapper.findAll('g-link-stub').at(1).attributes('to')).toEqual('/posts/second-post')
    expect(wrapper.findAll('g-link-stub').at(2).attributes('to')).toEqual('/posts/third-post')
  })
})
