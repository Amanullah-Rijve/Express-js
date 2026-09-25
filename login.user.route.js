router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'email,password required'
      });
    }

    const isUser = await User.findOne({ email }).select('+password');
    if (!isUser) {
      return res.status(401).json({
        success: false,
        message: 'invalid email or password'
      });
    }

    const isMatch = await isUser.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'invalid email or password'
      });
    }

    const token = generateToken(isUser._id);

    res.status(200).json({
      success: true,
      message: 'login success',
      token: token,
      user: {
        id: isUser._id,
        email: isUser.email
      }
    });

  } catch (error) {
    next(error);
  }
});
