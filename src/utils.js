const la = require('lazy-ass')
const is = require('check-more-types')
const {propEq} = require('ramda')

const isFunction = propEq('type', 'FunctionDeclaration')

function functionLabelFromFunctionNode (filename, node) {
  la(is.unemptyString(filename), 'missing filename')
  return functionLabel(filename, node.id.name, node.start)
}

function functionLabel (filename, name, start) {
  if (arguments.length === 2) {
    return functionLabelFromFunctionNode.apply(null, arguments)
  }
  la(is.unemptyString(filename), 'missing filename')
  la(is.unemptyString(name), 'missing function name')
  la(is.number(start), 'missing start index')
  return filename + ':' + name + ':' + start
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
