const {add, abs, isEmail} = require('./my-lib')

describe('my library', () => {
  describe('add', () => {
    it('adds positive numbers', () => {
      console.assert(add(2, 3) === 5)
      console.assert(add(1, 2) === 3)
    })

    it('adds negative numbers', () => {
      console.assert(add(-1, -3) === -4)
    })
  })

  describe('abs', () => {
    it('absolute of positive numbers', () => {
      console.assert(abs(2) === 2)
      console.assert(abs(42) === 42)
    })
    // hmm, no unit tests for absolute of negative numbers?
  })

  describe('email regex', () => {
    it('passes gmail emails', () => {
      console.assert(isEmail('user@gmail.com'))
      // hmm, is this enough?
      // maybe we should test 'user.name@gmail.com' and 'user@mail.ru'!
    })
  })
})
