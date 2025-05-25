import { Request, Response } from 'express'
import { ClientController } from '../ClientController'
import { CreateClientUseCase } from '@/use-cases/CreateClientUseCase'
import { UpdateClientUseCase } from '@/use-cases/UpdateClientUseCase'
import { FindClientByIdUseCase } from '@/use-cases/FindClientByIdUseCase'
import { ListClientsUseCase } from '@/use-cases/ListClientsUseCase'
import { Client } from '@/domain/entities/Client'
import { left, right } from '@/shared/either'
import { v4 as uuid } from 'uuid'

jest.mock('@/use-cases/CreateClientUseCase')
jest.mock('@/use-cases/UpdateClientUseCase')
jest.mock('@/use-cases/FindClientByIdUseCase')
jest.mock('@/use-cases/ListClientsUseCase')
jest.mock('@/infrastructure/repositories/MongoClientRepository')

describe('ClientController', () => {
  let clientController: ClientController
  let mockRequest: Partial<Request>
  let mockResponse: Partial<Response>
  let mockCreateClientUseCase: jest.Mocked<CreateClientUseCase>
  let mockUpdateClientUseCase: jest.Mocked<UpdateClientUseCase>
  let mockFindClientByIdUseCase: jest.Mocked<FindClientByIdUseCase>
  let mockListClientsUseCase: jest.Mocked<ListClientsUseCase>

  beforeEach(() => {
    mockRequest = {
      body: {},
      params: {},
    }

    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    }

    mockCreateClientUseCase = {
      execute: jest.fn(),
    } as any

    mockUpdateClientUseCase = {
      execute: jest.fn(),
    } as any

    mockFindClientByIdUseCase = {
      execute: jest.fn(),
    } as any

    mockListClientsUseCase = {
      execute: jest.fn(),
    } as any
    ;(CreateClientUseCase as jest.Mock).mockImplementation(
      () => mockCreateClientUseCase,
    )
    ;(UpdateClientUseCase as jest.Mock).mockImplementation(
      () => mockUpdateClientUseCase,
    )
    ;(FindClientByIdUseCase as jest.Mock).mockImplementation(
      () => mockFindClientByIdUseCase,
    )
    ;(ListClientsUseCase as jest.Mock).mockImplementation(
      () => mockListClientsUseCase,
    )

    clientController = new ClientController()
  })

  describe('create', () => {
    it('should create a client successfully', async () => {
      const clientData = {
        name: 'João Silva',
        email: 'joao@email.com',
        phone: '11999999999',
      }

      const mockClient = new Client()
      mockClient.id = uuid()
      mockClient.name = clientData.name
      mockClient.email = clientData.email
      mockClient.phone = clientData.phone

      mockRequest.body = clientData
      mockCreateClientUseCase.execute.mockResolvedValue(right(mockClient))

      await clientController.create(
        mockRequest as Request,
        mockResponse as Response,
      )

      expect(mockResponse.status).toHaveBeenCalledWith(201)
      expect(mockResponse.json).toHaveBeenCalledWith(mockClient)
    })

    it('should return error when creation fails', async () => {
      mockRequest.body = {
        name: '',
        email: 'joao@email.com',
        phone: '11999999999',
      }
      mockCreateClientUseCase.execute.mockResolvedValue(
        left('Name is required'),
      )

      await clientController.create(
        mockRequest as Request,
        mockResponse as Response,
      )

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Name is required',
      })
    })
  })

  describe('findById', () => {
    it('should find a client by id successfully', async () => {
      const mockClient = new Client()
      mockClient.id = '1'
      mockClient.name = 'João Silva'

      mockRequest.params = { id: '1' }
      mockFindClientByIdUseCase.execute.mockResolvedValue(right(mockClient))

      await clientController.findById(
        mockRequest as Request,
        mockResponse as Response,
      )

      expect(mockResponse.json).toHaveBeenCalledWith(mockClient)
    })

    it('should return 404 when client is not found', async () => {
      mockRequest.params = { id: '999' }
      mockFindClientByIdUseCase.execute.mockResolvedValue(
        left('Client not found'),
      )

      await clientController.findById(
        mockRequest as Request,
        mockResponse as Response,
      )

      expect(mockResponse.status).toHaveBeenCalledWith(404)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Client not found',
      })
    })
  })

  describe('findAll', () => {
    it('should list all clients successfully', async () => {
      const mockClients = [
        {
          id: '1',
          name: 'João Silva',
          email: 'joao@email.com',
          phone: '11999999999',
        },
        {
          id: '2',
          name: 'Maria Santos',
          email: 'maria@email.com',
          phone: '11888888888',
        },
      ] as Client[]

      mockListClientsUseCase.execute.mockResolvedValue(right(mockClients))

      await clientController.findAll(
        mockRequest as Request,
        mockResponse as Response,
      )

      expect(mockResponse.json).toHaveBeenCalledWith(mockClients)
    })

    it('should handle errors when listing clients', async () => {
      mockListClientsUseCase.execute.mockResolvedValue(
        left('Error to list clients'),
      )

      await clientController.findAll(
        mockRequest as Request,
        mockResponse as Response,
      )

      expect(mockResponse.status).toHaveBeenCalledWith(400)
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Error to list clients',
      })
    })
  })
})
