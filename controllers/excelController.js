const ExcelJS = require('exceljs')
const fs = require('fs')

const createExcel = async (req, res, next) => {
    try {
      // Crear un nuevo libro de Excel
      const workbook = new ExcelJS.Workbook()

      // Agregar una hoja al libro
      const sheet = workbook.addWorksheet('MiHoja')

      // Agregar datos a la hoja
      sheet.columns = [
        { header: 'Nombre', key: 'nombre', width: 20 },
        { header: 'Edad', key: 'edad', width: 10 },
        { header: 'País', key: 'pais', width: 15 },
      ]

      const data = [
        { nombre: 'Juan', edad: 25, pais: 'España' },
        { nombre: 'Maria', edad: 30, pais: 'México' },
        { nombre: 'Carlos', edad: 22, pais: 'Argentina' },
      ]

      data.forEach((row) => {
        sheet.addRow(row)
      })

      // Guardar el libro como un archivo Excel
      const excelFilePath = 'miPrimerFicherExcel.xlsx'

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
