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

userSchema.pre('save',async function (next)={

})


const User = mongoose.model('User',userSchema);


export default User;

