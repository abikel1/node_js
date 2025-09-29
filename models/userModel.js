const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');

let userSchema = new mongoose.Schema({
    name: String,
    email: String,
    password: String,
    date_created: {
        type: Date,
        default: Date.now()
    }
});


exports.createToken = (user_id) => {
    let token = jwt.sign({ id: user_id }, "AyalaSecret", { expiresIn: '60mins' });
    return token;
}

exports.validUser = (_reqBody) => {
    let joiSchema = Joi.object({
        name: Joi.string().min(2).max(99).required(),
        email: Joi.string().min(2).max(99).email().required(),
        password: Joi.string().min(3).max(99).required()
    });
    return joiSchema.validate(_reqBody);
};

exports.validLogin = (_reqBody) => {
    let joiSchema = Joi.object({
        email: Joi.string().min(2).max(99).email().required(),
        password: Joi.string().min(3).max(99).required()
    });

    return joiSchema.validate(_reqBody);
};

exports.UserModel = mongoose.model('users', userSchema);






