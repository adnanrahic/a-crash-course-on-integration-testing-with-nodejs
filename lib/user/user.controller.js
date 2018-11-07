const express = require('express')
const router = express.Router()
const bodyParser = require('body-parser')
const authVerification = require('../auth/auth.verification')
router.use(bodyParser.urlencoded({ extended: true }))
router.use(bodyParser.json())
const User = require('./user')

// CREATES A NEW USER
router.post('/', async (req, res) => {
  try {
    const user = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password
    })
    res.status(200).send(user)
  } catch (error) {
    res.status(500).send(error.message)
  }
})

// RETURNS ALL THE USERS IN THE DATABASE
router.get('/', async (req, res) => {
  try {
    const users = await User.find()
    res.status(200).send(users)
  } catch (error) {
    res.status(500).send('There was a problem finding the users.')
  }
})

// GETS A SINGLE USER FROM THE DATABASE
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
    if (!user) return res.status(404).send('No user found.')
    res.status(200).send(user)
  } catch (error) {
    res.status(500).send('There was a problem finding the user.')
  }
})

// DELETES A USER FROM THE DATABASE
router.delete('/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndRemove(req.params.id)
    res.status(200).send('User: ' + user.name + ' was deleted.')
  } catch (error) {
    res.status(500).send('There was a problem deleting the user.')
  }
})

// UPDATES A SINGLE USER IN THE DATABASE
// Added authVerification middleware to make sure only an authenticated user can put to this route
router.put('/:id', authVerification, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.status(200).send(user)
  } catch (error) {
    res.status(500).send('There was a problem updating the user.')
  }
})

module.exports = router
