const la = require('lazy-ass')
const is = require('check-more-types')
const debug = require('debug')('comment-value')
const falafel = require('falafel')
const {pluck} = require('ramda')
const {functionLabel, isFunction} = require('./utils')

const beautifySource = require('./beautify')
// emit events when finding comment / instrumenting
// allows quick testing
if (!global.instrument) {
  const EventEmitter = require('events')
  global.instrument = new EventEmitter()
}
const emitter = global.instrument

function instrumentSource (source, filename) {
  la(is.string(source), 'missing source', source)
  la(is.unemptyString(filename), 'missing filename', filename)

  // TODO handle multiple files by making this object global
  // and avoiding overwriting it
  const __instrumenter = global.__instrumenter || {
    files: {}
  }

  if (!__instrumenter.files[filename]) {
    __instrumenter.files[filename] = {
      functions: {}
    }
  }

  const fileRef = __instrumenter.files[filename].functions

  function instrument (node) {
    if (isFunction(node)) {
      const name = node.id.name
      debug('found', node.type, name, 'at start', node.start, '\n' + node.source())
      const params = pluck('name', node.params)
      emitter.emit('function', {
        node,
        name,
        params
      })

      const label = functionLabel(name, node.start)
      const paramsRef = fileRef[label] = {}
      let paramsSave = ''
      node.params.forEach(param => {
        paramsRef[param.name] = []
        paramsSave += `__instrumenter.files['${filename}'].functions['${label}']['${param.name}'].push(${param.name})\n`
      })
      const innerSource = node.body.source().slice(2)
      const updatedSource = '{\n' + paramsSave + innerSource
      node.body.update(updatedSource)
    }
  }

  const output = falafel(source, instrument)

  const preamble = 'if (!global.__instrumenter) {global.__instrumenter=' +
    JSON.stringify(__instrumenter, null, 2) + '}\n'

  const sep = ';\n'
  const instrumented = preamble + sep + output
  const beautify = true
  const beautified = beautify ? beautifySource(instrumented) : instrumented
  return beautified
}

module.exports = instrumentSource
