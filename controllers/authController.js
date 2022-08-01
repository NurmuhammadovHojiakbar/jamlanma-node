const User = require("../models/userModel");
const catchAsync = require("../utils/catchAsync");
// const AppError = require("../utils/appError");

exports.register = catchAsync(async (req, res, next) => {
  const user = await User.create(req.body);

  res.status(201).json({
    status: "success",
    data: {
      user,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {});
