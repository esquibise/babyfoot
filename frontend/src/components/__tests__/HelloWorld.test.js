import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import HelloWorld from '../HelloWorld.vue';

describe('HelloWorld.vue', () => {
  it('renders the welcome message', () => {
    const wrapper = mount(HelloWorld, { props: { msg: 'Test Message' } });
    // Vérifie que le composant contient le message passé en prop
    expect(wrapper.text()).toContain('Test Message');
    // Vérifie que le composant contient le message interne "You did it!"
    expect(wrapper.text()).toContain('You did it!'); 
  });

  it('renders the h1 tag with the message', () => {
    const msg = 'Hello Vitest';
    const wrapper = mount(HelloWorld, { props: { msg } });
    const h1 = wrapper.find('h1');
    expect(h1.exists()).toBe(true);
    expect(h1.text()).toBe(msg);
  });
}); 