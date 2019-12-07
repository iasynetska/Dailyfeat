const Joi = require('joi');
const mongoose = require('mongoose');

const url = 'mongodb+srv://root:b6znvGDP3sBp1YcH@clusterproject4-j6fjt.gcp.mongodb.net/dailyfeat?retryWrites=true&w=majority';
mongoose.connect(url, {useNewUrlParser: true});
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  console.log("Connected to MongoDb");
});

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
		maxlength: 1024
	}
}));

function validate(user) {
	const schema = {
		login: Joi.string().min(3).max(25).required(),
		email: Joi.string().min(5).max(255).required().email(),
		password: Joi.string().min(5).max(1024).required()
	};

	return Joi.validate(user, schema);
}

exports.User = User;
exports.validate = validate;