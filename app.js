const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const md5 = require("md5");

const app = express();
// app.use(bodyParser.json());
app.use(bodyParser.json());
app.use(cors());
app.use((req, res, next) => {
	res.setHeader("Access-Control-Allow-Origin", "*");
	res.setHeader(
		"Access-Control-Allow-Headers",
		"Origin, X-Requested-With, Content-Type, Accept, Authorization"
	);
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader("Access-Control-Allow-Methods", "GET POST PATCH DELETE");
	next();
});

//-------------------- Database Connection --------------------

mongoose.connect("mongodb://localhost:27017/articleDB", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	useFindAndModify: false,
});

//------------------------------------------------------------

//-------------------- Mongoose Schemas --------------------

const userSchema = mongoose.Schema(
	{
		name: String,
		email: String,
		password: String,
	},
	{ timestamps: true }
);

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

const User = mongoose.model("User", userSchema);
const Article = mongoose.model("Article", articleSchema);

//------------------------------------------------------------

//-------------------- Route for all articles --------------------

app
	.route("/articles")
	.get((req, res) => {
		Article.find((err, results) => {
			if (!err) {
				res.send(results);
			} else {
				res.send(err);
			}
		});
	})
	.post((req, res) => {
		const newArticle = new Article({
			title: req.body.title,
			author: req.body.author,
			content: req.body.content,
			additions: [],
		});
		newArticle.save((err) => {
			if (!err) {
				res.send("Your article was added");
			} else {
				res.send(err);
			}
		});
	});

//------------------------------------------------------------

//-------------------- Single Article Route --------------------

app
	.route("/articles/:articleID")
	.get((req, res) => {
		Article.findOne({ _id: req.params.articleID }, (err, result) => {
			if (!err) {
				res.send(result);
			} else {
				res.send(err);
			}
		});
	})
	.patch((req, res) => {
		Article.findByIdAndUpdate(
			req.params.articleID,
			{
				$push: {
					additions: [
						{
							name: req.body.name,
							comment: req.body.comment,
						},
					],
				},
			},
			(err, result) => {
				if (!err) {
					res.send(result);
				} else {
					res.send(err);
				}
			}
		);
	});

//------------------------------------------------------------

//-------------------- Authentication --------------------

app.route("/register").post((req, res) => {
	const user = new User({
		name: req.body.name,
		email: req.body.email,
		password: md5(req.body.password),
	});
	user.save((err, result) => {
		if (!err) {
			const response = {
				name: result.name,
				email: result.email,
			};
			res.send(response);
		} else {
			res.send(err);
		}
	});
});

app.route("/login").post((req, res) => {
	User.findOne({ email: req.body.email }, (err, result) => {
		if (err) {
			res.send(err);
		} else {
			if (result) {
				if (result.password === md5(req.body.password)) {
					const response = {
						name: result.name,
						email: result.email,
					};
					res.send(response);
				}
			}
		}
	});
});

//------------------------------------------------------------

app.listen(5000, () => {
	console.log("Server running on port 5000");
});
