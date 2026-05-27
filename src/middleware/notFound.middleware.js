export const notFound = (req,res,next)=>{
    const error = new Error(`Router not Found- ${req.originalUrl}`);
    res.status(404);
    nrext(error);
}