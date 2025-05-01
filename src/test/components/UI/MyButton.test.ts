


// @vitest-environment happy-dom
import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import MyButton from "../../../components/UI/MyButton.vue";
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'  // path to your component

describe('MyButton.vue', () => {
    const wrapper = mount(MyButton, {
      props: {
        label: 'Click Me',
        type: 'submit',
        color: 'success'  // This should map to severity="success" on the Button
      },
      global: {
        // Install PrimeVue plugin and register the Button component locally
        plugins: [PrimeVue],
        components: { Button },
        // Stub the ripple directive to avoid errors in the test DOM
        directives: {
          ripple: {}
        }
      }
    })
  it('renders PrimeVue Button with correct props and attributes', () => {

    // The PrimeVue Button component should be rendered
    const buttonWrapper = wrapper.findComponent(Button)
    expect(buttonWrapper.exists()).toBe(true)

    // Its props should reflect the passed values (color → severity)
    expect(wrapper.props('label')).toBe('Click Me')
    expect(wrapper.props('type')).toBe('submit')
    expect(wrapper.props('color')).toBe('success')

    // Check the rendered <button> element in the DOM
    const buttonEl = wrapper.find('button')
    expect(buttonEl.exists()).toBe(true)
    expect(buttonEl.attributes('type')).toBe('submit')
    expect(buttonEl.text()).toBe('Click Me')
    // The severity prop should add the corresponding class (e.g. p-button-success)
    expect(buttonEl.classes()).toContain('p-button-success')
  })
  
  it('if button click', async()=>{
  
      await wrapper.get('button').trigger('click')
  
      const emitted = wrapper.emitted('click')
  
      expect(emitted).toHaveLength(1);
    //   expect(emitted[0][0]).toBeInstanceOf(Event);
  }) 
})


