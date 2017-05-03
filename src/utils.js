const la = require('lazy-ass')
const is = require('check-more-types')
const {propEq} = require('ramda')

const isFunction = propEq('type', 'FunctionDeclaration')

function functionLabelFromFunctionNode (node) {
  return functionLabel(node.id.name, node.start)
}

function functionLabel (name, start) {
  if (arguments.length === 1) {
    return functionLabelFromFunctionNode.apply(null, arguments)
  }
  la(is.unemptyString(name), 'missing function name')
  la(is.number(start), 'missing start index')
  return name + ':' + start
}

function toComments (lines) {
  la(is.array(lines), 'invalid lines', lines)
  return '/*\n' + lines.join('\n') + '\n*/\n'
}

function insertComments (node, lines) {
  la(isFunction(node), 'not a function node', node)
  const comments = toComments(lines)
  const innerSource = node.body.source().slice(2)
  const output = '{\n' + comments + innerSource
  node.body.update(output)
}

module.exports = {functionLabel, isFunction, insertComments}
