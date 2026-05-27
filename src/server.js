import express from 'express';
import dotenv from "dotenv";
import router from './routes/products.routes.js';
import router2 from './routes/studentsData.js';
import { logger,notFound,errorHndeling } from './middleware/logger.middleware.js';

dotenv.config();

const app = express();

// json will read data
app.use(express.json({limit:'10kb'}));
app.use(logger);

// routes
app.use('/api/products',router);
app.use('/api/students/',router2);

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

app.use(notFound);
app.use(errorHndeling);
// server star
const PORT = process.env.PORT || 3000;
app.listen(PORT,()=>{
console.log(` Server started: http://localhost:${PORT}`);
});
