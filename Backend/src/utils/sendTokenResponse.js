const sendTokenResponse = (user, statusCode, res) => {
const token = user.getSignedJwtToken();
const options = {
    expires: new Date(Date.now() + parseInt(process.env.JWT_COOKIE_EXPIRE) * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
  };

const userData = {
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    avatar: user.avatar,
    phone: user.phone,
    designation: user.designation,
    bio: user.bio,
    department: user.department,
    team: user.team,
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: userData,
  });
};

module.exports = sendTokenResponse;