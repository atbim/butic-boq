const express = require('express')
const session = require('cookie-session')
require('dotenv').config()
const { PORT, SERVER_SESSION_SECRET } = require('./config/aps.js')
const connectDb = require('./config/db')
const authRouter = require('./routes/authRouter.js')
const hubsRouter = require('./routes/hubsRouter.js')
const issuesRouter = require('./routes/issuesRouter.js')

// Connect Database
connectDb();

let app = express()
app.use(express.static('wwwroot'))
app.use(session({ secret: SERVER_SESSION_SECRET, maxAge: 24 * 60 * 60 * 1000 }))
app.use('/api/auth', authRouter)
app.use('/api/hubs', hubsRouter)
app.use('/api/issues', issuesRouter)
app.listen(PORT, () => console.log(`Server listening on port ${PORT}...`))
