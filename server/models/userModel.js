const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	login: {
		type: String,
		required: true,
		minlehgth: 3,
		maxlength: 25,
		unique: true
	},
	email: {
		type: String,
		required: true,
		minlehgth: 5,
		maxlength: 255,
		unique: true
	},
	password: {
		type: String,
		required: true,
		minlehgth: 5,
		maxlength: 1024
	}
});

userSchema.methods.generateAuthToken = function(){
	const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"))
	return token;
} 

const User = mongoose.model('User', userSchema);

const validationUserSchema = {
	login: Joi.string().min(3).max(25).required(),
	email: Joi.string().min(5).max(255).required().email(),
	password: Joi.string().min(5).max(1024).required()
};

function validate(user) {
	return Joi.validate(user, validationUserSchema);
}

const validationUserAuthSchema = {
	email: validationUserSchema.email,
	password: validationUserSchema.password
};

function validateUserAuth(userAuth) {
	return Joi.validate(userAuth, validationUserAuthSchema);
}

const validationEmailSchema = {
	email: validationUserSchema.email
};

function validateEmail(email) {
	return Joi.validate(email, validationEmailSchema);
}

exports.User = User;
exports.validate = validate;
exports.validateEmail = validateEmail;
exports.validateUserAuth = validateUserAuth;