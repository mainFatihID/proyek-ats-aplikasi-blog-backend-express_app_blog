import {z} from 'zod';

export const createPostSchema = z.object({
    category_id: z.string().min(1, "Category ID is required"),
    post_id: z.string().min(1, "Post ID is required"),
    post_title: z.string().min(3, "Post Title must be at least 3 characters"),
    post_content: z.string().min(10, "Post Content must be atleast 10 characters")
})

export const updatePostSchema = createPostSchema.partial()