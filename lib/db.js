const config = require('./config')
const mongoose = require('mongoose')
mongoose.connect(config.DB, { useNewUrlParser: true })
