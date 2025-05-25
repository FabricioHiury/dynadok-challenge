import { Client } from '@/domain/entities/Client'
import { ClientRepository } from '@/domain/repositories/ClientRepository'
import mongoose, { Schema, Document } from 'mongoose'

interface ClientDoc extends Document {
  name: string
  email: string
  phone: string
  createdAt: Date
  updatedAt: Date
}

const clientSchema = new Schema<ClientDoc>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
  },
  { timestamps: true },
)

const ClientModel = mongoose.model<ClientDoc>('Client', clientSchema)

export class MongoClientRepository implements ClientRepository {
  async create(item: Client): Promise<Client> {
    const doc = await ClientModel.create(item)
    return this.mapDocToClient(doc)
  }

  async update(id: string, data: Partial<Client>): Promise<Client> {
    const doc = await ClientModel.findByIdAndUpdate(id, data, { new: true })
    if (!doc) {
      throw new Error(`Client with id ${id} not found`)
    }
    return this.mapDocToClient(doc)
  }

  async findById(id: string): Promise<Client | null> {
    const doc = await ClientModel.findById(id)
    return doc ? this.mapDocToClient(doc) : null
  }

  async findAll(): Promise<Client[]> {
    const docs = await ClientModel.find()
    return docs.map((doc) => this.mapDocToClient(doc))
  }

  async findByEmail(email: string): Promise<Client | null> {
    const doc = await ClientModel.findOne({ email })
    return doc ? this.mapDocToClient(doc) : null
  }

  async findByPhone(phone: string): Promise<Client | null> {
    const doc = await ClientModel.findOne({ phone })
    return doc ? this.mapDocToClient(doc) : null
  }

  private mapDocToClient(doc: ClientDoc): Client {
    const client = new Client()
    client.id = doc.id
    client.name = doc.name
    client.email = doc.email
    client.phone = doc.phone
    client.createdAt = doc.createdAt
    client.updatedAt = doc.updatedAt
    return client
  }
}
