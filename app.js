const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser");
const flash = require("connect-flash");
const morgan = require("morgan");
const app = express();
const port = process.env.PORT || 3000;
const session = require("express-session");

require("dotenv").config();

app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));
app.use(expressLayouts);
app.use(morgan("tiny"));

app.use(cookieParser());

app.use(flash());
app.use(fileUpload());
app.use(
  session({
    secret: process.env.SECRET_KEY,
    resave: false,
    saveUninitialized: true,
  })
);
app.set("layout", "./layouts/main");
app.set("view engine", "ejs");

const recipeRoutes = require("./server/routes/recipeRoutes.js");
const authRoutes = require("./server/routes/authRoutes.js");
app.use("/", recipeRoutes);
app.use("/", authRoutes);

app.listen(port, () => console.log(`Listening to port ${port}`));
