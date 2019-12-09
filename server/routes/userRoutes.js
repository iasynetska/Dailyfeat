const bcrypt = require('bcryptjs');
const config = require('config');
const _ = require('lodash');
const {User, validate} = require('../models/userModel');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

// create new User
router.post('/', async (req, res) => {
	const { error } = validate(req.body);
	if(error) return res.status(400).send(error.details[0].message);

	// check for unique login and email
	let users = await User.find( {$or: [ {login:req.body.login},  {email:req.body.email} ]});
	if(users.length > 0) {
		const message = {error: {}};
		if(users.some(user => user.login === req.body.login)) {
			message.error.login = 'Login already exists';
		}
		if(users.some(user => user.email === req.body.email)) {
			message.error.email = 'Email already exists';
		}
		return res.status(400).send(message);
	}

	// create new user
	user = new User(_.pick(req.body, ['login', 'email', 'password']));
	const salt = await bcrypt.genSalt(config.get("bcrypt.salt"));
	user.password = await bcrypt.hash(user.password, salt);
	await user.save().catch(error => {
		return res.status(500).send({error: {server: error}});
	});

	res.send(_.pick(user, ['login', 'email']));
});

module.exports = router;