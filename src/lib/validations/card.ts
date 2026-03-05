import { z } from "zod";

export const createCardSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(200, "タイトルは200文字以内です"),
  listId: z.string().min(1),
});

export const updateCardSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  description: z.string().nullable().optional(),
  dueDate: z.string().nullable().optional(),
});

export const reorderCardSchema = z.object({
  cards: z.array(
    z.object({
      id: z.string(),
      listId: z.string(),
      position: z.number(),
    })
  ),
});
