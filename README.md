# Dynadok Challenge API

API RESTful para gerenciamento de clientes, construída em Express.js com TypeScript e seguindo princípios de Clean Architecture / DDD.

---

## 📂 Arquitetura do Projeto

```text
src/
├── adapters/
│   ├── controllers/      ↳ Controllers HTTP (Express)
│   ├── middlewares/      ↳ Middlewares (validação, error handler)
│   └── consumers/        ↳ Consumidores de mensagens (RabbitMQ)
├── domain/
│   ├── entities/         ↳ Entidades de domínio (Client)
│   └── repositories/     ↳ Portas (interfaces) de repositório
├── infrastructure/
│   ├── cache/            ↳ Configuração do Redis (cache)
│   ├── database/         ↳ Conexão com MongoDB
│   ├── messaging/        ↳ Configuração do RabbitMQ
│   └── repositories/     ↳ Implementações concretas de repositórios
├── shared/
│   ├── either.ts         ↳ Tipo `Either<L,R>` para fluxo funcional de erros
│   ├── BaseEntity.ts     ↳ Classe base de entidade
│   └── BaseRepository.ts ↳ Interface genérica de repositório
├── use-cases/            ↳ Casos de uso (Application Layer)
└── server.ts             ↳ Composition Root e bootstrap do Express
```

Este layout separa claramente as camadas:

* **Domain**: regras de negócio e entidades puras.
* **Use-cases**: orquestração das operações, usando interfaces do domínio.
* **Adapters**: convertem HTTP, mensageria e cache em chamadas aos use-cases.
* **Infrastructure**: integrações com MongoDB, Redis e RabbitMQ.

---

## 🚀 Levantar a aplicação com Docker

1. Garanta que você tenha o Docker e Docker Compose instalados.

2. Copie o arquivo `.env.example` para `.env` e ajuste se necessário.

3. Execute na raiz do projeto:

   ```bash
   docker-compose up --build
   ```

4. Serviços disponíveis:

   * **API**      → `http://localhost:3333`
   * **MongoDB**  → `mongodb://localhost:27017/dynadok`
   * **Redis**    → `redis://localhost:6379`
   * **RabbitMQ** → painel em `http://localhost:15672` (usuário `guest` / senha `guest`)

---

## 📦 Endpoints Disponíveis

Base URL: `http://localhost:3333/api/clients`

| Método | Rota   | Descrição                  | Body / Params                                 |
| :----: | :----- | :------------------------- | :-------------------------------------------- |
|  POST  | `/`    | Cria um novo cliente       | JSON `{ name, email, phone }`                 |
|   GET  | `/:id` | Busca cliente por ID       | Param `id` (24 caracteres)                    |
|   GET  | `/`    | Lista todos os clientes    | —                                             |
|   PUT  | `/:id` | Atualiza cliente existente | Param `id` + JSON `{ name?, email?, phone? }` |

### Exemplos

* **Criar cliente**:

  ```bash
  curl -X POST http://localhost:3333/api/clients \
    -H "Content-Type: application/json" \
    -d '{ "name": "Fulano Silva", "email": "fulano@example.com", "phone": "11999999999" }'
  ```

* **Buscar por ID**:

  ```bash
  curl http://localhost:3333/api/clients/650a9f1f2b8b7b00123abcde
  ```

* **Listar todos**:

  ```bash
  curl http://localhost:3333/api/clients
  ```

* **Atualizar**:

  ```bash
  curl -X PUT http://localhost:3333/api/clients/650a9f1f2b8b7b00123abcde \
    -H "Content-Type: application/json" \
    -d '{ "email": "novo@example.com" }'
  ```

---

## 🧪 Executar Testes

```bash
# Instale as dependências (usando npm ou pnpm)
npm install      # ou pnpm install

# Execute a suíte de testes
npm test         # ou pnpm test

# Relatório de cobertura
npm run coverage # se configurado no package.json
```

Todos os testes unitários para use-cases, entitidades e middlewares estão em `src/.../__tests__/`.

---

## 🔧 Observações

* A cada criação de cliente, um evento é publicado na fila `client.created` do RabbitMQ;
  um consumer dedicado (`src/adapters/consumers/clientCreatedConsumer.ts`) consome e faz log.
* Redis é usado para cache em `FindClientByIdUseCase` e `ListClientsUseCase`, com TTL configurável.
* A aplicação segue Clean Architecture/DDD, facilitando escalabilidade e testes isolados.