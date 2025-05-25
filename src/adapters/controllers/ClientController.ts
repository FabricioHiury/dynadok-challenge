import { MongoClientRepository } from '@/infrastructure/repositories/MongoClientRepository'
import { CreateClientUseCase } from '@/use-cases/CreateClientUseCase'
import { FindClientByIdUseCase } from '@/use-cases/FindClientByIdUseCase'
import { ListClientsUseCase } from '@/use-cases/ListClientsUseCase'
import { UpdateClientUseCase } from '@/use-cases/UpdateClientUseCase'
import { Request, Response } from 'express'

export class ClientController {
  private createClient: CreateClientUseCase
  private updateClient: UpdateClientUseCase
  private findClientById: FindClientByIdUseCase
  private listClients: ListClientsUseCase

  constructor() {
    const clientRepository = new MongoClientRepository()
    this.createClient = new CreateClientUseCase(clientRepository)
    this.updateClient = new UpdateClientUseCase(clientRepository)
    this.findClientById = new FindClientByIdUseCase(clientRepository)
    this.listClients = new ListClientsUseCase(clientRepository)
  }

  async create(req: Request, res: Response) {
    const result = await this.createClient.execute(req.body)

    if (result.isLeft()) {
      res.status(400).json({ error: result.value })
    }

    res.status(201).json(result.value)
  }

  async update(req: Request, res: Response) {
    const result = await this.updateClient.execute(req.params.id, req.body)

    if (result.isLeft()) {
      const errorMessage = result.value
      if (errorMessage.includes('não encontrado')) {
        res.status(404).json({ error: errorMessage })
      }
      res.status(400).json({ error: errorMessage })
    }

    res.json(result.value)
  }

  async findById(req: Request, res: Response) {
    const result = await this.findClientById.execute(req.params.id)

    if (result.isLeft()) {
      const errorMessage = result.value
      if (errorMessage.includes('não encontrado')) {
        res.status(404).json({ error: errorMessage })
      }
      res.status(400).json({ error: errorMessage })
    }

    res.json(result.value)
  }

  async findAll(_req: Request, res: Response) {
    const result = await this.listClients.execute()

    if (result.isLeft()) {
      res.status(400).json({ error: result.value })
    }

    res.json(result.value)
  }
}
