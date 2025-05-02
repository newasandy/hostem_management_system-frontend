import { mount } from "@vue/test-utils";
import { describe, expect, it } from "vitest";
import TableRowButton from "../../../components/UI/TableRowButton.vue";

describe('TableRowButton.vue',()=>{
    

    it('default render',()=>{
        const wrapper = mount(TableRowButton,{
    })
        const btn = wrapper.find('button')
        expect(btn.exists()).toBe(true)
    })

    it('pass props',()=>{
        const wrapper = mount(TableRowButton,{
        props:{
            icon:'pi pi-plus',
            size: 'w-6 h-6',
            colorScheme: 'text-red-500 bg-white',
            position:'right-11'
            }
        })
        const btnClass = "w-6 h-6 text-red-500 bg-white right-11 absolute top-1/2 transform -translate-y-1/2 translate-x-full opacity-0 group-hover:translate-x-0 group-hover:opacity-100 transition-all duration-300 p-2 rounded-full shadow-lg"
        const btn = wrapper.find('button')

        expect(btn.exists()).toBe(true)
        expect(wrapper.props('icon')).toContain('pi pi-plus')
        expect(wrapper.props('size')).toContain('w-6 h-6')
        expect(wrapper.props('colorScheme')).toContain('text-red-500 bg-white')
        expect(wrapper.props('position')).toContain('right-11')
        expect(wrapper.classes()).toEqual(expect.arrayContaining(btnClass.split(' ')))

    })

    it("renders <i> with provided icon class", () => {
        const wrapper = mount(TableRowButton,{
            props:{
                icon:'pi pi-plus',
                size: 'w-6 h-6',
                colorScheme: 'text-red-500 bg-white',
                position:'right-11'
            }
        })
        const iconEl = wrapper.find("i");
        expect(iconEl.classes()).toEqual(expect.arrayContaining('pi pi-plus'.split(' ')))
    });

    it('button on click emit', async()=>{
        const wrapper = mount(TableRowButton,{
            
        })
        await wrapper.find('button').trigger('click')
        const emitted = wrapper.emitted('action')
        expect(emitted).toHaveLength(1)
    })
})