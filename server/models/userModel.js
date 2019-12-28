const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
	login: {
		type: String,
		required: true,
		minlength: 3,
		maxlength: 25
	},
	email: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 255,
		unique: true
	},
	password: {
		type: String,
		required: true,
		minlength: 5,
		maxlength: 1024
	},
	feats: [{
		title: {
			type: String,
			required: true,
			minlength: 2,
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
			minlength: 1,
			maxlength: 255
		},
		created: {
			type: Date,
			default: Date.now
		}
	}],
	habits: [{
		title: {
			type: String,
			required: true,
			minlength: 2,
			maxlength: 50
		},
		obviousDesc: {
			type: String,
			maxlength: 100
		},
		attractiveDesc: {
			type: String,
			maxlength: 100
		},
		easyDesc: {
			type: String,
			maxlength: 100
		},
		satisfyingDesc: {
			type: String,
			maxlength: 100
		},
		isClosed: {
			type: Boolean,
			default: false
		},
		isCompletedToday: {
			type: Boolean,
			default: false
		},
		timestamp: {
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
	title: Joi.string().min(2).max(50),
	isTimeMaked: Joi.boolean(),
	isAchieved: Joi.boolean(),
	focus: Joi.number().min(0).max(5),
	thoughts: Joi.string().min(1).max(255)
};

const validationHabitSchema = {
	title: Joi.string().min(2).max(50),
	obviousDesc: Joi.string().max(100),
	attractiveDesc: Joi.string().max(100),
	easyDesc: Joi.string().max(100),
	satisfyingDesc: Joi.string().max(100),
	isClosed: Joi.boolean(),
	isCompletedToday: Joi.boolean()
};

const validationUserSchema = {
	login: Joi.string().min(3).max(25).required(),
	email: Joi.string().min(5).max(255).required().email(),
	password: Joi.string().min(5).max(1024).required(),
	feats: Joi.array().items(Joi.object(validationFeatSchema)),
	habits: Joi.array().items(Joi.object(validationHabitSchema))
};

function validateUser(user) {
	return Joi.validate(user, validationUserSchema);
}

function validatePassword(password) {
	return Joi.validate(password, {password: validationUserSchema.password});
}

function validateNewFeat(feat) {
	return Joi.validate(feat, {title: validationFeatSchema.title.required()});
}

function validateUpdatedFeat(feat) {
	return Joi.validate(feat, validationFeatSchema, {abortEarly: false});
}

function validateHabit(habit) {
	return Joi.validate(habit, validationHabitSchema);
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

function formatValidationErrors(error) {
	return error.details.reduce((accumulator, currentValue) => {
		accumulator.push(currentValue.message);
		return accumulator;
	}, []);
}

exports.User = User;
exports.validateUser = validateUser;
exports.validateNewFeat = validateNewFeat;
exports.validateUpdatedFeat = validateUpdatedFeat;
exports.validateHabit = validateHabit;
exports.validateEmail = validateEmail;
exports.validateUserAuth = validateUserAuth;
exports.validatePassword = validatePassword;
exports.formatValidationErrors = formatValidationErrors;