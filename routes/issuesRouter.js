const express = require('express')
const { authRefreshMiddleware } = require('../services/aps')
const issuesController = require('../controllers/issuesController')
const router = express.Router()

router.route('/mongo/:dbid').get(issuesController.getIssuesByDbidFromMongo)

// 1) APLICAMOS UN MIDDLEWARE GENERAL
router.use('/', authRefreshMiddleware)

// 2) GESTIONAMOS LOS DISTINTOS ENDPOINTS
router.route('/:containerId').get(issuesController.getIssues)

module.exports = router
