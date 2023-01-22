const express = require("express");
const bodyParser = require("body-parser");
const placesRoutes = require("./Routes/places-routes");
const HttpError = require("./models/http-error");
const usersRoutes = require("./Routes/users-routes");
const mongoose = require("mongoose");
const url ="mongodb://127.0.0.1:27017/places"


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
mongoose.connect(url, { useNewUrlParser: true }).then(
  ()=>{
    app.listen(5000);
  }
).catch(err=>{
  console.log(err);
})
const db = mongoose.connection
db.once('open', _ => {
  console.log('Database connected:', url)
})

db.on('error', err => {
  console.error('connection error:', err)
})

