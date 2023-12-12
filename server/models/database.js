const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("DB Connected..."))
  .catch((error) => console.log("Error connecting to DB", error));

// Models
require("./Category");
require("./Recipe");
require("./User")
