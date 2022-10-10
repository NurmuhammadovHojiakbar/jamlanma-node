const bcrypt = require("bcrypt");
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: [true, "User must have firstname!"],
    minlength: [3, "Firstname must be at least 3 characters!"],
  },
  lastname: {
    type: String,
    required: [true, "User must have lastname!"],
    minlength: [3, "Firstname must be at least 3 characters!"],
  },
  photo: String,
  email: {
    type: String,
    required: [true, "User must have an email!"],
    validate: {
      validator: function (val) {
        const reg = /^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/;
        return reg.test(val);
      },
      message: "Enter a valid email address, please!",
    },
    unique: true,
    lowercase: true,
  },
  password: {
    type: String,
    required: [true, "User must have password!"],
    minlength: [8, "Password must be at least 8 characters!"],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, "Password must be confirmed!"],
    validate: {
      validator: function (el) {
        return el === this.password;
      },
      message: "Password confirmation is failed!",
    },
  },
  role: {
    type: String,
    enum: ["user", "moderator", "admin", "super-admin"],
    default: "user",
  },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  this.passwordConfirm = undefined;

  next();
});

userSchema.methods.correctPassword = async function (
  comingPassword,
  userPassword
) {
  return await bcrypt.compare(comingPassword, userPassword);
};

const User = mongoose.model("User", userSchema);

module.exports = User;
