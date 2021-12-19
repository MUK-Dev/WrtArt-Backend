const mongoose = require("mongoose");

const articleSchema = mongoose.Schema(
  {
    title: String,
    author_avatar: String,
    author: String,
    content: String,
    additions: [
      {
        avatar: String,
        name: String,
        comment: String,
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Article", articleSchema);
