import { Client } from '@/domain/entities/Client'
import { ClientRepository } from '@/domain/repositories/ClientRepository'
import { Either, left, right } from '@/shared/either'

export interface UpdateClientDTO {
  name?: string
  email?: string
  phone?: string
}

export class UpdateClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(
    id: string,
    data: UpdateClientDTO,
  ): Promise<Either<string, Client>> {
    try {
      if (!id || id.trim().length === 0) {
        return left('ID is required')
      }

      if (data.email && !data.email.includes('@')) {
        return left('Invalid email')
      }

      const existing = await this.clientRepository.findById(id)
      if (!existing) {
        return left(`Client with id ${id} not found`)
      }

      if (data.email) {
        const existingEmail = await this.clientRepository.findByEmail(
          data.email,
        )
        if (existingEmail && existingEmail.id !== id) {
          return left('Email already in use')
        }
      }

      if (data.phone) {
        const existingPhone = await this.clientRepository.findByPhone(
          data.phone,
        )
        if (existingPhone && existingPhone.id !== id) {
          return left('Phone already in use')
        }
      }

      const updatedClient = await this.clientRepository.update(id, data)
      return right(updatedClient)
    } catch (error) {
      return left(
        `Error to update client: ${
          error instanceof Error ? error.message : 'Error'
        }`,
      )
    }
  }
}
