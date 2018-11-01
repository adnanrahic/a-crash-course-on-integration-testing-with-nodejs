require('dotenv')
  .config({
    path: `./config/${process.env.NODE_ENV}.env`
  })

var app = require('./lib/app')
var port = process.env.PORT || 3000
const server = app.listen(port)
module.exports = server
