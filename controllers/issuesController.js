const axios = require('axios')
const { issuesAdskUrl } = require('../config/urls')
const Issue = require('../models/Issue')

const getIssues = async (req, res, next) => {
  try {
    const { containerId } = req.params
    const url = `${issuesAdskUrl}/${containerId}/issues`
    const resp = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${req.session.internal_token}`,
      },
    })

    res.status(200).json(resp.data)
  } catch (error) {
    next(error)
  }
}

const getIssuesByDbidFromMongo = async (req, res, next) => {
  try {
    const { dbid } = req.params
    const issues = await Issue.find({ dbIds: { $in: dbid } })
    res.status(200).json({status: 'success', number: issues.length, data: issues})
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getIssues,
  getIssuesByDbidFromMongo,
}
