const axios = require("axios");
const HttpError = require("../models/http-error");

const API_KEY = 'AIzaSyBARrOl2mCuBeb5FftY1TfiVISUUbTZCBc';
async function getCoordsForaddress(address) {
  //   return {
  //     lat: 22.5301077,
  //     lng: 88.3098528,
  //   };

  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);
  const data = response.data;
  if (!data || data.status === "ZERO_RESULTS") {
    const error = new HttpError("Address not found", 422);
    throw error;
  }
  const coordinates = data.results[0].geometry.location;
  return coordinates;
}
module.exports = getCoordsForaddress;