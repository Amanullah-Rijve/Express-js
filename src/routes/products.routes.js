import {Router} from 'express';
import pool from '../config/db.js';

const router = Router();

// Midleware
const findProduct = async (req,res,next)=>{
    try {
        const[rows]=await pool.query(
            'SELECT * FROM products WHERE id=?',
            [req.params.id]
        );

        if(rows.length===0){
            return res.status(404).json({
                success:false,
                message:'product not found'
            });
        }
        req.product=rows[0];
        next();
    } catch (error) {
        next(error);
    };
};

// Routes -----------
// ------ GET All product
router.get('/',async(req,res,next)=>{
    try {
        const [rows]= await pool.query(
            'SELECT * FROM products ORDER BY created_at DESC'
        );
        res.status(200).json({
            success: true,
            count: rows.length,
            data:rows
        });
    } catch (error) {
        next(error);
    }
});

// GET product by id
router.get('/:id',findProduct,(req,res,next)=>{
    res.status(200).json({
        success: true,
        data: req.product
    });
});

// add product
router.post('/', async(req,res,next)=>{
    try {
        const {name,price,stock}=req.body;

        if(!name ||!price ||!stock === undefined){
        return res.status(400).json({
            success:false,
            message: 'name,price,stock must be given'
        });
        };

        if(price <0 || stock <0){
            return res.status(400).json({
                success: false,
                message: 'price and stock must be positive'
            });
        };
        const [result]= await pool.query(
            'INSERT INTO products (name.price,stock) VALUES(?,?,?)',
            [name,price,stock]
        );
        res.status(200).json({
            success:true,
            message:'product added',
            data: {id:result.insertId,name,price,stock}
        });
    } catch (error) {
        next(error);
    }
});

// update all product
router.put('/:id',findProduct, async(req,res,next)=>{
    try {
        const {name,price,stock}=req.body;

        if(!name||!price||!stock === undefined){
            return res.status(400).json({
                success:false,
                message: ' name,price,stock must be given'
            });
        };
        await pool.query(
            'UPDATE products SET name=?,price=?,stock=? WHERE id=?',
            [name,price,stock]
        );
        res.status(200).json({
            success: true,
            message: 'updated succcessfully',
            data: {id: req.product,name,price,stock}
        });
    } catch (error) {
        next(error);
    }
});

// partial update
router.patch('/:id',findProduct, async(req,res,next)=>{
    try {
        const updates = req.body;
        const allowed = ['name','price','stock'];

        // just take selected part
        const fields = Object.keys(updates).filter(k=> allowed.includes(k)) 

        if(fields.length===0){
            return res.status(400).json({
                success:false,
                message:'only select those name,price,stock'
            });
        };

        // dynamic query
        const setClause = fields.map(f=> `${f} = ?`).join(', ');
        const Values= fields.map(f=> updates[f])
        Values.push(req.product.id);

        await pool.query(
            `UPDATE products SET ${setClause} WHERE id = ?`,
            Values
        )
        res.status(200).json({
        success: true,
        message: 'Product partialy updated',
        data: { ...req.product, ...updates }
    });

    } catch (error) {
        next(error);
    }
});

// delete products
router.delete('/:id',findProduct, async(req,res,next)=>{
    try {
        await pool.query(
            "DELETE FROM products WHERE id=?",
            [req.params.id]
        )
        res.status(200).json({
            success:true,
            message:'product deleted'
        });
    } catch (error) {
        next(error);
    }
});

export default router;

