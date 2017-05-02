const la = require('lazy-ass')
const is = require('check-more-types')

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

module.exports = {functionLabel}
