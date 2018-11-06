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

module.exports = {
  getApp,
  clearDB,
  getModel
}
