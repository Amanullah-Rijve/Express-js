import express from 'express';
import dotenv from "dotenv";
import router from './routes/products.routes.js';

dotenv.config();

const app = express();

// json will read data
app.use(express.json());

// routes
app.use('/api/products',router);

// base router
app.get('/',(req,res)=>{
    res.status(200).json({
        success: true,
        message: ' Backend Journey API',
        version:'1.0.0',
        endpoints:{
            products:'/api/products'
        }
    });
});

// 404 handeler
app.use((res=>{
    res.status(404).json({
        success: false,
        message:'unknown route'
    });
}));

// server star
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
console.log(` Server started: http://localhost:${PORT}`);
});
