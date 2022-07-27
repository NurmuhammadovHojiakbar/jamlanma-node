const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Savol bo'lishi zarur!"],
      unique: true,
      minlength: [3, "Savol eng kamida 3ta harfdan iborat bolishi kere!"],
      maxlength: [300, "Savol maximum 300ta harfdan iborat bolishi kere!"],
    },
    type: {
      type: String,
      required: [true, "Savol qanday turdaligi belgilanishi zarur!"],
    },
    author: {
      type: String,
      required: [true, "Savolning muallifi bo'lishi zarur!"],
    },
    created_at: {
      type: Date,
      default: Date.now(),
      validate: {
        validator: function (val) {
          return val > new Date("2000-01-01");
        },
        message: "Faqatgina 2000-yildan keyinni belgilash mumkin.",
      },
    },
    difficulty: {
      type: String,
      required: [true, "Savolning darajasi belgilanishi zarur!"],
      enum: {
        values: ["oson", "o'rtacha", "qiyin"],
        message:
          "Darajalar faqat quyidagilardan bo'lishi kere: oson, o'rtacha, qiyin.",
      },
    },
    variants: {
      type: [String],
      required: [true, "Savol uchun variantlar kiritilishi zarur!"],
    },
    validAnswer: {
      type: String,
      required: [true, "Savol uchun to'g'ri javob kiritilishi zarur!"],
    },
    view: {
      type: Number,
      default: 0,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

questionSchema.virtual("time").get(function () {
  return this.created_at;
});

const Question = mongoose.model("Question", questionSchema);

module.exports = Question;
