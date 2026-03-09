import { z } from "zod";

export const orderPayloadSchema = z
  .object({
    numeroPedido: z.string(),
    // total enviado pelo cliente é ignorado; calculado no serviço
    valorTotal: z.number().optional(),
    dataCriacao: z.coerce.date(),
    items: z.array(
      z.object({
        idItem: z.string(),
        quantidadeItem: z.number(),
        valorItem: z.number(),
      }),
    ),
  }) // Mapping dos dados de entrada para o formato esperado pelo model
  .transform((data) => ({
    orderId: data.numeroPedido,
    value: data.valorTotal,
    creationDate: data.dataCriacao,
    items: data.items.map((item) => ({
      productId: Number(item.idItem),
      quantity: item.quantidadeItem,
      price: item.valorItem,
    })),
  }));

// Schema para update do pedido
export const orderUpdatePayloadSchema = z
  .object({
    numeroPedido: z.string().optional(),
    // O valorTotal é sempre calculado com base nos itens
    valorTotal: z.number().optional(),
    dataCriacao: z.coerce.date().optional(),
    items: z
      .array(
        z.object({
          idItem: z.string(),
          quantidadeItem: z.number(),
          valorItem: z.number(),
        }),
      )
      .optional(),
  })
  .transform((data) => {
    const result = {};
    if (data.numeroPedido !== undefined) {
      result.orderId = data.numeroPedido;
    }
    if (data.valorTotal !== undefined) {
      result.value = data.valorTotal;
    }
    if (data.dataCriacao !== undefined) {
      result.creationDate = data.dataCriacao;
    }
    if (data.items !== undefined) {
      result.items = data.items.map((item) => ({
        productId: Number(item.idItem),
        quantity: item.quantidadeItem,
        price: item.valorItem,
      }));
    }
    return result;
  });
