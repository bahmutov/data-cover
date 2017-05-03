'use strict'

const hook = require('node-hook')
const debug = require('debug')('data-cover')
const instrument = require('./instrument-source')
const updateSource = require('./update-source')
const {keys} = require('ramda')
const read = require('fs').readFileSync

const isSpec = filename => /spec\.js$/.test(filename)

const is3rdParty = filename => /node_modules/.test(filename)

function onFileLoad (source, filename) {
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

  const results = global.__instrumenter.files
  const message = JSON.stringify(results, null, 2)
  debug(message)

  const files = keys(results)
  console.log('covered source files', files)

  files.forEach(filename => {
    const functions = results[filename].functions
    const source = read(filename, 'utf8')
    const updated = updateSource(functions, source, filename)
    console.log(updated)
  })
})
