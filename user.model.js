import   mongoose from 'mongoose'
import bcrypt from 'bcryptjs'

const userSchema= new mongoose.Schema(
{
name:{
type: String,
required: [true,'name required'],
trim: true
},
email:{
type: String,
required: [true,'email required'],
unique: true,
trim: true
},
password:{
type: String,
required: [true,'password required'],
select: false,
trim: true

},
},
{
timestamps: true,
}
);

userSchema.pre('save',async function(next){
try{
const isPass = this.Modified('password');

if(! isPass ){
return next();
}

const hashed = await bcrypt.hash(this.password,10);
this.password = hashed;
next();
}catch(error){
return next(error)
}
})

userSchema.methods.comparePassword = async function (enteredPass){
const checkPass = await bcrypt.compare(enteredPass,this.password);
if(checkPass){
return true
}else{return false}
}


const User = mongoose.model('User',userSchema);


export default User;

