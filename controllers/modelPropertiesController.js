const axios = require('axios')
const Item = require('../models/Item')
const { indexAdskUrl } = require('../config/urls')

const getAmountFromAssemblyCode = async (req, res, next) => {
  try {
    const { assemblycode } = req.params
    const url = `${indexAdskUrl}/7a74e921-70cb-486b-a11b-595330392b00/indexes/Mrxhz4ypHRZYLHvUYYa1wQ/queries`
    const postData = {
      query: {
        $and: [
          { $notnull: 's.props.p20d8441e' },
          { $notnull: 's.props.p30db51f9' },
          { $notnull: 's.props.p13b6b3a0' },
          { $gt: [{ $count: 's.views' }, 0] },
          { $eq: ['s.props.p54217060', `'${assemblycode}'`] },
        ],
      },
      columns: {
        area: { $sum: 's.props.pcc3750bf' },
      },
    }
    const headers = {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${req.session.internal_token}`,
    }
    const respPostQuery = await axios.post(url, postData, { headers: headers })
    const respQuery = await axios.get(respPostQuery.data.selfUrl, {
      headers: {
        Authorization: `Bearer ${req.session.internal_token}`,
      },
    })
    const respResult = await axios.get(respQuery.data.queryResultsUrl, {
      headers: {
        Authorization: `Bearer ${req.session.internal_token}`,
      },
    })
    const item = await Item.findOne({ code: assemblycode })
    if (!item) {
      res.status(404).json({
        status: 'error',
        message: `No se encuentra el Item con Code ${assemblycode}.`,
      })
    }

    const quantity = respResult.data.area
    const price = item.price
    const amount = quantity * price
    res.status(200).json({amount})
  } catch (err) {
    next(err)
  }
}

module.exports = {
  getAmountFromAssemblyCode,
}
