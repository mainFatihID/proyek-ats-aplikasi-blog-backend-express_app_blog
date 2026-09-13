import {z} from 'zod';

export const createCategorySchema = z.object({
    category_id: z.string().min(1, "Category ID is required"),
    category_name: z.string().min(3, "Category Name must be atleast 3 characters"),
    category_description: z.string().optional()
})

export const updateCategorySchema = createCategorySchema.partial();