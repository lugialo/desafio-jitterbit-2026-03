import { z } from "zod";

export const orderPayloadSchema = z
  .object({
    numeroPedido: z.string(),
    valorTotal: z.number(),
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
