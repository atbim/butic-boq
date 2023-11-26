const express = require('express')
const itemController = require('../controllers/itemController')

const router = express.Router()

router.route('/').post(itemController.createItem)
router.route('/:code').get(itemController.getItemByCode)

module.exports = router