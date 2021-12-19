const Article = require("../models/article-model");

//? === Controllers For All Articles ===

const getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find();
    if (articles.length > 0) {
      return res.send({
        status: 200,
        message: "Success",
        articles,
      });
    } else {
      return res.send({
        status: 404,
        message: "No articles found, try posting one",
      });
    }
  } catch (err) {
    console.error(err);
    return res.send({
      message: "Something went wrong",
      status: 500,
    });
  }
};

const postNewArticle = async (req, res) => {
  const { title, author, content, avatar } = req.body;
  if (!title.length > 0) {
    return res.send({
      status: 404,
      message: "Title can't be empty",
    });
  }
  if (!author.length > 0) {
    return res.send({
      status: 404,
      message: "Author name can't be empty",
    });
  }
  if (!content) {
    return res.send({
      status: 404,
      message: "Content can't be empty",
    });
  }
  const newArticle = new Article({
    title,
    author,
    author_avatar: avatar,
    content,
    additions: [],
  });
  try {
    await newArticle.save();
    return res.send({
      status: 202,
      message: "Thank You, Your article will be posted",
    });
  } catch (err) {
    console.error(err);
    return res.send({
      status: 500,
      message: "Could not post your article try again",
    });
  }
};

//---------------------------------------------------

//? === Controllers For Single Articles ===

const getSingleArticle = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (article) {
      return res.send({
        status: 200,
        message: "Success",
        article,
      });
    } else {
      return res.send({
        message: "Article Not Found",
        status: 404,
      });
    }
  } catch (err) {
    console.error(err);
    return res.send({
      message: "Something went wrong",
      status: 500,
    });
  }
};

const updateArticle = async (req, res) => {
  const { name, comment, avatar } = req.body;
  if (!name.length > 0) {
    return res.send({
      status: 404,
      message: "Name can not be empty",
    });
  }
  if (!comment.length > 0) {
    return res.send({
      status: 404,
      message: "Comment can not be empty",
    });
  }
  try {
    await Article.findByIdAndUpdate(req.params.id, {
      $push: {
        additions: [
          {
            avatar,
            name,
            comment,
          },
        ],
      },
    });
    return res.send({
      status: 202,
      message: "Your comment will be posted soon",
    });
  } catch (err) {
    console.error(err);
    return res.send({
      status: 500,
      message: "Something went wrong...",
    });
  }
};

//-------------------------------------------------------

module.exports = {
  getAllArticles,
  postNewArticle,
  getSingleArticle,
  updateArticle,
};
