const Question = require("../models/questionModel");
const ApiFeatures = require("../utils/apiFeatures");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

exports.getTopMathQuestions = (req, res, next) => {
  req.query.limit = 10;
  req.query.type = "math";
  req.query.sort = "-view";
  next();
};

exports.getAllQuestions = catchAsync(async (req, res, next) => {
  // Awaiting query
  const features = new ApiFeatures(Question.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();

  const questions = await features.query;

  res.status(200).json({
    status: "success",
    results: questions.length,
    data: {
      questions,
    },
  });
});

exports.getQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findById(req.params.id);

  if (!question) {
    return next(new AppError("Question not found with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      question,
    },
  });
});

exports.createQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.create(req.body);
  res.status(201).json({
    status: "success",
    data: {
      question,
    },
  });
});

exports.updateQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!question) {
    return next(new AppError("Question not find with that ID", 404));
  }

  res.status(200).json({
    status: "success",
    data: {
      question,
    },
  });
});

exports.deleteQuestion = catchAsync(async (req, res, next) => {
  const question = await Question.findByIdAndDelete(req.params.id);

  if (!question) {
    return next(new AppError("Question not find with that ID", 404));
  }

  res.status(204).json({
    status: "success",
    data: {
      question: null,
    },
  });
});

exports.getStats = catchAsync(async (req, res, next) => {
  const stats = await Question.aggregate([
    { $match: { difficulty: "oson" } },
    {
      $group: {
        _id: "$author",
        questionNum: { $sum: 1 },
        avgView: { $avg: "$view" },
        numView: { $sum: "$view" },
      },
    },
    {
      $sort: { numView: -1 },
    },
  ]);
  res.status(200).json({
    status: "success",
    data: {
      stats,
    },
  });
});
