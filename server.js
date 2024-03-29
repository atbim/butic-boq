const express = require('express')
const session = require('cookie-session')
// Cargamos variables de entorno si estamos en local
if (!process.env.NODE_ENV) {
  require('dotenv').config()
}

const { PORT, SERVER_SESSION_SECRET } = require('./config/aps.js')
const connectDb = require('./config/db')
const authRouter = require('./routes/authRouter.js')
const hubsRouter = require('./routes/hubsRouter.js')
const issuesRouter = require('./routes/issuesRouter.js')
const itemRouter = require('./routes/itemRouter.js')
const modelPropertiesRouter = require('./routes/modelPropertiesRouter.js')
const excelRouter = require('./routes/excelRouter.js')
const emailRouter = require('./routes/emailRouter.js')

// Connect Database
connectDb();

let app = express()
app.use(express.json({ limit: '50mb' }))
app.use(express.static('wwwroot'))
app.use(session({ secret: SERVER_SESSION_SECRET, maxAge: 24 * 60 * 60 * 1000 }))
app.use('/api/auth', authRouter)
app.use('/api/hubs', hubsRouter)
app.use('/api/issues', issuesRouter)
app.use('/api/items', itemRouter)
app.use('/api/costmanagement', modelPropertiesRouter)
app.use('/api/excel', excelRouter)
app.use('/api/email', emailRouter)
app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`))
