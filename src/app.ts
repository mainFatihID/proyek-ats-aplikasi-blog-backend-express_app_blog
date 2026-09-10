import express, {type Express, type Request, type Response} from 'express';
import cors from 'cors';
import pool from './db/index.ts';

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World!')
});

// GET Categories
app.get('/api/categories/db_app_blog', async (req: Request, res: Response) => {
    try {
        const categories = await pool.query("SELECT * FROM tb_blog_categories")
        
        res.status(200).json({
            message : "Categories data successfuly fetched!",
            data    : categories[0]
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error!", error})
    }
});

// GET Posts
app.get('/api/posts/db_app_blog', async (req: Request, res: Response) => {
    try {
        const posts = await pool.query("SELECT * FROM tb_blog_posts")
        
        res.status(200).json({
            message : "Posts data successfuly fetched",
            data    : posts[0]
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Internal server error!", error})
    }
});

// POST Categories
app.post('/api/categories/db_app_blog', async (req: Request, res: Response) => {
    try {
        const {
            category_id, 
            category_name, 
            category_description
        } = req.body;

        const [result]: any = await pool.query(
            "INSERT INTO tb_blog_categories (category_id, category_name, category_description) VALUES (?, ?, ?)",
            [
                category_id, 
                category_name, 
                category_description
            ]
        )

        if (result.affectedRows > 0) {    
            res.status(201).json({
                message: "Category added successfully!",
                affectedRows: result.affectedRows,
                data: {category_id, category_name, category_description}
            })
        }

    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Failed to add category!", error});
    }
});

// POST Posts
app.post('/api/posts/db_app_blog', async (req: Request, res: Response) => {
    try {
        const {
            category_id, 
            post_id, 
            post_title,
            post_content
        } = req.body;

        const [result]: any = await pool.query(
            "INSERT INTO tb_blog_posts (category_id, post_id, post_title, post_content) VALUES (?, ?, ?, ?)",
            [
                category_id, 
                post_id, 
                post_title,
                post_content
            ]
        )

        if (result.affectedRows > 0) {
            res.status(201).json({
                message: "Post added successfully!",
                affectedRows: result.affectedRows,
                data: {
                    category_id,
                    post_id,
                    post_title,
                    post_content
                }
            })
        }
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Failed to add post!", error});
    }
});

// Put Categories
app.put('/api/categories/db_app_blog/:category_id', async (req: Request, res: Response) => {
    try {
        const {category_id} = req.params;
        const {
            category_name, 
            category_description

        } = req.body;

        const [result] = await pool.query(
            "UPDATE tb_blog_categories SET category_name = ?, category_description = ? WHERE category_id = ?",
            [
                category_name,
                category_description,
                category_id
            ]
        );

        res.status(200).json({
            message: "Category succesfully updated!",
            data: result
        })
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Failed to update category!", error})
    }
})

// PUT Posts
app.put('/api/posts/db_app_blog/:post_id', async (req: Request, res: Response) => {
    try {
        const {post_id} = req.params;
        const {
            post_title, 
            post_content
        } = req.body;

        const [result] = await pool.query(
            "UPDATE tb_blog_posts SET post_title = ?, post_content = ? WHERE post_id = ?",
            [
                post_title,
                post_content,
                post_id
            ]
        );

        res.status(200).json({
            message: "Post succesfully updated!",
            data: result
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Failed to update post!", error});
    }
});

app.patch('/api/categories/db_app_blog/:category_id', async (req: Request, res: Response) => {
    try {
        const {category_id} = req.params;
        const {
            category_name,
            category_description
        } = req.body;

        const [result]: any = await pool.query(
            `UPDATE tb_blog_categories
            SET category_name = COALESCE(?, category_name),
                category_description = COALESCE(?, category_description)
            WHERE category_id = ?`,
            [
                category_name ?? null, 
                category_description ?? null, 
                category_id
            ]
        )

        res.status(200).json({
            message: "Category update successfully!",
            data: result
        })
    } catch (error) {
        res.status(500).json({message: "Failed to update category!", error})
    }
})

app.patch('/api/posts/db_app_blog/:post_id', async (req: Request, res: Response) => {
    try {
        const {post_id} = req.params;
        const {
            post_title,
            post_content
        } = req.body;

        const [result]: any = await pool.query(
            `UPDATE tb_blog_posts
            SET post_title = COALESCE(?, post_title),
                post_content = COALESCE(?, post_content)
            WHERE post_id = ?`,
            [
                post_title ?? null, 
                post_content ?? null, 
                post_id
            ]
        )

        res.status(200).json({
            message: "Post update successfully!",
            data: result
        })
    } catch (error) {
        res.status(500).json({message: "Failed to update post!", error})
    }
})

app.delete("/api/categories/db_app_blog/:category_id", async (req: Request, res: Response) => {
    try{
        const {category_id} = req.params
        const [result]: any  = await pool.query("DELETE FROM tb_blog_categories WHERE category_id = ?", [category_id])

        res.status(200).json({
            message: "Category succesfully deleted!",
            data: result
        })

        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Category not found!"})
        }

        res.status(200).json({
            message: "Category succesfully deleted!",
            data: result
        });
    } catch (error) {
        console.error(error)
        res.status(500).json({message: "Failed to delete category!", error});
    }
});

// DELETE Posts
app.delete("/api/posts/db_app_blog/:post_id", async (req: Request, res: Response) => {
    try{
        const {post_id} = req.params
        const [result]: any = await pool.query("DELETE FROM tb_blog_posts WHERE post_id = ?", [post_id])

        res.status(200).json({
            message: "Post succesfully deleted!",
            data: result
        })

        if (result.affectedRows === 0) {
            return res.status(404).json({message: "Category not found!"})
        }

        res.status(200).json({
            message: "Category succesfully deleted!",
            data: result
        })
    } catch(error) {
        console.error(error)
        res.status(500).json({message: "Failed to delete post!", error});
    }
});

app.listen(port, () => {
  console.log(`Attention, Express.js is listening on port ${port}. Open http://localhost:${port} in ThunderClient or any Fetched Front-End.`)
})  
