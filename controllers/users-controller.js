const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const validationResult = require("express-validator").validationResult;
const User = require("../models/user");

DUMMY_USERS = [
  {
    id: 1,
    username: "admin",
    email: "kenaa@example.com",
    password: "test123",
  },
];
const getUsers = async (req, res, next) => {
  let users;

  try {
    users = await User.find({}, "-password");
  } catch (err) {
    const error = new HttpError("Fetching failed", 500);
    return next(error);
  }
  res.status(200).json({users:users.map(user => user.toObject({getters: true}))});  
};
const SignUp = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    res.status(422);
    return next(new HttpError("Validation Error", 422));
  }
  const { username, email, password } = req.body;
  // const hasUser = DUMMY_USERS.find((user) => user.email === email);
  // if (hasUser) {
  //   throw new HttpError("User already exists", 422);
  // }

  let existingUser;
  try {
    existingUser = await User.findOne({ email });
  } catch (err) {
    const error = new HttpError("Signing Up failed! Please Try Again!", 500);
    return next(error);
  }
  if (existingUser) {
    const error = new HttpError("User already exists", 422);
    return next(error);
  }

  const newUser = new User({
    username,
    email,
    image:
      "https://www.holidify.com/images/cmsuploads/compressed/20170310204136_20171030202918.jpg",
    password,
    places:[]
  });
  try {
    await newUser.save();
  } catch (err) {
    const error = new HttpError("cSigning Up Failed!! Try Again", 500);
    return next(error);
  }
  res.status(201).json({ user: newUser.toObject({ getters: true }) });
};
const Login = async (req, res, next) => {
  const { email, password } = req.body;

  let existingUser;

  try {
    existingUser = await User.findOne({ email: email });
  } catch (err) {
    const error = new HttpError(
      "Logging in failed, please try again later.",
      500
    );
    return next(error);
  }

  if (!existingUser || existingUser.password !== password) {
    const error = new HttpError(
      "Invalid credentials, could not log you in.",
      401
    );
    return next(error);
  }

  res.json({ message: "Logged in!" });
};

exports.getUsers = getUsers;
exports.SignUp = SignUp;
exports.Login = Login;
