import {Router} from 'express';

const router = Router();

// temporary data
let products = [
    { id: 1, name: 'Laptop', price: 75000, stock: 10 },
    { id: 2, name: 'Mouse', price: 1500, stock: 50 },
    { id: 3, name: 'Keyboard', price: 3000, stock: 30 },
];

// get products
router.get("/",(req,res)=>{
    res.status(200).json({
        success: true,
        count: products.length,
        data: products
    });
});
// get product by id
router.get("/:id",(req,res)=>{
    const id = parseInt(req.params.id);
    const product = products.find(p => p.id ===id);

    if(!product){
        res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    };
    res.status(200).json({
    success: true,
    data: product
    });
});
// post products add products
router.post("/",(req,res)=>{
    const {name,price,stock}= req.body;

    // validation
    if(!name || !price || !stock){
        return res.status(400).json({
            success:false,
            message: 'name,price and stock not found'
        });
    }
    // add new
    const newProduct={
        id: products.length +1,
        name,price,stock
    };
    // push product into arr
    products.push(newProduct);

    res.status(201).json({
        success: false,
        message:"products added",
        data: newProduct
    });
});
// product update
router.put("/:id",(req,res)=>{
    const id= parseInt(req.params.id);
    const  {name,price,stock}= req.body;
    const index = products.findIndex(p => p.id ===id);

    if(index ==-1){
        return res.status(404).json({
            success: false,
            message: "product not found"
        });
    }
    // validation
    if(!name ||!price ||!stock){
        return res.status(400).json({
            success: false,
            message:'name,price,stock have to be added'
        });
    }
    products[index]={id,name,price,stock};

    res.status(200).json({
        success: true,
    message: 'Product updated',
    data: products[index]
    });
});
// use of patch / partially update
router.patch('/:id',(req,res)=>{
    const id = parseInt(req.params.id);
    const index = products.findLastIndex(p => p.id===id);

    // validation
    if(index === -1){
        return res.status(404).json({
            success:false,
            message:'product not found'
        });
    }
    // parially update logic
    products[index]={...products[index],...updates};

    res.status(200).json({
        success:true,
        message:"product partially updated",
        data: products[index]
    });
});
// delete product
router.delete('/:id',(req,res)=>{
    const id = parseInt(req.params.body);
    const index = products.findLastIndex(p=> p.id===id);

    if(index===-1){
        return res.status(404).json({
            success: false,
            message: 'Product not found'
        });
    }
    products.splice(index,1);

    res.status(200).json({
    success: true,
    message: 'Product delete হয়েছে'
    });
});

export default router;

