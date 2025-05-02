import { mount } from '@vue/test-utils'
import { describe, it, expect } from 'vitest'

import MyButton from "../../../components/UI/MyButton.vue";
import PrimeVue from 'primevue/config'
import Button from 'primevue/button'  

describe('MyButton.vue', () => {
    const wrapper = mount(MyButton, {
      props: {
        label: 'Click Me',
        type: 'submit',
        color: 'success'
      },
      global: {
        
        plugins: [PrimeVue],
        components: { Button },
        // Stub the ripple directive to avoid errors in the test DOM
        directives: {
          ripple: {}
        }
      }
    })
  it('renders PrimeVue Button with correct props and attributes', () => {

   
    const buttonWrapper = wrapper.findComponent(Button)
    expect(buttonWrapper.exists()).toBe(true)

  
    expect(wrapper.props('label')).toBe('Click Me')
    expect(wrapper.props('type')).toBe('submit')
    expect(wrapper.props('color')).toBe('success')

   
    const buttonEl = wrapper.find('button')
    expect(buttonEl.exists()).toBe(true)
    expect(buttonEl.attributes('type')).toBe('submit')
    expect(buttonEl.text()).toBe('Click Me')
    
    expect(buttonEl.classes()).toContain('p-button-success')
  })
  
  it('if button click', async()=>{
  
      await wrapper.get('button').trigger('click')
  
      const emitted = wrapper.emitted('click')
  
      expect(emitted).toHaveLength(1);
  }) 
})


