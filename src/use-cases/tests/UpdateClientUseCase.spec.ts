import { ClientRepository } from '@/domain/repositories/ClientRepository'
import { UpdateClientDTO, UpdateClientUseCase } from '../UpdateClientUseCase'
import { Client } from '@/domain/entities/Client'
import { v4 as uuid } from 'uuid'
import { ClientFactory } from '@/tests/factories/ClientFactory'

const mockClientRepository: jest.Mocked<ClientRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
  findByEmail: jest.fn(),
  findByPhone: jest.fn(),
}

describe('UpdateClientUseCase', () => {
  let updateClientUseCase: UpdateClientUseCase

  beforeEach(() => {
    updateClientUseCase = new UpdateClientUseCase(mockClientRepository)
    jest.clearAllMocks()
  })

  it('should update a client successfully', async () => {
    const existingClient = ClientFactory.create()

    const updateData: UpdateClientDTO = {
      name: 'João Santos',
      email: 'joao.santos@email.com',
      phone: '11888888888',
    }

    const updatedClient = { ...existingClient, ...updateData }

    mockClientRepository.findById.mockResolvedValue(existingClient)
    mockClientRepository.update.mockResolvedValue(updatedClient)

    const result = await updateClientUseCase.execute(
      existingClient.id,
      updateData,
    )

    expect(result.isRight()).toBe(true)
    if (result.isRight()) {
      expect(result.value).toEqual(updatedClient)
    }
    expect(mockClientRepository.findById).toHaveBeenCalledWith(
      existingClient.id,
    )
    expect(mockClientRepository.update).toHaveBeenCalledWith(
      existingClient.id,
      expect.any(Object),
    )
  })

  it('should return error when client is not found', async () => {
    mockClientRepository.findById.mockResolvedValue(null)

    const updateData: UpdateClientDTO = {
      name: 'João Santos',
    }

    const missingId = '999'

    const result = await updateClientUseCase.execute(missingId, updateData)

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBe(`Client with id ${missingId} not found`)
    }
    expect(mockClientRepository.update).not.toHaveBeenCalled()
  })

  it('should return error when id is invalid', async () => {
    const updateData: UpdateClientDTO = {
      name: 'João Santos',
    }

    const result = await updateClientUseCase.execute('', updateData)

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBe('ID is required')
    }
    expect(mockClientRepository.findById).not.toHaveBeenCalled()
  })

  it('should handle repository errors', async () => {
    const existingClient = new Client()
    existingClient.id = uuid()

    mockClientRepository.findById.mockResolvedValue(existingClient)
    mockClientRepository.update.mockRejectedValue(new Error('Database error'))

    const updateData: UpdateClientDTO = {
      name: 'João Santos',
    }

    const result = await updateClientUseCase.execute('1', updateData)

    expect(result.isLeft()).toBe(true)
    if (result.isLeft()) {
      expect(result.value).toBe('Error to update client: Database error')
    }
  })
})
