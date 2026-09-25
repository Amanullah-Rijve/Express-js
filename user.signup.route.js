const generateToken = (userId)=>{
return jwt.sign(
{id: userId},
process.env.JWT_SECRET,
{expiresIn: process.env.JWT_EXPIRE}
);
};

router.post('/signup',async (req,res,next)=>{
try{
const {name,email,password} = req.body;

if(!name || !email ||!password){
return res.status(400).json({
success: false,
message: 'name,email,password required'
})
}

const isUserExsist =await User.findOne({email});
if(isUserExsist){
return res.status(400).json({
success: false,
message: 'user exsist'
})
}

const user = await User.create({name,email,password});
const token = generateToken(user._id);

res.status(201).json({
success: true,
message: 'user created',
token: token,
user:{
id: user._id,
name : user.name,
email: user.email
}



})

}catch(error)
{next(error)
}

})
