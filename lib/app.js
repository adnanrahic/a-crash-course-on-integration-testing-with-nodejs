const express = require('express')
const app = express()
require('./db')

app.get('/api', (req, res) => res.status(200).send('API works.'))

const UserController = require('./user/user.controller')
app.use('/api/users', UserController)

const AuthController = require('./auth/auth.controller')
app.use('/api/auth', AuthController)

module.exports = app
