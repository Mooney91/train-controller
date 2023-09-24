import { test, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import App from '../../App.vue';

test('Renders TrafficController component', async () => {
  expect(App).toBeTruthy();

  const wrapper = mount(App);
  const trafficController = wrapper.component;
  expect(trafficController.name).toBe('TrafficController');
});

test('Renders a message', async () => {
  const wrapper = mount(App);
  expect(wrapper.text()).toContain('Välkommen till Traffic Controller');
});

test('Contains a container element', async () => {
  const wrapper = mount(App);
  expect(wrapper.element.querySelector('.container')).not.toBeNull();
});

test('Contains a delayed-trains element', async () => {
  const wrapper = mount(App);
  expect(wrapper.element.querySelector('.delayed-trains')).not.toBeNull();
});


