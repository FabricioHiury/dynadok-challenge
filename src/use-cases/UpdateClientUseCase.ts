import { Client } from "@/domain/entities/Client";
import { ClientRepository } from "@/domain/repositories/ClientRepository";
import { Either, left, right } from "@/shared/either";

export interface UpdateClientDTO {
  name?: string;
  email?: string;
  phone?: string;
}

export class UpdateClientUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(id: string, data: UpdateClientDTO): Promise<Either<string, Client>> {
    try {
      if (!id || id.trim().length === 0) {
        return left("ID é obrigatório");
      }

      if (data.email && !data.email.includes("@")) {
        return left("Email inválido");
      }

      const existing = await this.clientRepository.findById(id);
      if (!existing) {
        return left(`Cliente com id ${id} não encontrado`);
      }
      
      const updatedClient = await this.clientRepository.update(id, data);
      return right(updatedClient);
    } catch (error) {
      return left(`Erro ao atualizar cliente: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  }
}