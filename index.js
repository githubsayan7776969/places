const express = require("express");
const bodyParser = require("body-parser");
const placesRoutes = require("./Routes/places-routes");
const HttpError = require("./models/http-error");
const usersRoutes = require("./Routes/users-routes");
const mongoose = require("mongoose");



const app = express();
app.use(bodyParser.json());

app.use("/api/places", placesRoutes);
app.use("/api/users", usersRoutes);
app.use((req, res, next) => {
  const error = new HttpError("Could not Find This Route", 404);
  next(error);
});
app.use((error, req, res, next) => {
  if (res.headersSent) {
    return next(error);
  }
  res.status(error.code || 500);
  res.json({ message: error.message || "Internal Server Error" });
});
mongoose.connect(
  'mongodb+srv://san:pw4667cWJ8YVf8d@cluster0.7yxqfra.mongodb.net/places?retryWrites=true&w=majority'
).then(
  ()=>{
    app.listen(5000);
  }
).catch(err=>{
  console.log(err);
})

