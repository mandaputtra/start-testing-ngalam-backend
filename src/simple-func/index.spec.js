import { expect, describe, it } from 'vitest'
import { sum } from './'

// This the top level I named test suite, 
// Explain what module are you testing
describe('test simple function module', () => {
  // this are test condition,
  // explain what the module should behave
  it('should sum number correctly', () => {
    // test condition are the home of `expect`
    expect(sum(2,3)).toBe(5)
    expect(sum(3,121)).toBe(124)
  })
})
