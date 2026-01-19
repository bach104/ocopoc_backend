const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
      unique: true
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email'
      ]
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user'
    }
  },
  {
    timestamps: true
  }
);

// Hash password
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

// Virtual để lấy tất cả locations mà user đã tạo
userSchema.virtual('locations', {
  ref: 'Location',
  localField: '_id',
  foreignField: 'createdBy',
  justOne: false
});

// Virtual để lấy tất cả locations mà user đã cập nhật
userSchema.virtual('updatedLocations', {
  ref: 'Location',
  localField: '_id',
  foreignField: 'updatedBy',
  justOne: false
});

// Để virtuals hoạt động với toJSON và toObject
userSchema.set('toJSON', { virtuals: true });
userSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('User', userSchema);