//creating a user for the task to apply some tasks 
const mongoose = require('mongoose');

const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone_number: {
    type: Number,
    required: true,
    unique: true,
},
  priority: {
    type: Number,
    enum: [0, 1, 2],
    default: 0,
},
},{
  timestamps: true
});

userSchema.pre('save' , async function(next) {
  const user = this;

  if(user.isModified('password')){
      user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

  const User = mongoose.model('User' , userSchema);
  module.exports = User;