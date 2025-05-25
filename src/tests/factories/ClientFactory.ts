import { faker } from '@faker-js/faker/locale/pt_BR';
import { Client } from '@/domain/entities/Client';
import { v4 as uuid } from 'uuid';

export class ClientFactory {
  static create(override: Partial<Client> = {}): Client {
    const client = new Client();
    client.id = override.id || uuid();
    client.name = override.name || faker.person.fullName();
    client.email = override.email || faker.internet.email();
    client.phone = override.phone || faker.phone.number();
    client.createdAt = override.createdAt || new Date();
    client.updatedAt = override.updatedAt || new Date();
    return client;
  }

  static createDTO(override: Partial<Client> = {}): {
    name: string;
    email: string;
    phone: string;
  } {
    return {
      name: override.name || faker.person.fullName(),
      email: override.email || faker.internet.email(),
      phone: override.phone || faker.phone.number(),
    };
  }
}