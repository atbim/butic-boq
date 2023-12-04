const nodemailer = require('nodemailer')

const sendEmail = async (req, res, next) => {
  try {
      const { to, subject, text } = req.body
      console.log('to: ', to)

    // Configuración del transporte para SMTP
    const transporter = nodemailer.createTransport({
      host: 'smtp.dondominio.com',
      port: 587,
      secure: false,
      auth: {
        user: 'butic@atbim.io',
        pass: 'Butic123456789_',
      },
    })

    // Detalles del correo electrónico
    const mailOptions = {
      from: 'butic@atbim.io',
      to,
      subject,
      text,
    }

    // Enviar el correo electrónico
    transporter.sendMail(mailOptions, function (error, info) {
      if (error) {
        console.error(error)
      } else {
        console.log('Correo electrónico enviado: ' + info.response)
      }
    })

    res.status(200).json({ message: 'Email enviado correctamente.' })
  } catch (err) {
    next(err)
  }
}

module.exports = {
  sendEmail,
}
