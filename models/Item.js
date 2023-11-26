const mongoose = require('mongoose')
const ItemSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    default: 0,
  },
  unit: {
    type: String,
    enum: ['ud', 'kg', 'm', 'm2', 'm3'],
  },
  parameter: {
    type: String,
    required: true,
  },
})

const Item = mongoose.model('Item', ItemSchema)
module.exports = Item
