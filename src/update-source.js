// shows the data coverage in the executed code

const la = require('lazy-ass')
const is = require('check-more-types')
const falafel = require('falafel')
const {functionLabel, isFunction, insertComments} = require('./utils')
const beautifySource = require('./beautify')

function updateSource (functions, source, filename) {
  la(is.string(source), 'missing source', source)
  la(is.unemptyString(filename), 'missing filename', filename)

  function instrument (node) {
    if (!isFunction(node)) {
      return
    }

    const label = functionLabel(filename, node)
    const data = functions[label]
    if (!data) {
      return
    }

    insertComments(node, node.params.map(param => {
      return param.name + ':' + JSON.stringify(data[param.name])
    }))
  }

  const output = falafel(source, instrument) + '\n'
  const beautified = beautifySource(output)
  return beautified
}

module.exports = updateSource
