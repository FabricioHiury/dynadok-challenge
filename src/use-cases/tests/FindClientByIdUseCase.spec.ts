import { ClientRepository } from "@/domain/repositories/ClientRepository";
import { FindClientByIdUseCase } from "../FindClientByIdUseCase";
import { ClientFactory } from "@/tests/factories/ClientFactory";

const mockClientRepository: jest.Mocked<ClientRepository> = {
  create: jest.fn(),
  update: jest.fn(),
  findById: jest.fn(),
  findAll: jest.fn(),
};

describe('FindClientByIdUseCase', () => {
  let findClientByIdUseCase: FindClientByIdUseCase;

  beforeEach(() => {
    findClientByIdUseCase = new FindClientByIdUseCase(mockClientRepository);
    jest.clearAllMocks();
  });

  it('should find a client by id successfully', async () => {
    const mockClient = ClientFactory.create();

    mockClientRepository.findById.mockResolvedValue(mockClient);

    const result = await findClientByIdUseCase.execute(mockClient.id);

    expect(result.isRight()).toBe(true);
    if (result.isRight()) {
      expect(result.value).toEqual(mockClient);
    }
    expect(mockClientRepository.findById).toHaveBeenCalledWith(mockClient.id);
  });

  it('should return error when client is not found', async () => {
    mockClientRepository.findById.mockResolvedValue(null);

    const result = await findClientByIdUseCase.execute('999');

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBe('Cliente não encontrado');
    }
  });

  it('should return error when id is invalid', async () => {
    const result = await findClientByIdUseCase.execute('');

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBe('ID é obrigatório');
    }
    expect(mockClientRepository.findById).not.toHaveBeenCalled();
  });

  it('should handle repository errors', async () => {
    mockClientRepository.findById.mockRejectedValue(new Error('Database error'));

    const result = await findClientByIdUseCase.execute('1');

    expect(result.isLeft()).toBe(true);
    if (result.isLeft()) {
      expect(result.value).toBe('Erro ao buscar cliente: Database error');
    }
  });
});