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
    describe('.register', async () => {
      let _res
      before(async () => {
        _res = await registerUser()
      })
      it('should return status 200', async () => {
        expect(_res).to.have.status(200)
      })
      it('should return body with \'token\' property', async () => {
        expect(_res.body).to.have.property('token')
      })
      it('should return body with \'auth\' property', async () => {
        expect(_res.body).to.have.property('auth')
      })
      it('should return body.auth property with value \'true\'', async () => {
        expect(_res.body.auth).to.be.equal(true)
      })
    })

    describe('.login', () => {
      let _res
      before(async () => {
        _res = await loginUser()
      })
      it('should return status 200', () => {
        expect(_res).to.have.status(200)
      })
      it('should return body with \'token\' property', () => {
        expect(_res.body).to.have.property('token')
      })
      it('should return body with \'auth\' property', () => {
        expect(_res.body).to.have.property('auth')
      })
      it('should return body.auth property with value \'true\'', () => {
        expect(_res.body.auth).to.be.equal(true)
      })
    })

    describe('.me', () => {
      let loginRes,
        meResSuccess,
        meResNoToken,
        meResBadToken,
        userFromAPI,
        userFromDB
      before(async () => {
        loginRes = await loginUser()
        meResSuccess = await me(loginRes.body.token)
        meResNoToken = await me('')
        meResBadToken = await me('somerandomtoken')
        userFromAPI = meResSuccess.body
        userFromDB = await User.findById(userFromAPI._id, { _id: 1, name: 1, email: 1 })
      })
      it('should return status 200', () => {
        expect(meResSuccess).to.have.status(200)
      })
      it('should return the authenticated user', () => {
        expect(userFromAPI._id).to.equal(userFromDB._id.toString())
        expect(userFromAPI.name).to.equal(userFromDB.name)
        expect(userFromAPI.email).to.equal(userFromDB.email)
      })
      it('should return status 403 if \'no token provided\'', async () => {
        expect(meResNoToken).to.have.status(403)
      })
      it('should return message: \'No token provided.\' if it fails with 403', async () => {
        expect(meResNoToken.body.message).to.be.eql('No token provided.')
      })
      it('should return status 500 if \'failed to authenticate token\'', async () => {
        expect(meResBadToken).to.have.status(500)
      })
      it('should return message: \'Failed to authenticate token.\' if it fails with 500', async () => {
        expect(meResBadToken.body.message).to.be.eql('Failed to authenticate token.')
      })
    })

    describe('.logout`', () => {
      let res
      before(async () => {
        res = await logoutUser()
      })
      it('should return status 200', () => {
        expect(res).to.have.status(200)
      })
      it('should set the \'token\' property to null', () => {
        expect(res.body.token).to.be.equal(null)
      })
      it('should set the \'auth\' property to false', () => {
        expect(res.body.auth).to.be.equal(false)
      })
    })
  })
})
