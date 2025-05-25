import { ClientRepository } from '@/domain/repositories/ClientRepository'
import { ListClientsUseCase } from '../ListClientsUseCase'
import { ClientFactory } from '@/tests/factories/ClientFactory'
import { redisClient } from '@/infrastructure/cache/redis'

const mockClientRepository: jest.Mocked<ClientRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  findByEmail: jest.fn(),
  findByPhone: jest.fn(),
}

jest.mock('@/infrastructure/cache/redis', () => ({
  redisClient: {
    get: jest.fn(),
    set: jest.fn(),
  },
}))

describe('ListClientsUseCase', () => {
  let listClientsUseCase: ListClientsUseCase

  beforeEach(() => {
    ;(redisClient.get as jest.Mock).mockResolvedValue(null)
    listClientsUseCase = new ListClientsUseCase(mockClientRepository)
    jest.clearAllMocks()
  })

  it('should list all clients successfully', async () => {
    const mockClients = [ClientFactory.create(), ClientFactory.create()]

    mockClientRepository.findAll.mockResolvedValue(mockClients)

    const result = await listClientsUseCase.execute()

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value).toEqual(mockClients)
      expect(result.value).toHaveLength(2)
    }
    expect(mockClientRepository.findAll).toHaveBeenCalledTimes(1)
  })

  it('should return empty array when no clients exist', async () => {
    mockClientRepository.findAll.mockResolvedValue([])

    const result = await listClientsUseCase.execute()

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value).toEqual([])
      expect(result.value).toHaveLength(0)
    }
  })

  it('should handle repository errors', async () => {
    mockClientRepository.findAll.mockRejectedValue(new Error('Database error'))

    const result = await listClientsUseCase.execute()

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBe('Erro ao listar clientes: Database error')
    }
  })
})
