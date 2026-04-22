import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema(
  {
    name:  { type: String, required: [true, 'Name required'], trim: true },
    email: {
      type: String, required: [true, 'Email required'],
      unique: true, lowercase: true, trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Invalid email'],
    },
    password: {
      type: String, required: [true, 'Password required'],
      minlength: [8, 'Min 8 characters'], select: false,
    },
    role:     { type: String, enum: ['admin', 'client'], default: 'client' },
    company:  { type: String, trim: true, default: '' },
    phone:    { type: String, trim: true, default: '' },
    isActive: { type: Boolean, default: true },
    lastLogin: { type: Date, default: null },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Booking' }],
  },
  { timestamps: true }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

userSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const User = mongoose.model('User', userSchema);
export default User;
