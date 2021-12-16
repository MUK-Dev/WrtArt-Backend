const mongoose = require("mongoose");

const articleSchema = mongoose.Schema(
  {
    title: String,
    author: String,
    content: String,
    additions: [
      {
        name: String,
        comment: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
