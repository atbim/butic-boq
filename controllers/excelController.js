const ExcelJS = require('exceljs')
const fs = require('fs')

const createExcel = async (req, res, next) => {
  try {
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
    ]

    req.body.data.forEach((row) => {
      sheet.addRow(row)
    })

    // Guardar el libro como un archivo Excel
    const excelFilePath = `${nombreLibro}.xlsx`

    workbook.xlsx
      .writeFile(excelFilePath)
      .then(() => {
        console.log(`Archivo Excel creado en: ${excelFilePath}`)
      })
      .catch((error) => {
        console.error('Error al crear el archivo Excel:', error)
      })
    res.status(200).json({ message: 'Hola Excel!!!' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  createExcel,
}
