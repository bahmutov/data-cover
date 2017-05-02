const la = require('lazy-ass')
const is = require('check-more-types')

function functionLabel (filename, name, start) {
  la(is.unemptyString(filename), 'missing filename')
  la(is.unemptyString(name), 'missing function name')
  la(is.number(start), 'missing start index')
  return filename + ':' + name + ':' + start
}

module.exports = {functionLabel}
