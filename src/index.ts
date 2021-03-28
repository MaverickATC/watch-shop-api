import express from 'express'
import 'dotenv/config'
import mongoose from 'mongoose'
import winston, { format } from 'winston'
import cors from 'cors'

const app = express()

const port = process.env.PORT

//TODO: make logger work/or change {winston} to {morgan}
const logger = winston.createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: 'your-user-service' },
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' }),
  ],
})
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: winston.format.simple(),
    }),
  )
}

//middleware
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
  res.send('hi')
})

app.post('/test', (req, res) => {
  console.log(req.body)
  res.send(req.body)
})

async function start() {
  try {
    const connectionString: string = process.env.MONGO_URI as string
    await mongoose.connect(connectionString, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    })
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`)
    })
  } catch (error) {
    console.error('Server error: ', error.message)
    process.exit(1)
  }
}

start()
