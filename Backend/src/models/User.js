const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ['employee', 'manager', 'admin'],
      default: 'employee',
    },
    phone: { type: String, default: '' },
    designation: { type: String, default: '' },
    bio: { type: String, default: '' },
    avatar: { type: String, default: '' },
    department: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Department',
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Team',
    },
    manager: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

// Password hashing
UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Password matching
UserSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Reset token generate 
UserSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString('hex');
  this.resetPasswordToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  this.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 min
  return resetToken;
};

// JWT token generate
UserSchema.methods.getSignedJwtToken = function () {
  return jwt.sign(
    { id: this._id, role: this.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE || '30d' }
  );
};

module.exports = mongoose.model('User', UserSchema);
