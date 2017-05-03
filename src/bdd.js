'use strict'

const hook = require('node-hook')
const debug = require('debug')('data-cover')
const instrument = require('./instrument-source')

const isSpec = filename => /spec\.js$/.test(filename)

const is3rdParty = filename => /node_modules/.test(filename)

function onFileLoad(source, filename) {
  if (isSpec(filename)) {
    debug('Skipping file %s', filename)
    return source
  }
  if (is3rdParty(filename)) {
    debug('skipping node_modules file', filename)
    return source
  }

  debug('instrumenting %s for data-cover', filename)
  return instrument(source, filename)
}
hook.hook('.js', onFileLoad)

process.on('exit', function () {
  debug('data-cover is done')
  hook.unhook('.js')
  const results = JSON.stringify(global.__instrumenter.functions, null, 2)
  debug(results)
})
