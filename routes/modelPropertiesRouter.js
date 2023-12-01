const express = require('express')
const { authRefreshMiddleware } = require('../services/aps')
const modelPropertiesController = require('../controllers/modelPropertiesController')
const router = express.Router()

// 1) APLICAMOS UN MIDDLEWARE GENERAL
router.use('/', authRefreshMiddleware)

// 2) GESTIONAMOS LOS DISTINTOS ENDPOINTS
router.route('/:assemblycode').get(modelPropertiesController.getAmountFromAssemblyCode)

module.exports = router