const Item = require('../models/Item')

const createItem = async (req, res, next) => {
  try {
    const item = await Item.create(req.body)
    res.status(201).json({
      status: 'success',
      data: item,
    })
  } catch (err) {
    next(err)
  }
}

const getAllItems = async (req, res, next) => {
  try {
    const items = await Item.find()
    res.status(200).json({
      status: 'success',
      data: items,
    })
  } catch (err) {
    next(err)
  }
}

const getItemByCode = async (req, res, next) => {
  try {
    const { code } = req.params
    const item = await Item.findOne({ code: code })
    if (!item) {
      res.status(404).json({
        status: 'error',
        message: `No se encuentra el Item con Code ${code}.`,
      })
    }
    res.status(200).json({ status: 'success', data: item })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createItem,
  getItemByCode,
  getAllItems,
}
