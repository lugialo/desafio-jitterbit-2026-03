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
  })
  .transform((data) => ({
    orderId: data.numeroPedido.split("-")[0],
    value: data.valorTotal,
    creationDate: data.dataCriacao,
    items: data.items.map((item) => ({
      productId: Number(item.idItem),
      quantity: item.quantidadeItem,
      price: item.valorItem,
    })),
  }));
