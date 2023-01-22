const express = require("express");
const router = express.Router();
const usersController = require("../controllers/users-controller");
const { check } = require("express-validator");

router.get("/", usersController.getUsers);
router.post("/SignUp", [
    check('username').not().isEmpty(),
    check('email').normalizeEmail().isEmail(),
    check('password').isLength({ min: 6 })    
],usersController.SignUp);

router.post("/Login", usersController.Login);
module.exports = router;
