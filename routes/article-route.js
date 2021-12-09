const express = require("express");

const {
  getAllArticles,
  postNewArticle,
  getSingleArticle,
  updateArticle,
} = require("../controllers/article-controller");
const checkAuth = require("../middleware/check-auth");

const router = express.Router();

router.route("/articles").get(getAllArticles).post(checkAuth, postNewArticle);

router
  .route("/articles/:id")
  .get(getSingleArticle)
  .patch(checkAuth, updateArticle);

module.exports = router;
