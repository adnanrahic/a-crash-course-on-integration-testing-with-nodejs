/* eslint-env mocha */

// Load .env vars
require('dotenv')
  .config({
    path: `./lib/config/${process.env.NODE_ENV}.env`
  })

const Mocha = require('mocha')
const mocha = new Mocha()
const chai = require('chai')
chai.use(require('chai-http'))
const testDir = 'test'

// Add test files
Mocha.utils
  .lookupFiles(testDir, ['js'], true)
  .map(file => mocha.addFile(file))

// Run tests
mocha.ui('bdd').run(process.exit)
// exit the node process on test end
