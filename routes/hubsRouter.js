const express = require('express')
const { authRefreshMiddleware } = require('../services/aps')
const hubsController = require('../controllers/hubsController')
const router = express.Router()

// 1) APLICAMOS UN MIDDLEWARE GENERAL
router.use('/', authRefreshMiddleware)

// 2) GESTIONAMOS LOS DISTINTOS ENDPOINTS
router.route('/').get(hubsController.getHubsFromAdsk)
router.route('/:hub_id/projects').get(hubsController.getProjectsFromAdsk)
router
  .route('/:hub_id/projects/:project_id/contents')
  .get(hubsController.getProjectContentsFromAdsk)
router
  .route('/:hub_id/projects/:project_id/contents/:item_id/versions')
  .get(hubsController.getItemVersionsFromAdsk)
router
  .route('/:hub_id/projects/:project_id/contents/:item_id/tip')
  .get(hubsController.getItemTipFromAdsk)

module.exports = router
