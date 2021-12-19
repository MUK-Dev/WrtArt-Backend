require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const articleRoutes = require("./routes/article-route");
const authRoutes = require("./routes/user-route");

const app = express();
app.use(express.json());
app.use(cors());

//?=== API Instruction Page ===

app.get("/", (req, res) => res.sendFile(__dirname + "/views/index.html"));

//------------------------------------------------------------

//? ===Route for all articles ===

app.use(articleRoutes);

//------------------------------------------------------------

//? === Authentication ===

app.use(authRoutes);

//------------------------------------------------------------

//? === Database Connection ===

mongoose
  .connect(process.env.DB_KEY, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    app.listen(5000, () => {
      console.log("Running On Port: 5000");
    });
  })
  .catch((err) => {
    console.error(err);
  });

//------------------------------------------------------------
