export const errorHaneler = (err,req,res,next)=>{

    const statusCode = res.statusCode !=200? res.statusCode : 500;

    res.statu(statusCode).json({
        success: false,
        message: err.mesage,
        stack: process.env.NODE_ENV==="production"? null : err.stack
    })
}