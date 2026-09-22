router.delete('/:id', findBook,async(req,res,next)=>{
try{

await Book.findByIdAndDelete(req.params._id);

return res.ststus(200).jsno({
success: true,
message: 'book deleted'
})

}catch(error){
next(error);
}
}
