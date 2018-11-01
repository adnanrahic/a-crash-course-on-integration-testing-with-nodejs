const app = require('../lib/app')
const mongoose = require('mongoose')
const _ = require('lodash')

function getApp () {
  return app
}
async function clearDB () {
  return Promise.all(_.map(mongoose.models, model => model.deleteMany()))
}
function getModel (model) {
  return mongoose.model(model)
}
function parseJSON (obj) {
  return JSON.parse(JSON.stringify(obj))
}

module.exports = {
  getApp,
  clearDB,
  getModel,
  parseJSON
}
