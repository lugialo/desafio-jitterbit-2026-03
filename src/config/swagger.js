import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Desafio Jitterbit - API de Pedidos",
      version: "1.0.0",
      description:
        "API REST para gerenciamento de pedidos desenvolvida em Node.js como parte do desafio Jitterbit. " +
        "Permite criação, leitura, atualização e exclusão de pedidos e armazenamento em MongoDB. " +
        "O campo `valorTotal` é calculado automaticamente como a soma de `valorItem × quantidadeItem` de cada item. " +
        "Todas as rotas de pedidos são protegidas por autenticação JWT.",
      contact: {
        name: "Gabriel Antonin Pascoali",
      },
    },
    servers: [
      {
        url: "http://localhost:{port}",
        description: "Servidor local",
        variables: {
          port: {
            default: "3333",
            description: "Porta do servidor (variável SERVER_PORT)",
          },
        },
      },
    ],
    tags: [
      {
        name: "Autenticação",
        description: "Geração de token JWT para acesso às rotas protegidas",
      },
      {
        name: "Pedidos",
        description:
          "Operações CRUD sobre pedidos. Os dados recebidos no formato de entrada são automaticamente mapeados para o formato interno do banco de dados.",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
          description:
            "Obtenha um token via POST /auth e insira-o aqui como: Bearer <token>",
        },
      },
      schemas: {
        // ── Schemas de entrada (formato enviado pelo cliente) ──
        ItemInput: {
          type: "object",
          description: "Item do pedido no formato de entrada",
          required: ["idItem", "quantidadeItem", "valorItem"],
          properties: {
            idItem: {
              type: "string",
              minLength: 1,
              description:
                "ID do produto (não pode ser vazio; será convertido para number no banco)",
              example: "2434",
            },
            quantidadeItem: {
              type: "integer",
              minimum: 1,
              description: "Quantidade do item (inteiro positivo)",
              example: 1,
            },
            valorItem: {
              type: "number",
              exclusiveMinimum: 0,
              description: "Preço unitário do item (deve ser positivo)",
              example: 1000,
            },
          },
        },
        OrderInput: {
          type: "object",
          description:
            "Payload para criação de pedido. O campo `valorTotal` é opcional pois é sempre recalculado a partir dos items.",
          required: ["numeroPedido", "dataCriacao", "items"],
          properties: {
            numeroPedido: {
              type: "string",
              minLength: 1,
              description: "Identificador único do pedido",
              example: "v10089015vdb-01",
            },
            valorTotal: {
              type: "number",
              description:
                "Valor total do pedido (opcional — será recalculado automaticamente como soma de valorItem × quantidadeItem)",
              example: 10000,
            },
            dataCriacao: {
              type: "string",
              format: "date-time",
              description: "Data de criação do pedido",
              example: "2023-07-19T12:24:11.5299601+00:00",
            },
            items: {
              type: "array",
              description: "Lista de itens do pedido (mínimo 1 item)",
              minItems: 1,
              items: { $ref: "#/components/schemas/ItemInput" },
            },
          },
        },
        OrderUpdateInput: {
          type: "object",
          description:
            "Payload para atualização do pedido. Todos os campos são opcionais — apenas os campos enviados serão atualizados. O `valorTotal` é recalculado automaticamente se `items` for informado.",
          properties: {
            numeroPedido: {
              type: "string",
              minLength: 1,
              description: "Novo identificador do pedido",
              example: "v10089015vdb-02",
            },
            valorTotal: {
              type: "number",
              description: "Será ignorado e recalculado se items for informado",
              example: 2000,
            },
            dataCriacao: {
              type: "string",
              format: "date-time",
              description: "Nova data de criação",
              example: "2023-07-19T12:24:11.5299601+00:00",
            },
            items: {
              type: "array",
              description:
                "Nova lista de itens (substituirá a lista inteira; mínimo 1 item se informado)",
              minItems: 1,
              items: { $ref: "#/components/schemas/ItemInput" },
            },
          },
        },

        // ── Schemas de resposta (formato armazenado no MongoDB) ──
        ItemResponse: {
          type: "object",
          description: "Item do pedido no formato do banco de dados",
          properties: {
            productId: {
              type: "number",
              description: "ID numérico do produto",
              example: 2434,
            },
            quantity: {
              type: "number",
              description: "Quantidade",
              example: 1,
            },
            price: {
              type: "number",
              description: "Preço unitário",
              example: 1000,
            },
          },
        },
        OrderResponse: {
          type: "object",
          description:
            "Pedido no formato retornado pela API (após transformação / mapping dos campos)",
          properties: {
            _id: {
              type: "string",
              description: "ID interno do MongoDB",
              example: "65f1a2b3c4d5e6f7a8b9c0d1",
            },
            orderId: {
              type: "string",
              description: "Identificador do pedido (mapeado de numeroPedido)",
              example: "v10089015vdb-01",
            },
            value: {
              type: "number",
              description:
                "Valor total calculado (soma de price × quantity de cada item)",
              example: 1000,
            },
            creationDate: {
              type: "string",
              format: "date-time",
              description: "Data de criação (mapeado de dataCriacao)",
              example: "2023-07-19T12:24:11.529Z",
            },
            items: {
              type: "array",
              description: "Itens do pedido no formato do banco",
              items: { $ref: "#/components/schemas/ItemResponse" },
            },
            __v: {
              type: "number",
              description: "Versão do documento (MongoDB)",
              example: 0,
            },
          },
        },
        ValidationError: {
          type: "object",
          description: "Erro de validação retornado pelo Zod",
          properties: {
            errors: {
              type: "array",
              items: {
                type: "object",
                properties: {
                  code: { type: "string", example: "invalid_type" },
                  expected: { type: "string", example: "string" },
                  path: {
                    type: "array",
                    items: { type: "string" },
                    example: ["numeroPedido"],
                  },
                  message: { type: "string", example: "Required" },
                },
              },
            },
          },
        },
        Error: {
          type: "object",
          properties: {
            error: { type: "string", example: "Pedido não encontrado." },
          },
        },
      },
    },
    security: [{ bearerAuth: [] }],
    paths: {
      // ────────────── Autenticação ──────────────
      "/auth": {
        post: {
          summary: "Gerar token JWT",
          description:
            "Autentica via `apiKey` e retorna um token JWT válido por 1 hora. " +
            "Use o token no header `Authorization: Bearer <token>` para acessar as rotas de pedidos.",
          tags: ["Autenticação"],
          security: [],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: {
                  type: "object",
                  required: ["apiKey"],
                  properties: {
                    apiKey: {
                      type: "string",
                      description:
                        "Chave de API (configurável via variável de ambiente API_KEY)",
                      example: "desafio-jitterbit",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Token gerado com sucesso",
              content: {
                "application/json": {
                  schema: {
                    type: "object",
                    properties: {
                      token: {
                        type: "string",
                        example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
                      },
                    },
                  },
                },
              },
            },
            400: {
              description: "apiKey não informada no body",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            401: {
              description: "apiKey inválida",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },

      // ────────────── Criar pedido ──────────────
      "/order": {
        post: {
          summary: "Criar um novo pedido",
          description:
            "Cria um novo pedido recebendo os dados no formato de entrada e realizando o mapping para o formato do banco. " +
            "O campo `valorTotal` é calculado automaticamente como a soma de `valorItem × quantidadeItem` de cada item. " +
            "Se já existir um pedido com o mesmo `numeroPedido`, retorna erro 409.",
          tags: ["Pedidos"],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderInput" },
                example: {
                  numeroPedido: "v10089015vdb-01",
                  valorTotal: 10000,
                  dataCriacao: "2023-07-19T12:24:11.5299601+00:00",
                  items: [
                    {
                      idItem: "2434",
                      quantidadeItem: 1,
                      valorItem: 1000,
                    },
                  ],
                },
              },
            },
          },
          responses: {
            201: {
              description: "Pedido criado com sucesso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/OrderResponse" },
                  example: {
                    _id: "65f1a2b3c4d5e6f7a8b9c0d1",
                    orderId: "v10089015vdb-01",
                    value: 1000,
                    creationDate: "2023-07-19T12:24:11.529Z",
                    items: [{ productId: 2434, quantity: 1, price: 1000 }],
                    __v: 0,
                  },
                },
              },
            },
            400: {
              description: "Payload inválido (erro de validação Zod)",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ValidationError" },
                },
              },
            },
            401: {
              description: "Token JWT ausente ou inválido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            409: {
              description: "Pedido já existe (numeroPedido duplicado)",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            500: {
              description: "Erro interno do servidor",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },

      // ────────────── Listar pedidos ──────────────
      "/order/list": {
        get: {
          summary: "Listar todos os pedidos",
          description:
            "Retorna um array com todos os pedidos cadastrados no banco de dados.",
          tags: ["Pedidos"],
          responses: {
            200: {
              description: "Lista de pedidos retornada com sucesso",
              content: {
                "application/json": {
                  schema: {
                    type: "array",
                    items: { $ref: "#/components/schemas/OrderResponse" },
                  },
                },
              },
            },
            401: {
              description: "Token JWT ausente ou inválido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            500: {
              description: "Erro interno do servidor",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },

      // ────────────── Buscar / Atualizar / Deletar pedido ──────────────
      "/order/{id}": {
        get: {
          summary: "Obter pedido por número",
          description:
            "Retorna os dados de um pedido específico passando o `orderId` (número do pedido) como parâmetro na URL.",
          tags: ["Pedidos"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Número do pedido (orderId)",
              schema: { type: "string" },
              example: "v10089015vdb-01",
            },
          ],
          responses: {
            200: {
              description: "Pedido encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/OrderResponse" },
                },
              },
            },
            401: {
              description: "Token JWT ausente ou inválido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            404: {
              description: "Pedido não encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },

        put: {
          summary: "Atualizar pedido",
          description:
            "Atualiza um pedido existente passando o `orderId` como parâmetro na URL. " +
            "Todos os campos do body são opcionais — apenas os campos enviados serão alterados. " +
            "Se `items` for informado, o `valorTotal` (value) é recalculado automaticamente.",
          tags: ["Pedidos"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Número do pedido (orderId) a ser atualizado",
              schema: { type: "string" },
              example: "v10089015vdb-01",
            },
          ],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/OrderUpdateInput" },
                examples: {
                  atualizarItems: {
                    summary: "Atualizar itens (value será recalculado)",
                    value: {
                      items: [
                        { idItem: "2434", quantidadeItem: 2, valorItem: 1500 },
                      ],
                    },
                  },
                  atualizarData: {
                    summary: "Atualizar apenas a data de criação",
                    value: {
                      dataCriacao: "2026-03-08T14:00:00Z",
                    },
                  },
                },
              },
            },
          },
          responses: {
            200: {
              description: "Pedido atualizado com sucesso",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/OrderResponse" },
                },
              },
            },
            400: {
              description: "Payload inválido (erro de validação Zod)",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/ValidationError" },
                },
              },
            },
            401: {
              description: "Token JWT ausente ou inválido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            404: {
              description: "Pedido não encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            500: {
              description: "Erro interno do servidor",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },

        delete: {
          summary: "Deletar pedido",
          description:
            "Remove um pedido pelo `orderId` passado como parâmetro na URL. Retorna status 204 (sem conteúdo) em caso de sucesso.",
          tags: ["Pedidos"],
          parameters: [
            {
              name: "id",
              in: "path",
              required: true,
              description: "Número do pedido (orderId) a ser removido",
              schema: { type: "string" },
              example: "v10089015vdb-01",
            },
          ],
          responses: {
            204: {
              description: "Pedido deletado com sucesso (sem conteúdo no body)",
            },
            401: {
              description: "Token JWT ausente ou inválido",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            404: {
              description: "Pedido não encontrado",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
            500: {
              description: "Erro interno do servidor",
              content: {
                "application/json": {
                  schema: { $ref: "#/components/schemas/Error" },
                },
              },
            },
          },
        },
      },
    },
  },
  apis: [],
};

export const swaggerSpec = swaggerJSDoc(options);
