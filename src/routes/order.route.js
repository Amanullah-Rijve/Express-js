import { Route } from "express";
import pool from "../config/db.js";

const router = Route();

// GET All order
router.get('/',async (req,resizeBy,next)=>{
    try {
        // inner join
        const [rows]= await pool.query(
            `
            SELECT
            orders.id,
            orders.status,
            orders.total_price,
            orders.created_at,
            students.name AS student_name,
            students.department
            FROM orders
            INNER JOIN students ON orders.student_id=students.id
            ORDER BY orders.created_at DESC
            `
        )
        res.status(200).json({
            success:true,
            count: rows.length,
            data: rows
        });
    } catch (error) {
        
    }
});

// GET order ditails
router.get('/:id',async(req,res,next)=>{
    try{
        const [orders] = await pool.query(
    ` 
    SELECT 
    orders.id,
    orders.total_price,
    orders.created_at,
    students.name AS student_name
    FROM orders
    INNER JOIN students ON orders.student_id = students.id
    WHERE orders.id = ?
    `,
    [req.params.id])
        if (orders.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Order পাওয়া যায়নি'
      });
    };
    const [items]= await pool.query(
       `  SELECT 
        order_items.quantity,
        order_items.price,
        products.name AS product_name
      FROM order_items
      INNER JOIN products ON order_items.product_id = products.id
      WHERE order_items.order_id = ?
    `, [req.params.id]);

    res.status(200).json({
        success:true,
        data:{
            ...orders[0],items
        }
    })
    }
    catch(error){
    next(error);
    }
});

// new order POST
router.post('/',async(req,res,next)=>{
    const connection = await pool.getConnection();

    try {
        const {student_id,items}=req.body;
        // validation
        if(!student_id||!items||items.length===0){
            return res.status(404).json({
                success:false,
                message:'give student id and item'
            });
        }
        // cechk student 
        const [students]= await connection.query(
            'SELECT id FROM students WHERE id = ?',
      [student_id]
        )
         // Transaction শুরু করো
    await connection.beginTransaction();

    let total_price = 0;

    // Order বানাও
    const [orderResult] = await connection.query(
      'INSERT INTO orders (student_id, total_price) VALUES (?, ?)',
      [student_id, 0]
    );
    const order_id = orderResult.insertId;

    // প্রতিটা item process করো
    for (const item of items) {
      const [products] = await connection.query(
        'SELECT * FROM products WHERE id = ?',
        [item.product_id]
      );

      if (products.length === 0) {
        await connection.rollback();
        return res.status(404).json({
          success: false,
          message: `Product id ${item.product_id} পাওয়া যায়নি`
        });
      }

      const product = products[0];

      // Stock আছে কিনা check
      if (product.stock < item.quantity) {
        await connection.rollback();
        return res.status(400).json({
          success: false,
          message: `${product.name} এর stock কম`
        });
      }

      const itemPrice = product.price * item.quantity;
      total_price += itemPrice;

      // Order item যোগ করো
      await connection.query(
        'INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)',
        [order_id, item.product_id, item.quantity, itemPrice]
      );

      // Stock কমাও
      await connection.query(
        'UPDATE products SET stock = stock - ? WHERE id = ?',
        [item.quantity, item.product_id]
      );
    }

    // Total price update করো
    await connection.query(
      'UPDATE orders SET total_price = ? WHERE id = ?',
      [total_price, order_id]
    );

    // সব ঠিক থাকলে commit করো
    await connection.commit();

    res.status(201).json({
      success: true,
      message: 'Order তৈরি হয়েছে',
      data: { id: order_id, student_id, total_price, status: 'pending' }
    });
    } catch (error) {
        await connection.rollback(); // কোনো error হলে সব undo করো
    next(error);
    }finally {
    connection.release();
  }
});

export default router;