import { ClientRepository } from '@/domain/repositories/ClientRepository'
import { Client } from '@/domain/entities/Client'
import { Either, left, right } from '@/shared/either'
import { redisClient } from '@/infrastructure/cache/redis'

const CACHE_TTL_SECONDS = 60 * 60 // 1 hour

function hydrateClient(obj: Client) {
  const c = new Client()
  c.id = obj.id
  c.name = obj.name
  c.email = obj.email
  c.phone = obj.phone
  c.createdAt = new Date(obj.createdAt)
  c.updatedAt = new Date(obj.updatedAt)
  return c
}

export class FindClientByIdUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(id: string): Promise<Either<string, Client>> {
    try {
      if (!id || id.trim().length === 0) {
        return left('ID is required')
      }

      const cacheKey = `client:${id}`
      const cached = await redisClient.get(cacheKey)
      if (cached) {
        const obj = JSON.parse(cached)
        return right(hydrateClient(obj))
      }

      const client = await this.clientRepository.findById(id)
      if (!client) {
        return left(`Client with id ${id} not found`)
      }

      await redisClient.set(
        cacheKey,
        JSON.stringify(client),
        'EX',
        CACHE_TTL_SECONDS,
      )

      return right(client)
    } catch (error) {
      return left(
        `Error to find client: ${
          error instanceof Error ? error.message : 'Error'
        }`,
      )
    }
  }
}
