const {add, abs, isEmail} = require('./my-lib')
const {equals} = require('ramda')

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

describe('array lib', () => {
  const {getEvenNumbers} = require('./array-lib')

  it('computes even numbers', () => {
    const list = [2, 4, 6]
    const even = getEvenNumbers(list)
    const expected = [true, true, true]
    console.assert(equals(even, expected))
  })
})

describe('an observable', () => {
  const {getNumbers} = require('./stream-lib')

  it('works', done => {
    getNumbers([1, 'foo', undefined])
      .subscribe(
        null,
        null,
        done
      )
  })
})
