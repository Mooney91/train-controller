// import { test, expect } from 'vitest';
// import { createApp } from 'vue';
// // import fetchMock from 'fetch-mock';

// // Import the main app component
// import App from '../../App.vue';

// // Import the main script (main.js)
// import '../../main'; // Ensure that this import executes the code in main.js

// test('App renders without errors', async () => {
//   const app = createApp(App);
//   const wrapper = app.mount();

//   expect(wrapper).toBeTruthy();
// });

// test('App renders welcome message', async () => {
//   const app = createApp(App);
//   const wrapper = app.mount();

//   expect(wrapper.text()).toContain('Välkommen till Traffic Controller');
// });

// test('App contains a container element', async () => {
//   const app = createApp(App);
//   const wrapper = app.mount();

//   const container = wrapper.element.querySelector('.container');
//   expect(container).not.toBeNull();
// });

// test('App contains a delayed-trains element', async () => {
//   const app = createApp(App);
//   const wrapper = app.mount();

//   const delayedTrains = wrapper.element.querySelector('.delayed-trains');
//   expect(delayedTrains).not.toBeNull();
// });

// test('App fetches and renders delayed train data', async () => {
//   const app = createApp(App);
//   const wrapper = app.mount();

//   // Mock the fetch request to return sample data
//   fetchMock.get('http://localhost:1337/delayed', {
//     status: 200,
//     body: {
//       data: [
//         // Sample delayed train data
//         // Add more data as needed for your test case
//         {
//           OperationalTrainNumber: '123',
//           LocationSignature: 'XYZ',
//           // Other properties...
//         },
//       ],
//     },
//   });

//   // Wait for the fetch to complete (you may need to add async/await here depending on your setup)
//   await new Promise((resolve) => setTimeout(resolve, 100));

import { test, expect } from 'vitest';
import { createApp } from 'vue';
import App from '../../App.vue';


