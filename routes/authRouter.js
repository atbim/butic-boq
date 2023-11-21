const express = require('express')
const {
  authCallbackMiddleware,
  authRefreshMiddleware,
} = require('../services/aps')
const authController = require('../controllers/authController')
const router = express.Router()

router.route('/login').get(authController.login)
router.route('/logout').get(authController.logout)
router.route('/callback').get(authCallbackMiddleware, authController.callback)
router.route('/token').get(authRefreshMiddleware, authController.getToken)
router.route('/profile').get(authRefreshMiddleware, authController.getProfile)

module.exports = router
