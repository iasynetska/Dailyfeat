const Joi = require('joi');
const mongoose = require('mongoose');

const User = mongoose.model('User', new mongoose.Schema({
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
		maxlength: 1024,
		unique: true
	}
}));

function validateUser(user) {
	const schema = {
		name: Joi.string().min(3).max(25).require(),
		email: Joi.string().min(5).max(255).require().email(),
		password: Joi.string().min(5).max(1024).require()
	};

	return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validateUser;