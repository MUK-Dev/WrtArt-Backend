const bcrypt = require("bcrypt");

const User = require("../models/user-models");
const { genToken } = require("../utils/generate-token");

const saltRounds = 10;
const emailRegexp =
  /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

//? === Register User ===

const register = async (req, res) => {
  let existingUser;
  let token;

  const { name, email, password } = req.body;

  if (!emailRegexp.test(email)) {
    return res.send({
      message: "Invalid Email Address",
      status: 404,
    });
  }

  if (password.length > 6) {
    return res.send({
      message: "Password should be more than 6 Characters",
      status: 404,
    });
  }

  // ! Checking If User with same email already exists
  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    console.error(err);
    return res.send({
      message: "Something went wrong",
      status: 500,
    });
  }

  if (existingUser) {
    return res.send({
      message: "Email already in use",
      status: 403,
    });
  }
  //!-------------------------------------------------------

  // !Creating New User and generating a token with JWT
  bcrypt.hash(password, saltRounds, async (e, hash) => {
    if (!e) {
      const user = User({
        name,
        email,
        password: hash,
      });

      try {
        await user.save();
      } catch (err) {
        console.error(err);
        return res.send({
          message: "Couldn't Register, please try again",
          status: 500,
        });
      }
      token = genToken(user);
      res.send({
        status: 202,
        message: "Successfully Registered",
        "user-info": {
          _id: user._id,
          name: user.name,
          email: user.email,
        },
        token: token,
      });
    } else {
      console.error(e);
      return res.send({
        message: "Something went wrong",
        status: 500,
      });
    }
  });
  // !-------------------------------------------
};

//-------------------------------------------------------

//? === Login User ===

const login = async (req, res) => {
  let token;
  const { email, password } = req.body;
  try {
    await User.findOne({ email: email }, (err, foundUser) => {
      if (!err) {
        if (foundUser) {
          bcrypt.compare(password, foundUser.password, async (e, result) => {
            if (result) {
              token = await genToken(foundUser);
              res.send({
                status: 202,
                message: "Login Successful",
                "user-info": {
                  _id: foundUser._id,
                  name: foundUser.name,
                  email: foundUser.email,
                },
                token,
              });
            } else {
              console.error(e);
              return res.send({
                message: "Passwords Don't Match",
                status: 404,
              });
            }
          });
        } else {
          console.error(err);
          return res.send({
            message: "Invalid Email",
            status: 404,
          });
        }
      } else {
        console.error(err);
        return res.send({
          message: "Something went wrong",
          status: 500,
        });
      }
    });
  } catch (err) {
    console.error(err);
    return res.send({
      message: "Something went wrong",
      status: 500,
    });
  }
};

// ---------------------------------------------------

module.exports = {
  login,
  register,
};
