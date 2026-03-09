# Desafio Jitterbit - API de Pedidos

Este repositório contém a solução para o teste da Jitterbit. A aplicação é uma API REST simples em Node.js para
criação, leitura, atualização e exclusão de pedidos, com armazenamento em
MongoDB e autenticação de rotas via JWT. A arquitetura do projeto segue princípios de orientação a objetos e está organizada em camadas, incluindo controllers, services e models, com o objetivo de promover melhor separação de responsabilidades.

## Como executar

1. Clone o repositório:
   ```
   git clone https://github.com/lugialo/desafio-jitterbit-2026-03.git
   cd desafio-jitterbit-2026-03
   ```
2. Instale as dependências:
   ```bash
   npm install
   ```
3. (Opcional) inicie o banco MongoDB via Docker:
   ```bash
   docker-compose up -d
   ```
4. Defina as variáveis de ambiente (`.env`):
   ```env
   SERVER_PORT=3333
   MONGODB_URL=mongodb://localhost:27017/jitterbit
   API_KEY=desafio-jitterbit    # chave usada em /auth
   JWT_SECRET=<segredo>
   FRONTEND_URL=http://localhost:3000
   ```
   (você também pode copiar o .env.example, se preferir)
5. Inicie o servidor em modo desenvolvimento:
   ```bash
   npm run dev
   ```
6. A documentação pode ser acessada em: [http://localhost:3333/docs](http://localhost:3333/docs) |

> Para rotas protegidas, inclua header
> `Authorization: Bearer <token>` obtido em `/auth`.

## Estrutura geral

```
src/
  app.js            # configuração Express + Swagger
  server.js         # ponto de entrada
  config/
    database.js     # conexão MongoDB
    swagger.js      # spec OpenAPI
  controllers/
    order.controller.js
    auth.controller.js
  middlewares/
    authentication/auth.js
    validation/orderPayloadSchema.js
  models/
    Order.js
  routes/
    index.js
    auth.routes.js
    order.routes.js
  services/
    order.service.js
```

---
