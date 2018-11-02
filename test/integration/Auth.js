/* eslint-env mocha */

const expect = require('chai').expect
const request = require('chai').request
const {
  getApp,
  clearDB,
  getModel
} = require('../helpers')

const app = getApp()
const User = getModel('User')

const testUser = {
  name: 'superAdmin',
  email: 'admin@example.com',
  password: 'superSecret'
}

function registerUser () {
  return request(app)
    .post('/api/auth/register')
    .send(testUser)
}
function loginUser () {
  return request(app)
    .post('/api/auth/login')
    .send(testUser)
}
function logoutUser () {
  return request(app)
    .get('/api/auth/logout')
    .send(testUser)
}
function me (token) {
  return request(app)
    .get('/api/auth/me')
    .set('x-access-token', token)
}

describe('auth', function () {
  before(() => clearDB())
  after(() => clearDB())

  describe('AuthController', function () {
    describe('.register', function () {
      it('should register a new user', async () => {
        const res = await registerUser()

        expect(res).to.have.status(200)
        expect(res.body).to.not.be.equal(null).and.not.to.be.equal(undefined)
        expect(res.body).to.have.property('token')
        expect(res.body).to.have.property('auth')
        expect(res.body.auth).to.be.equal(true)
      })
    })

    describe('.login', function () {
      it('should authenticate a user', async () => {
        const res = await loginUser()

        expect(res).to.have.status(200)
        expect(res.body).to.not.be.equal(null).and.not.to.be.equal(undefined)
        expect(res.body).to.have.property('token')
        expect(res.body).to.have.property('auth')
        expect(res.body.auth).to.be.equal(true)
      })
    })

    describe('.me', function () {
      it('should return the authenticated user', async () => {
        const { body: loginResBody } = await loginUser()
        const { status, body: userFromAPI } = await me(loginResBody.token)
        const userFromDB = await User.findById(userFromAPI._id, { _id: 1, name: 1, email: 1 })

        expect(status).to.be.equal(200)
        expect(userFromAPI).to.not.be.equal(null).and.not.to.be.equal(undefined)
        expect(userFromAPI).to.have.property('_id')
        expect(userFromAPI).to.have.property('name')
        expect(userFromAPI).to.have.property('email')

        expect(userFromAPI._id).to.equal(userFromDB._id.toString())
        expect(userFromAPI.name).to.equal(userFromDB.name)
        expect(userFromAPI.email).to.equal(userFromDB.email)
      })
    })

    describe('.logout`', function () {
      it('should log a user out', async () => {
        const { status, body } = await logoutUser()
        expect(status).to.be.equal(200)
        expect(body).to.not.be.equal(null).and.not.to.be.equal(undefined)
        expect(body).to.have.property('token')
        expect(body.token).to.be.equal(null)
        expect(body).to.have.property('auth')
        expect(body.auth).to.be.equal(false)
      })
    })
  })

  describe('VerifyToken', function () {
    it('should fail with 403 if \'no token provided\'', async () => {
      const { status, body } = await me('')
      expect(status).to.be.equal(403)
      expect(body).to.have.property('message')
      expect(body).to.have.property('auth')
      expect(body.message).to.be.eql('No token provided.')
    })
    it('should fail with 500 if \'failed to authenticate token\'', async () => {
      const { status, body } = await me('somerandomtoken')
      expect(status).to.be.equal(500)
      expect(body).to.have.property('message')
      expect(body).to.have.property('auth')
      expect(body.message).to.be.eql('Failed to authenticate token.')
    })
  })
})
