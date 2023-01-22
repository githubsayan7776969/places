const { v4: uuidv4 } = require("uuid");
const HttpError = require("../models/http-error");
const validationResult = require("express-validator").validationResult;

DUMMY_USERS = [
  {
    id: 1,
    username: "admin",
    email: "kenaa@example.com",
    password: "test123",
  },
];
const getUsers = (req, res, next) => {
  res.json({ users: DUMMY_USERS });
};
const SignUp = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    res.status(422);
    throw new HttpError("Validation Error", 422);
  }
  const { username, email, password } = req.body;
  const hasUser = DUMMY_USERS.find((user) => user.email === email);
  if (hasUser) {
    throw new HttpError("User already exists", 422);
  }

  const newUser = {
    id: uuidv4(),
    username,
    email,
    password,
  };
  DUMMY_USERS.push(newUser);
  res.status(201).json(newUser);
};
const Login = (req, res, next) => {
  const { email, password } = req.body;
  const user = DUMMY_USERS.find(
    (user) => user.email === email && user.password === password
  );
  if (!user || user.password !== password) {
    throw new HttpError("Invalid Credentials", 401);
  }
  res.status(200).json({ message: "LoggedIn Buddy!" });
};
exports.getUsers = getUsers;
exports.SignUp = SignUp;
exports.Login = Login;
