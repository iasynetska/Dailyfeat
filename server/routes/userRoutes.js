const bcrypt = require('bcryptjs');
const config = require('config');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();

const {User, validateUser, validateFeat} = require('../models/userModel');
const {checkUserAuthorised} = require('../services/jwtTools');


// create new User
router.post('/', async (req, res) => {
	const { error } = validateUser(req.body);
	if(error) return res.status(400).send(error.details[0].message);

	// check for unique email
	let user = await User.findOne({email:req.body.email});
	if(user) {
		const message = {error: {}};
		message.error.email = 'Email already exists';
		return res.status(400).send(message);
	}

	// create new user
	user = new User(_.pick(req.body, ['login', 'email', 'password', 'feats']));
	const salt = await bcrypt.genSalt(config.get("bcrypt.salt"));
	user.password = await bcrypt.hash(user.password, salt);
	await user.save().catch(error => {
		return res.status(500).send({error: {server: error}});
	});

	const token = user.generateAuthToken();
	res.header('x-auth-token', token).send(_.pick(user, ['_id', 'login', 'email']));
});


// create new feat
router.post('/:_id/feats', async (req, res) => {
	// check user authorised
	if(!checkUserAuthorised(req, res)) return;
	
	// validate feat
	const { error } = validateFeat(req.body);
	if(error) return res.status(400).send({error: {validate: error.details[0].message}});
	
	// generating id for new feat
	const ObjectId = mongoose.Types.ObjectId;
	const idFeat = new ObjectId;
	req.body._id = idFeat;
	
	// create new feat
	const dbResponse = await User.findByIdAndUpdate(
		req.params._id, {
			$push: {
				feats: req.body
			}
		}, {new: true, select: {_id: 0, feats: { $elemMatch: {_id: idFeat} }}}
	).catch(error => {
		return res.status(500).send({error: {server: error}});
	});
	
	res.send(dbResponse.feats[0]);
});

module.exports = router;