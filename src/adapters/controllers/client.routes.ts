import { Router } from 'express'
import asyncHandler from 'express-async-handler'
import { ClientController } from './ClientController'
import {
  validateCreateClient,
  validateId,
  validateUpdateClient,
} from '../middlewares/validation'

const ClientRoutes = Router()
const clientController = new ClientController()

ClientRoutes.post(
  '/',
  validateCreateClient,
  asyncHandler(clientController.create.bind(clientController)),
)

ClientRoutes.put(
  '/:id',
  validateId,
  validateUpdateClient,
  asyncHandler(clientController.update.bind(clientController)),
)

ClientRoutes.get(
  '/:id',
  validateId,
  asyncHandler(clientController.findById.bind(clientController)),
)

ClientRoutes.get(
  '/',
  asyncHandler(clientController.findAll.bind(clientController)),
)

export default ClientRoutes
