const { getAuthorizationUrl, getUserProfile } = require('../services/aps')

const login = async (req, res, next) => {
  res.redirect(getAuthorizationUrl())
}

const logout = async (req, res, next) => {
  req.session = null
  res.redirect('/')
}

const callback = async (req, res, next) => {
  res.redirect('/')
}

const getToken = async (req, res, next) => {
  res.json(req.publicOAuthToken)
}

const getProfile = async (req, res, next) => {
  try {
    const profile = await getUserProfile(req.internalOAuthToken)
    res.json({ name: profile.name })
  } catch (err) {
    next(err)
  }
}

module.exports = { login, logout, callback, getToken, getProfile }
