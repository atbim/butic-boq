const ExcelJS = require('exceljs')
const fs = require('fs')
const Item = require('../models/Item')

const createExcel = async (req, res, next) => {
  try {
    console.log('body: ', req.body)
    const { nombreLibro, nombreHoja } = req.body
    // Crear un nuevo libro de Excel
    const workbook = new ExcelJS.Workbook()

    // Agregar una hoja al libro
    const sheet = workbook.addWorksheet(nombreHoja)

    // Agregar datos a la hoja
    sheet.columns = [
      { header: 'Naturaleza', key: 'nat', width: 20 },
      { header: 'Codigo', key: 'cod', width: 10 },
      { header: 'Nombre', key: 'name', width: 15 },
      { header: 'Unidad', key: 'unit', width: 15 },
      { header: 'Precio', key: 'price', width: 15 },
      { header: 'Cantidad', key: 'quantity', width: 15 },
      { header: 'Importe', key: 'amount', width: 15 },
    ]

    for (const capitulo of req.body.data) {
      sheet.addRow(capitulo)
      for (const partida of capitulo.partidas) {
        const { name, unit, price } = await Item.findOne({ code: partida.cod })
        sheet.addRow({
          ...partida,
          name,
          unit,
          price,
          amount: (partida.quantity * price).toFixed(2),
        })
      }
    }

    // Guardar el libro como un archivo Excel
    const excelFilePath = `${nombreLibro}.xlsx`

    await workbook.xlsx.writeFile(excelFilePath)
    /* .then(() => {
        console.log(`Archivo Excel creado en: ${excelFilePath}`)
      })
      .catch((error) => {
        console.error('Error al crear el archivo Excel:', error)
      }) */
      //res.status(200).json({ message: 'Hola Excel!!!' })
      // TODO: Corregir por parte de Adrián
    res.download(excelFilePath, 'testejemplo.xlsx', (err) => {
      if (err) {
        console.error('Error al descargar el archivo:', err)
        res.status(500).send('Error interno del servidor')
      } else {
        console.log('Archivo descargado con éxito')
        // Elimina el archivo después de descargarlo para evitar acumulación de archivos no deseados
        fs.unlinkSync(excelFilePath)
      }
    })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createExcel,
}
