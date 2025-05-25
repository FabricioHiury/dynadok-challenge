import express from 'express'
import ClientRoutes from './adapters/controllers/client.routes'
import { startClientCreatedConsumer } from './adapters/consumers/clientCreatedConsumer'
import './infrastructure/database/mongodb'

const app = express()
app.use(express.json())
startClientCreatedConsumer()
app.use('/api/clients', ClientRoutes)

const PORT = process.env.PORT || 3333
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
