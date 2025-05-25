import { BaseEntity } from '@/shared/BaseEntity'

export class Client extends BaseEntity {
  name: string
  email: string
  phone: string
}
