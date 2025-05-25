import { Client } from '../Client';

describe('Client Entity', () => {
  it('should create a client with valid properties', () => {
    const client = new Client();
    client.name = 'João Silva';
    client.email = 'joao@email.com';
    client.phone = '11999999999';

    expect(client.name).toBe('João Silva');
    expect(client.email).toBe('joao@email.com');
    expect(client.phone).toBe('11999999999');
  });

  it('should inherit properties from BaseEntity', () => {
    const client = new Client();
    
    expect(client).toHaveProperty('id');
    expect(client).toHaveProperty('createdAt');
    expect(client).toHaveProperty('updatedAt');
  });
});