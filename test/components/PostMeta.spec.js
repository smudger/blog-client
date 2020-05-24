import { mount } from '@vue/test-utils'
import PostMeta from '../../src/components/PostMeta.vue'
import moment from 'moment'
import sinon from 'sinon'

describe('The post meta', () => {
  let wrapper, clock

  beforeEach(() => {
    clock = sinon.useFakeTimers()

    wrapper = mount(PostMeta, {
      propsData: {
        title: 'My First Post',
        timeToRead: 3,
        author: 'Blue Lou',
        created_at: moment().subtract(3, 'seconds').toJSON(),
        tags: [
          'guitar',
          'soul'
        ]
      }
    })
  })

  afterEach(() => clock.restore())

  it('can display meta information about the post', () => {
    expect(wrapper.html()).toEqual(expect.stringContaining('my first post'))
    expect(wrapper.html()).toEqual(expect.stringContaining('3 mins'))
    expect(wrapper.html()).toEqual(expect.stringContaining('blue lou'))
    expect(wrapper.html()).toEqual(expect.stringContaining('a few seconds ago'))
    expect(wrapper.html()).toEqual(expect.stringContaining('guitar'))
    expect(wrapper.html()).toEqual(expect.stringContaining('soul'))
  })

  it('keeps the created date up to date', async () => {
    expect(wrapper.html()).toEqual(expect.stringContaining('a few seconds ago'))

    clock.tick('02:00:00')
    await wrapper.vm.$nextTick()

    expect(wrapper.html()).toEqual(expect.stringContaining('2 hours ago'))
  })
})
