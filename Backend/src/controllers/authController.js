const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ==========================================
// GENERATE JWT TOKEN
// ==========================================

const generateToken = (id) => {

  return jwt.sign(
    { id },
    process.env.JWT_SECRET,
    { expiresIn: '8h' }
  );

};

// ==========================================
// REGISTER USER
// ==========================================

exports.registerUser = async (req, res, next) => {

  try {

    const {
      name,
      email,
      password,
      role,
      department,
      team,
      manager
    } = req.body;

    // CHECK EXISTING USER
    const userExists = await User.findOne({ email });

    if (userExists) {

      return res.status(400).json({

        success: false,
        message: 'User already exists.'

      });

    }

    // CREATE USER
    const user = await User.create({

      name,
      email,
      password,
      role,
      department,
      team,
      manager

    });

    // SUCCESS RESPONSE
    return res.status(201).json({

      success: true,

      user: {

        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role

      },

      token: generateToken(user._id)

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,
      message: error.message

    });

  }

};

// ==========================================
// LOGIN USER
// ==========================================

exports.loginUser = async (req, res, next) => {

  try {

    const { email, password } = req.body;

    // IMPORTANT: PASSWORD FETCH
    const user = await User
      .findOne({ email })
      .select('+password');

    // CHECK USER + PASSWORD
    if (
      user &&
      (await user.matchPassword(password))
    ) {

      return res.status(200).json({

        success: true,

        user: {

          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role

        },

        token: generateToken(user._id)

      });

    }

    return res.status(401).json({

      success: false,
      message: 'Invalid credentials.'

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,
      message: error.message

    });

  }

};

// ==========================================
// GET CURRENT PROFILE
// ==========================================

exports.getCurrentProfile = async (
  req,
  res,
  next
) => {

  try {

    const user = await User.findById(
      req.user._id
    );

    return res.status(200).json({

      success: true,
      user

    });

  } catch (error) {

    console.log(error);

    return res.status(500).json({

      success: false,
      message: error.message

    });

  }

};