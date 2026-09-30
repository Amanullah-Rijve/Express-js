router.post('/signup', 
[
body('name').notEmpty().withMessage('Name required'),
body('email').isEmail.withMessage('give correct email'),
body('password').isLength({min:6}).withMessage('password minimum 6')
],

async (req,res,next)=>{

})
