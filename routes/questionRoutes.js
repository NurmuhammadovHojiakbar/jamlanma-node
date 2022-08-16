const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");
const authController = require("../controllers/authController");

router
  .route("/top-math-questions")
  .get(
    authController.protect,
    questionController.getTopMathQuestions,
    questionController.getAllQuestions
  );

router.route("/stats").get(authController.protect, questionController.getStats);

router
  .route("/")
  .get(authController.protect, questionController.getAllQuestions)
  .post(authController.protect, questionController.createQuestion);

router
  .route("/:id")
  .get(authController.protect, questionController.getQuestion)
  .patch(authController.protect, questionController.updateQuestion)
  .delete(authController.protect, questionController.deleteQuestion);

module.exports = router;
