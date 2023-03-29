import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please provide name"],
    minlength: 3,
    maxlength: 20,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Please provide email"],
    unique: true,
    validate: {
      validator: validator.isEmail,
      message: "Email not valid",
    },
  },
  password: {
    type: String,
    required: [true, "Please provide password"],
    minlength: 6,
    trim: true,
    select: false
  },
  lastName: {
    type: String,
    maxlength: 20,
    trim: true,
    default: "Snow",
  },
  location: {
    type: String,
    maxlength: 20,
    trim: true,
    default: "",
  },
});

userSchema.pre("save", async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);
  // await bcrypt.compare(this.password, hashedPassword)
});

userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id }, 
    process.env.JWT_SECRET, 
    { expiresIn: process.env.JWT_LIFETIME }
  );
};
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
}

export default mongoose.model("User", userSchema);
