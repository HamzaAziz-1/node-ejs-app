require("../models/database");
const Category = require("../models/Category");
const Recipe = require("../models/Recipe");
const axios = require("axios");
const apiUrl = "https://api.spoonacular.com/recipes/random";
const apiKey = process.env.API_KEY;
const tags = "vegetarian,dessert";
const number = 1;

// Construct the URL with parameters
const requestUrl = `${apiUrl}?number=${number}&tags=${tags}&apiKey=${apiKey}`;

exports.homepage = async (req, res) => {
  try {
    const limitNumber = 6;
    const categories = await Category.find({}).limit(limitNumber);
    const latest = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    const thai = await Recipe.find({ category: "Thai" }).limit(limitNumber);
    const american = await Recipe.find({ category: "American" }).limit(
      limitNumber
    );
    const chinese = await Recipe.find({ category: "Chinese" }).limit(
      limitNumber
    );

    const food = { latest, thai, american, chinese };

    res.render("index", { title: "Home", categories, food });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreCategories = async (req, res) => {
  try {
    const limitNumber = 20;
    const categories = await Category.find({}).limit(limitNumber);
    res.render("categories", {
      title: "Categories",
      categories,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreCategoriesById = async (req, res) => {
  try {
    let categoryId = req.params.id;
    const limitNumber = 20;
    const categoryById = await Recipe.find({ category: categoryId }).limit(
      limitNumber
    );
    res.render("categories", {
      title: "Categories",
      categoryById,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreRecipe = async (req, res) => {
  try {
    let recipeId = req.params.id;
    const recipe = await Recipe.findById(recipeId);
    res.render("recipe", { title: "Recipe", recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};
exports.about = async (req, res) => {
  res.render("about");
};

exports.searchRecipe = async (req, res) => {
  try {
    let searchTerm = req.body.searchTerm;
    let recipe = await Recipe.find({
      $text: { $search: searchTerm, $diacriticSensitive: true },
    });
    res.render("search", { title: "Search", recipe });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreLatest = async (req, res) => {
  try {
    const limitNumber = 20;
    const recipe = await Recipe.find({}).sort({ _id: -1 }).limit(limitNumber);
    res.render("explore-latest", {
      title: "Explore Latest",
      recipe,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

exports.exploreRandom = async (req, res) => {
  try {
    const response = await axios.get(requestUrl);
    const recipe = response.data.recipes[0];   
    res.render("explore-random", {
      title: "Random Recipe",
      recipe,
    });
  } catch (error) {
    res.satus(500).send({ message: error.message || "Error Occured" });
  }
};

exports.resubmitRecipe = async (req, res) => {
  const infoErrorsObj = req.flash("infoErrors");
  const infoSubmitObj = req.flash("infoSubmit");
  res.render("submit-recipe", {
    title: "Submit Recipe",
    infoErrorsObj,
    infoSubmitObj,
  });
};

exports.submitRecipeOnPost = async (req, res) => {
  try {
    let imageUploadFile;
    let uploadPath;
    let newImageName;

    if (!req.files || Object.keys(req.files).length === 0) {
      console.log("No Files where uploaded.");
    } else {
      imageUploadFile = req.files.image;
      newImageName = Date.now() + imageUploadFile.name;

      uploadPath =
        require("path").resolve("./") + "/public/uploads/" + newImageName;

      imageUploadFile.mv(uploadPath, function (err) {
        if (err) return res.satus(500).send(err);
      });
    }

    const newRecipe = new Recipe({
      name: req.body.name,
      description: req.body.description,
      email: req.body.email,
      ingredients: req.body.ingredients,
      category: req.body.category,
      image: newImageName,
    });

    await newRecipe.save();

    req.flash("infoSubmit", "Recipe has been added.");
    res.redirect("/submit-recipe");
  } catch (error) {
    req.flash("infoErrors", error);
    res.redirect("/submit-recipe");
  }
};
