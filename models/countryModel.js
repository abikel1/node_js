const mongoose = require("mongoose");
const Joi = require("joi");

const countrySchema = new mongoose.Schema({
  name: String,
  capital: String,
  pop: Number,
  img: String,
  date: {
    type: Date,
    default: Date.now,
  },
  user_id: String,
});

exports.CountryModel = mongoose.model("countries", countrySchema);

exports.validCountry = (_body) => {
  let schema = Joi.object({
    name: Joi.string().min(2).max(100).required(),
    capital: Joi.string().min(2).max(100).required(),
    pop: Joi.number().min(1).max(1000000000).required(),
    img: Joi.string().uri().allow(null, ""), 
  });

  return schema.validate(_body);
};