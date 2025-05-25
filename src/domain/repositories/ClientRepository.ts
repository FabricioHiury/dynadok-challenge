import { BaseRepository } from '@/shared/BaseRepository'
import { Client } from '../entities/Client'

export interface ClientRepository extends BaseRepository<Client> {
  findByEmail(email: string): Promise<Client | null>
  findByPhone(phone: string): Promise<Client | null>
}
