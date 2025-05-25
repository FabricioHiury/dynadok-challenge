# Dynadok Challenge API

API RESTful para gerenciamento de clientes, construída em Express.js com TypeScript e seguindo princípios de Clean Architecture / DDD.

---

## Estrutura do Projeto

```
.
├── .github
│   └── workflows
│       └── ci.yml               # CI/CD via GitHub Actions
├── src
│   ├── adapters
│   │   ├── controllers
│   │   │   ├── ClientController.ts
│   │   │   ├── client.routes.ts
│   │   │   └── tests            # testes de integração do controller
│   │   ├── middlewares
│   │   │   ├── validation.ts
│   │   └── consumers
│   │       └── clientCreatedConsumer.ts
│   ├── domain
│   │   ├── entities
│   │   │   ├── Client.ts
│   │   │   └── tests            # testes de entidade/domain
│   │   └── repositories
│   │       └── ClientRepository.ts
│   ├── infrastructure
│   │   ├── cache
│   │   │   └── redis.ts
│   │   ├── database
│   │   │   └── mongo.ts
│   │   ├── messaging
│   │   │   └── rabbitmq.ts
│   │   └── repositories
│   │       └── MongoClientRepository.ts
│   ├── shared
│   │   ├── either.ts             # Tipo `Either<L,R>` para fluxo funcional de erros
│   │   ├── BaseEntity.ts         # Classe base para entidades
│   │   └── BaseRepository.ts     # Classe base para repositórios
│   ├── use-cases
│   │   ├── CreateClientUseCase.ts
│   │   ├── FindClientByIdUseCase.ts
│   │   ├── ListClientsUseCase.ts
│   │   ├── UpdateClientUseCase.ts
│   │   └── tests                # testes unitários dos use-cases
│   └── server.ts                # Composition Root / bootstrap do Express
├── .dockerignore
├── .env                         # variáveis de ambiente
├── .eslintrc.json
├── .gitignore
├── Dockerfile                   # multi-stage com pnpm & Alpine
├── docker-compose.yml
├── jest.config.ts
├── package.json
├── pnpm-lock.yaml
├── README.md
└── tsconfig.json
```

---

## Subir tudo com Docker

1. **Crie** (ou renomeie) seu arquivo `.env` na raiz do projeto, copiando o modelo abaixo:
   ```dotenv
   NODE_ENV=development
   PORT=3333
   MONGO_URI=mongodb://mongo:27017/dynadok
   REDIS_URL=redis://redis:6379
   RABBITMQ_URL=amqp://rabbitmq
   RABBITMQ_DEFAULT_USER=guest
   RABBITMQ_DEFAULT_PASS=guest
   ```
2. Garanta que Docker e Docker Compose estejam instalados.
3. Na raiz do projeto, execute:
   ```bash
   docker-compose up --build
   ```
4. Acesse:
   - **API**        → `http://localhost:3333`
   - **MongoDB**    → `mongodb://localhost:27017/dynadok`
   - **Redis**      → `redis://localhost:6379`
   - **RabbitMQ**   → painel em `http://localhost:15672` (usuário: `guest` / senha: `guest`)

---

## Scripts de Desenvolvimento

| Script           | Descrição                                  |
|------------------|---------------------------------------------|
| `pnpm install`   | Instala dependências                       |
| `pnpm dev`       | Inicia em modo dev (ts-node-dev + watch)   |
| `pnpm build`     | Transpila TypeScript para `dist/`          |
| `pnpm start`     | Executa build em `dist/`                   |
| `pnpm test`      | Roda testes via Jest                       |

> Se você estiver usando npm, substitua `pnpm` por `npm` nos comandos acima.

---

## Endpoints Disponíveis

Base URL: `http://localhost:3333/api/clients`

| Método | Rota    | Descrição                    | Body / Params                                 |
|:------:|:--------|:-----------------------------|:-----------------------------------------------|
| POST   | `/`     | Cria um novo cliente         | JSON `{ name, email, phone }`                  |
| GET    | `/:id`  | Busca cliente por ID         | Param `id` (24 caracteres)                     |
| GET    | `/`     | Lista todos os clientes      | —                                              |
| PUT    | `/:id`  | Atualiza cliente existente   | Param `id` + JSON `{ name?, email?, phone? }` |

### Exemplos `curl`

```bash
# Criar cliente
curl -X POST http://localhost:3333/api/clients   -H "Content-Type: application/json"   -d '{ "name": "Fulano Silva", "email": "fulano@example.com", "phone": "11999999999" }'

# Buscar por ID
curl http://localhost:3333/api/clients/650a9f1f2b8b7b00123abcde

# Listar todos
curl http://localhost:3333/api/clients

# Atualizar
curl -X PUT http://localhost:3333/api/clients/650a9f1f2b8b7b00123abcde   -H "Content-Type: application/json"   -d '{ "email": "novo@example.com" }'
```

---

## Testes

- Se ainda não instalou as dependências:
  ```bash
  pnpm install
  ```
- Execute:
  ```bash
  pnpm test
  ```
- Para gerar cobertura:
  ```bash
  pnpm test -- --coverage
  ```

Os testes unitários estão em `src/use-cases/tests`, `src/adapters/controllers/tests` e `src/domain/entities/tests`.

---

## CI/CD

O pipeline de CI está em `.github/workflows/ci.yml`, que:

1. Faz checkout do código.  
2. Habilita Corepack & `pnpm`.  
3. Instala dependências (`pnpm install --frozen-lockfile`).  
4. Roda linter, build e testes.  
5. Publica `dist/` como artefato.

---

## Arquitetura em Camadas

1. **Domain**:  
   - Entidades puras e interfaces de repositório.  
2. **Use-cases (Application)**:  
   - Orquestram a lógica de negócio via portas (interfaces).  
3. **Adapters**:  
   - **Controllers**: convertem HTTP → use-cases.  
   - **Middlewares**: validação (`validation.ts`) e tratamento de erros (`errorHandler.ts`).  
   - **Consumers**: processam eventos RabbitMQ.  
4. **Infrastructure**:  
   - **MongoDB** (`mongo.ts`) e repositório concreto (`MongoClientRepository.ts`).  
   - **Redis** (`redis.ts`) para cache em consultas.  
   - **RabbitMQ** (`rabbitmq.ts`) para mensageria.  
5. **Composition Root** (`server.ts`):  
   - Monta todas as dependências e inicializa o Express.