const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const AppError = require("../utils/appError");

exports.register = catchAsync(async (req, res, next) => {
  const user = await User.create({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
  });

  const token = jwt.sign({ id: user._id }, process.env.JWT_PASSWORD, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(201).json({
    status: "success",
    token,
    data: {
      user,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new AppError("Provide email and password, please!", 400));
  }

  const user = await User.findOne({ email }).select("+password");
  if (!user) {
    return next(new AppError("You entered invalid email!", 400));
  }

  const result = await bcrypt.compare(password, user.password);

  if (!result) {
    return next(new AppError("You entered invalid password!", 400));
  }

  const token = jwt.sign({ id: user._id }, process.env.JWT_PASSWORD, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({
    status: "success",
    token,
  });
});
