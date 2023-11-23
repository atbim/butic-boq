const axios = require('axios')
const { issuesAdskUrl } = require('../config/urls')

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

module.exports = {
  getIssues,
}
