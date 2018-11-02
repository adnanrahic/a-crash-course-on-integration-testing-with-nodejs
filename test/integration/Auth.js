/* eslint-env mocha */

const expect = require('chai').expect
const request = require('chai').request
const {
  getApp,
  clearDB,
  getModel,
  parseJSON
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
    .then(res => res.body)
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

        const userFromAPI = await me(res.body.token)
        const userFromDB = await User.findById(userFromAPI._id, { _id: 1, name: 1, email: 1 })

        expect(userFromAPI._id).to.equal(userFromDB._id.toString())
        expect(userFromAPI.name).to.equal(userFromDB.name)
        expect(userFromAPI.email).to.equal(userFromDB.email)
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

        const userFromAPI = await me(res.body.token)
        const userFromDB = await User.findById(userFromAPI._id, { _id: 1, name: 1, email: 1 })

        expect(userFromAPI._id).to.equal(userFromDB._id.toString())
        expect(userFromAPI.name).to.equal(userFromDB.name)
        expect(userFromAPI.email).to.equal(userFromDB.email)
      })
    })

    describe('.me', function () {
      it('should return the authenticated user', async () => {
        const res = await loginUser()

        const userFromAPI = await me(res.body.token)
        const userFromDB = await User.findById(userFromAPI._id, { _id: 1, name: 1, email: 1 })

        expect(userFromAPI._id).to.equal(userFromDB._id.toString())
        expect(userFromAPI.name).to.equal(userFromDB.name)
        expect(userFromAPI.email).to.equal(userFromDB.email)
      })
    })

    describe('.logout`', function () {
      it('should log a user out', function () {
        return logoutUser()
          .then(res => {
            expect(res).to.have.status(200)
            expect(res.body).to.not.be.equal(null).and.not.to.be.equal(undefined)
            expect(res.body).to.have.property('token')
            expect(res.body.token).to.be.equal(null)
            expect(res.body).to.have.property('auth')
            expect(res.body.auth).to.be.equal(false)
          })
      })
    })
  })

  describe('VerifyToken', function () {
    it('should fail with 403 if \'no token provided\'', function () {
      return me('')
        .catch(err => {
          expect(err).to.have.status(403)
          expect(err).to.have.property('message')
          expect(err).to.have.property('stack')
        })
    })
    it('should fail with 500 if \'failed to authenticate token\'', function () {
      return me('somerandomtoken')
        .catch(err => {
          expect(err).to.have.status(500)
          expect(err).to.have.property('message')
          expect(err).to.have.property('stack')
        })
    })
  })
})
