router.get('/',protected, async (req,res,next)=>{
try{

const {title,author,quantity} = req.body

if(!title || !author || !quantity){
return res.status(401).json({success:false,message: 'title,author,quantity required'})
}

const data= await Book.find(req.id)

res.status(200).json({succcess: true, message: 'book found',data: data})

}catch(err){
next(err)
}
})

router.post('/',protected,restrictTo('admin'),async (req,res,next)=>{
try{
const {title,author,quantity}= req.body
if(!title || !author || !quantity){
return res.status(401).json({success:false,message: 'title,author,quantity required'})
}
await Book.Create(req.id,{title,author,quantity})

res.status(201).json({success: true,message: 'book created'})

}catch(err){
next(err)
}
})

router.delete('/:id',protected, restrictTo('admin'),findBook, async(req,res,next)=>{
try{
await Book.findByIdAndDelete(req.book.id)

res.status(200).json({succcess: true, message: 'book deleted'})

}catch(err){
next(err)
}
})
