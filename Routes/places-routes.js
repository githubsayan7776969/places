const express = require("express");
const router = express.Router();
const HttpError = require("../models/http-error");
const placesController = require("../controllers/places-controller");
const { check } = require("express-validator");

router.get("/:pid", placesController.getPlaceById);

router.get("/user/:uid", placesController.getPlacesByUserId);
router.post(
  "/",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesController.createPlace
);
router.patch("/:pid",[
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    
  ],
   placesController.updatePlace);
router.delete("/:pid", placesController.deletePlace);

module.exports = router;
