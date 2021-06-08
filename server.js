const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const compression = require("compression");
const uri= "mongodb+srv://admin:password1234@cluster0.fckkj.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const PORT = 3000||process.env.PORT;

const app = express();

app.use(logger("dev"));

app.use(compression());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(uri,"mongodb://localhost/budget",{
  useNewUrlParser: true,
  useFindAndModify: false
});

// routes
app.use(require("./routes/api.js"));

app.listen(PORT, () => {
  console.log(`App running on port ${PORT}!`);
});