const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
  {
    name: String,
    email: String,
    password: String,
    avatar: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
