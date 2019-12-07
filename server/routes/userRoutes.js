const {User, validate} = require('../models/userModel');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
	const { error } = validate(req.body);
	if(error) return res.status(400).send(error.details[0].message);

	let user = await User.findOne({ email:req.body.email });
	if(user) return res.status(400).send('User already registered.');

	user = new User({
		login: req.body.login,
		email: req.body.email,
		password: req.body.password
	});

	await user.save().catch(error => console.log(error));

	res.send(user);
});

module.exports = router;