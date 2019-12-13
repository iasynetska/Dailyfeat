const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	login: {
		type: String,
		required: true,
		minlehgth: 3,
		maxlength: 25
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
	},
	feats: [{
		title: {
			type: String,
			requared: true,
			minlehgth: 2,
			maxlength: 50
		},
		isTimeMaked: {
			type: Boolean,
			default: false
		},
		isAchieved: {
			type: Boolean,
			default: false
		},
		focus: {
			type: Number,
			min: 1,
			max: 5
		},
		thoughts: {
			type: String,
			minlehgth: 1,
			maxlength: 255
		},
		created: {
			type: Date,
			default: Date.now
		}
	}]
});

userSchema.methods.generateAuthToken = function(){
	const token = jwt.sign({ _id: this._id }, config.get("jwtPrivateKey"))
	return token;
} 

const User = mongoose.model('users', userSchema);

const validationFeatSchema = {
	title: Joi.string().min(2).max(50).required(),
	isTimeMaked: Joi.boolean(),
	isAchieved: Joi.boolean(),
	focus: Joi.number().min(0).max(5),
	thoughts: Joi.string().min(1).max(255)
};

const validationUserSchema = {
	login: Joi.string().min(3).max(25).required(),
	email: Joi.string().min(5).max(255).required().email(),
	password: Joi.string().min(5).max(1024).required(),
	feats: Joi.array().items(Joi.object(validationFeatSchema))
};

function validateUser(user) {
	return Joi.validate(user, validationUserSchema);
}

function validateFeat(feat) {
	return Joi.validate(feat, validationFeatSchema);
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
exports.validateUser = validateUser;
exports.validateFeat = validateFeat;
exports.validateEmail = validateEmail;
exports.validateUserAuth = validateUserAuth;