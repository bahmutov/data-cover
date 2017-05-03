const update = require('../src/update-source')
const {functionLabel} = require('../src/utils')
const {stripIndent} = require('common-tags')
const snapshot = require('snap-shot')

/* global describe, it */
describe('updates code with results', () => {
  const source = stripIndent`
    function add(a, b) {
      return a + b
    }
  `
  // fake collected data
  const filename = 'spec.js'
  const label = functionLabel('add', 0)
  const functions = {
    [label]: {
      a: [1, 2, 3],
      b: [1]
    }
  }

  it('inserts comments', () => {
    const output = update(functions, source, filename)
    snapshot(output)
  })
})
