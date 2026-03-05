import { z } from "zod";

export const createListSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(100, "タイトルは100文字以内です"),
});

export const updateListSchema = z.object({
  title: z.string().min(1, "タイトルは必須です").max(100, "タイトルは100文字以内です"),
});

export const reorderListSchema = z.object({
  orderedIds: z.array(z.string()),
});
