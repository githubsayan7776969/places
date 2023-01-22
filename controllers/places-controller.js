const HttpError = require("../models/http-error");
const { validationResult } = require("express-validator");
const getCoordsForaddress = require("../util/location");
const Place = require("../models/place");

const { v4: uuidv4 } = require("uuid");

let DUMMY_PLACES = [
  {
    id: "p1",
    title: "Writers Building",
    description: "One of the most famous Red buildings in India",
    location: {
      lat: 22.5301077,
      lng: 88.3098528,
    },
    address:
      "Writers Building, H8FX+GGJ, Binoy Badal Dinesh Bag N Rd, Lal Dighi, B.B.D. Bagh, Kolkata, West Bengal 700001",
    creator: "u1",
  },
];

const getPlaceById = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("could not find a place", 500);
    return next(error);
  }

  if (!place) {
    const error = new HttpError("Place not found", 404);
    return next(error);
  }
  res.json({ place: place.toObject({ getters: true }) });
};

const getPlacesByUserId = async (req, res, next) => {
  const userId = req.params.uid;
  let places;
  try {
    places = await Place.find({ creator: userId });
  } catch (err) {
    const error = new HttpError("fetchin' Failed vehemently!", 500);
    return next(error);
  }
  if (!places || places.length === 0) {
    return next(
      new HttpError("Could not find Places For The Provided User Id", 404)
    );
  }
  res.json({
    places: places.map((place) => place.toObject({ getters: true })),
  });
};

const createPlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new HttpError("Validation Error", 422));
  }

  const { title, description, address, creator } = req.body;
  let coordinates;
  try {
    coordinates = await getCoordsForaddress(address);
  } catch (error) {
    return next(error);
  }

  const createdPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    image:
      "https://kolkatatourism.travel/images/places-to-visit/headers/writers-building-kolkata-tourism-entry-fee-timings-holidays-reviews-header.jpg",
    creator,
  });
  try {
    await createdPlace.save();
  } catch (err) {
    const error = new HttpError("creating place failed! Try Again", 500);
    return next(error);
  }

  res.status(201).json({ place: createdPlace });
};

const updatePlace = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors.array());
    res.status(422);
    throw new HttpError("Validation Error", 422);
  }
  const placeId = req.params.pid;
  const { title, description } = req.body;
  let place;
  try {
    place = await Place.findById(placeId);
  } catch (err) {
    const error = new HttpError("Place Not Updated!", 500);
    return next(error);
  }
  place.title = title;
  place.description = description;
  try {
    await place.save();
  } catch (err) {
    const error = new HttpError("could not update", 500);
    return next(error);
  }

  res.status(200).json({ place: place.toObject({ getters: true }) });
};
const deletePlace = async (req, res, next) => {
  const placeId = req.params.pid;
  let place;
  try {
    place = await Place.findById(placeId);
    
  } catch (err) {
    const error = new HttpError("could not delete the place", 500);
    return next(error);
    
  }
  try {
    await place.remove();
    
  }catch (err) {
    const error = new HttpError("could not delete the place", 500);
    return next(error);
    
  }
  res.status(200).json({ message: "PLACE-DELETED!!" });
  // DUMMY_PLACES.splice(index, 1);
};
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
