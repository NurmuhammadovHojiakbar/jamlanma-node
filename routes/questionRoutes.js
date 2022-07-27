const express = require("express");
const router = express.Router();
const questionController = require("../controllers/questionController");

router
  .route("/top-math-questions")
  .get(
    questionController.getTopMathQuestions,
    questionController.getAllQuestions
  );

router.route("/stats").get(questionController.getStats);

router
  .route("/")
  .get(questionController.getAllQuestions)
  .post(questionController.createQuestion);

router
  .route("/:id")
  .get(questionController.getQuestion)
  .patch(questionController.updateQuestion)
  .delete(questionController.deleteQuestion);

module.exports = router;
