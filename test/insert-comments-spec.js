const la = require('lazy-ass')
const is = require('check-more-types')
const falafel = require('falafel')
const {propEq} = require('ramda')
const {stripIndent, stripIndents} = require('common-tags')
const beautifySource = require('../src/beautify')
const snapshot = require('snap-shot')

const isFunction = propEq('type', 'FunctionDeclaration')

function addCommentsToFunctions (source) {
  la(is.string(source), 'missing source', source)
  function addComments (node) {
    if (isFunction(node)) {
      const innerSource = node.body.source().slice(2)
      const output = stripIndents`{
        // this is a comment
        // another comment
        ${innerSource}
      `
      node.body.update(output)
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
