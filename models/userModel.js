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
  email: {
    type: String,
    required: [true, "User must have an email!"],
    validate: {
      validator: function (val) {
        const reg = /^([\w\.\+]{1,})([^\W])(@)([\w]{1,})(\.[\w]{1,})+$/;
        return reg.test(val);
      },
      message: "Enter valid email address, please!",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "User must have password!"],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
