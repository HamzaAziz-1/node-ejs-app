require("../models/database");
const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require('bcryptjs');
const validate = (e) => {
  console.log(e.message, e.code);
  var error = {
    name: "",
    password: "",
  };

  if (e.code === 11000) {
    error.name = "This user name exists";
  } else if (e.message.includes("user validation failed")) {
    Object.values(e.errors).forEach(({ properties }) => {
      error[properties.path] = properties.message;
    });
  } else if (e.message === "User not found") {
    error.name = e.message;
  } else if (e.message === "Password incorrect") {
    error.password = e.message;
  }

  return error;
};

const createToken = (id) => {
  return jwt.sign({ id }, process.env.SECRET_KEY, {
    expiresIn: 3600,
  });
};

const login_get = (req, res) => {
  res.render("login");
};

const signup_get = (req, res) => {
  res.render("signup");
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
     return res.send("User does not exist");
    }
    if (!bcrypt.compare(password,user.password)) {
      return res.send("Invalid Credentials")
    }
    const token = createToken(user._id);
    res.json({ token });
  } catch (e) {
    const err = validate(e);
    res.json({ error: err });
  }
};

const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
     const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const user = await User.create({
      name,
      email,
      password:hashedPassword,
    });

    res.render("login");
  } catch (e) {
    console.log(e);
    const err = validate(e);
    res.status(400).json({ error: err });
  }
};

const logout = async (req, res) => {
  res.cookie(null);
};

module.exports = { register, login, signup_get, login_get, logout };
