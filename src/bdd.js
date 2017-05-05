'use strict'

const hook = require('node-hook')
const debug = require('debug')('data-cover')
const instrument = require('./instrument-source')
const updateSource = require('./update-source')
const {keys} = require('ramda')
const md5 = require('md5')

const {
  readFileSync: read,
  writeFileSync: write,
  existsSync: exists
} = require('fs')

const {join, relative} = require('path')
const mkdirp = require('mkdirp')

const isSpec = filename => /spec\.js$/.test(filename)

const is3rdParty = filename => /node_modules/.test(filename)

const relativeTo = relative.bind(null, process.cwd())

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

function saveIndex (outputDir, pages) {
  const links = pages.map(page => `<li>
    <a href="${page.link}">${page.name}</a>
  </li>
  `).join('\n')
  const html = `
  <body>
    <h2>Instrumented files</h2>
    <ul>
    ${links}
    </ul>
  </body>
  `

  const outputFilename = join(outputDir, 'index.html')
  write(outputFilename, html, 'utf8')
  debug('saved index page %s', outputFilename)
}

function saveHtmlReport (outputDir, filename, source) {
  if (!exists(outputDir)) {
    debug('making output folder %s', outputDir)
    mkdirp.sync(outputDir)
  }
  const relativeName = relativeTo(filename)
  debug('relative path %s', relativeName)

  const filenameHashed = md5(relativeName)
  debug('output filename hash', filenameHashed)

  const outputFilename = join(outputDir, filenameHashed + '.html')
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

const writeFileResults = outputDir => results => filename => {
  const functions = results[filename].functions
  const source = read(filename, 'utf8')
  const updated = updateSource(functions, source, filename)
  saveHtmlReport(outputDir, filename, updated)
}

// has to be synchronous to work on process exit
function writeResults () {
  const results = global.__instrumenter.files
  const message = JSON.stringify(results, null, 2)
  debug(message)

  const files = keys(results)
  console.log('covered source files', files)

  const outputDir = 'output'
  files.forEach(writeFileResults(outputDir)(results))

  const filePages = files
    .map(relativeTo)
    .map(md5)
    .map(name => name + '.html')

  const links = files.map((filename, k) => {
    const relativeName = relative(process.cwd(), filename)
    return {
      link: filePages[k],
      name: relativeName
    }
  })

  saveIndex(outputDir, links)
}

process.on('exit', function () {
  debug('data-cover is done')
  hook.unhook('.js')
  writeResults()
})
