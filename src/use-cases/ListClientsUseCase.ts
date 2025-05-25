import { ClientRepository } from "@/domain/repositories/ClientRepository";
import { Client } from "@/domain/entities/Client";
import { Either, left, right } from "@/shared/either";
import { redisClient } from "@/infrastructure/cache/redis";

const ALL_CACHE_KEY = "clients:all";
const CACHE_TTL_SECONDS = 60 * 60; // 1 hour

export class ListClientsUseCase {
  constructor(private clientRepository: ClientRepository) {}

  async execute(): Promise<Either<string, Client[]>> {
    const cached = await redisClient.get(ALL_CACHE_KEY);
    if (cached) {
      const arr = JSON.parse(cached) as any[];
      const clients = arr.map((obj) => {
        const c = new Client();
        Object.assign(c, {
          ...obj,
          createdAt: new Date(obj.createdAt),
          updatedAt: new Date(obj.updatedAt),
        });
        return c;
      });
      return right(clients);
    }

    try {
      const clients = await this.clientRepository.findAll();
      await redisClient.set(
        ALL_CACHE_KEY,
        JSON.stringify(clients),
        "EX",
        CACHE_TTL_SECONDS
      );
      return right(clients);
    } catch (error) {
      return left(
        `Erro ao listar clientes: ${
          error instanceof Error ? error.message : "Erro desconhecido"
        }`
      );
    }
  }
}
