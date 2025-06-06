import { ClientRepository } from '@/domain/repositories/ClientRepository'
import { Client } from '@/domain/entities/Client'
import { Either, left, right } from '@/shared/either'
import { getChannel } from '@/infrastructure/messaging/rabbitmq'

export interface CreateClientDTO {
  name: string
  email: string
  phone: string
}

export class CreateClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(data: CreateClientDTO): Promise<Either<string, Client>> {
    try {
      if (!data.name || data.name.trim().length === 0) {
        return left('Name is required')
      }

      if (!data.email || !data.email.includes('@')) {
        return left('Invalid email')
      }

      if (!data.phone || data.phone.trim().length === 0) {
        return left('Phone is required')
      }

      const existingEmail = await this.clientRepository.findByEmail(data.email)
      if (existingEmail) return left('Email already in use')

      const existingPhone = await this.clientRepository.findByPhone(data.phone)
      if (existingPhone) return left('Phone already in use')

      const client = new Client()
      client.name = data.name
      client.email = data.email
      client.phone = data.phone

      const createdClient = await this.clientRepository.create(client)

      const channel = await getChannel()
      const queue = 'client.created'
      await channel.assertQueue(queue, { durable: true })
      channel.sendToQueue(queue, Buffer.from(JSON.stringify(createdClient)))

      return right(createdClient)
    } catch (error) {
      return left(
        `Error to create client: ${
          error instanceof Error ? error.message : 'Error'
        }`,
      )
    }
  }
}
