import { ClientRepository } from '@/domain/repositories/ClientRepository'
import { CreateClientDTO, CreateClientUseCase } from '../CreateClientUseCase'
import { faker } from '@faker-js/faker/locale/pt_BR'
import { ClientFactory } from '@/tests/factories/ClientFactory'

jest.mock('@/infrastructure/messaging/rabbitmq', () => ({
  getChannel: jest.fn().mockResolvedValue({
    assertQueue: jest.fn().mockResolvedValue(undefined),
    sendToQueue: jest.fn().mockReturnValue(undefined),
  }),
}))

const mockClientRepository: jest.Mocked<ClientRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  findByEmail: jest.fn(),
  findByPhone: jest.fn(),
}

describe('CreateClientUseCase', () => {
  let createClientUseCase: CreateClientUseCase

  beforeEach(() => {
    createClientUseCase = new CreateClientUseCase(mockClientRepository)
    jest.clearAllMocks()
  })

  it('should create a client successfully', async () => {
    const clientData = ClientFactory.createDTO()
    const mockCreatedClient = ClientFactory.create(clientData)

    mockClientRepository.create.mockResolvedValue(mockCreatedClient)

    const result = await createClientUseCase.execute(clientData)

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value).toEqual(mockCreatedClient)
    }
    expect(mockClientRepository.create).toHaveBeenCalledTimes(1)
  })

  it('should return error when name is empty', async () => {
    const clientData: CreateClientDTO = {
      name: '',
      email: faker.internet.email(),
      phone: faker.phone.number(),
    }

    const result = await createClientUseCase.execute(clientData)

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBe('Name is required')
    }
    expect(mockClientRepository.create).not.toHaveBeenCalled()
  })

  it('should return error when email is invalid', async () => {
    const clientData: CreateClientDTO = {
      name: 'João Silva',
      email: 'email-invalido',
      phone: '11999999999',
    }

    const result = await createClientUseCase.execute(clientData)

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBe('Invalid email')
    }
    expect(mockClientRepository.create).not.toHaveBeenCalled()
  })

  it('should return error when phone is empty', async () => {
    const clientData: CreateClientDTO = {
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '',
    }

    const result = await createClientUseCase.execute(clientData)

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBe('Phone is required')
    }
    expect(mockClientRepository.create).not.toHaveBeenCalled()
  })

  it('should handle repository errors', async () => {
    const clientData: CreateClientDTO = {
      name: 'João Silva',
      email: 'joao@email.com',
      phone: '11999999999',
    }

    mockClientRepository.create.mockRejectedValue(new Error('Database error'))

    const result = await createClientUseCase.execute(clientData)

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBe('Error to create client: Database error')
    }
  })
})
