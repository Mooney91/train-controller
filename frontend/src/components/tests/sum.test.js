import { expect, test } from 'vitest'
import { sum } from '../sum.js'
// import { renderMainView } from '../../main.js'; // Import the function you want to test


// function sum(a, b) {
//   return a + b;
// }

test('adds 1 + 2 to equal 3', () => {
  expect(sum(1, 2)).toBe(3)
})

