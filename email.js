const nodemailer = require('nodemailer')

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
  to: 'adrian@atbim.es, andreabarraganayala.gestion@gmail.com',
  subject: 'Mi Primer email',
  text: 'Cuerpo del correo electrónico',
}

// Enviar el correo electrónico
transporter.sendMail(mailOptions, function (error, info) {
  if (error) {
    console.error(error)
  } else {
    console.log('Correo electrónico enviado: ' + info.response)
  }
})
