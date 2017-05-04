'use strict'

const hook = require('node-hook')
const debug = require('debug')('data-cover')
const instrument = require('./instrument-source')
const updateSource = require('./update-source')
const {keys} = require('ramda')

const {
  readFileSync: read,
  writeFileSync: write,
  existsSync: exists
} = require('fs')

const {join, relative} = require('path')
const mkdirp = require('mkdirp')

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

function saveHtmlReport (filename, source) {
  const outputDir = 'output'
  if (!exists(outputDir)) {
    debug('making output folder %s', outputDir)
    mkdirp.sync(outputDir)
  }
  const relativeName = relative(process.cwd(), filename)
  debug('relative path %s', relativeName)
  const outputFilename = join(outputDir, 'index.html')
  const html = `
  <head>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.11.0/styles/default.min.css">
    <script src="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/9.11.0/highlight.min.js"></script>
    <script>hljs.initHighlightingOnLoad();</script>
  </head>
  <body>
    <h2>${relativeName}</h2>
    <pre><code class="javascript">${source}</code></pre>
  </body>
  `
  write(outputFilename, html, 'utf8')
  debug('saved file %s', outputFilename)
}

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
    saveHtmlReport(filename, updated)
  })
})
