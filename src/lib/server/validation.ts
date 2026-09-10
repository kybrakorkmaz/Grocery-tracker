import { z } from "zod";

export const CreateItemSchema = z.object({
    name: z.string().trim().min(1, "Name is required"),
    category: z.enum(["Produce", "Dairy", "Bakery", "Pantry", "Snacks"], {
        message: "Invalid category",
    }),
    quantity: z.number().int().min(1, "Quantity must be at least 1").default(1),
    priority: z.enum(["low", "medium", "high"], {
        message: "Invalid priority",
    }),
});

export const UpdateItemSchema = z.object({
    quantity: z.number().int().min(1, "Quantity must be at least 1").optional(),
    purchased: z.boolean().optional(),
}).refine(
    (data) => data.quantity !== undefined || data.purchased !== undefined,
    { message: "Either quantity or purchased must be provided" }
);

export type CreateItemInput = z.infer<typeof CreateItemSchema>;
export type UpdateItemInput = z.infer<typeof UpdateItemSchema>;
