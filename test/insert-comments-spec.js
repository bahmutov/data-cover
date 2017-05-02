const la = require('lazy-ass')
const is = require('check-more-types')
const falafel = require('falafel')
const {stripIndent} = require('common-tags')
const snapshot = require('snap-shot')

const beautifySource = require('../src/beautify')
const {isFunction, insertComments} = require('../src/utils')

function addCommentsToFunctions (source) {
  la(is.string(source), 'missing source', source)
  function addComments (node) {
    if (isFunction(node)) {
      insertComments(node, ['line 1', 'line 2'])
    }
  }
  const output = falafel(source, addComments) + '\n'
  return beautifySource(output)
}

/* global describe, it */
describe('inserting comments', () => {
  it('keeps comments', () => {
    const source = stripIndent`
    function add(a, b) {
      return a + b
    }
    `
    const inserted = addCommentsToFunctions(source)
    snapshot(inserted)
  })
})
