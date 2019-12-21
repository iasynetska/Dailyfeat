const bcrypt = require('bcryptjs');
const config = require('config');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.js')

const {User, validateUser, validateNewFeat, validatePassword} = require('../models/userModel');

// create new User
router.post('/', async (req, res) => {
	const { error } = validateUser(req.body);
	if(error) return res.status(400).send(error.details[0].message);

	// check for unique email
	let user = await User.findOne({email:req.body.email});
	if(user) {
		return res.status(400).send({error: {email: 'Email already exists'}});
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
router.post('/:_idUser/feats', auth, async (req, res) => {
	// check authorisation
	if(req.params._idUser !== req.user._id) return res.status(403).send({error: {auth: 'Request forbidden'}});
	
	// validate feat
	const { error } = validateNewFeat(req.body);
	if(error) return res.status(400).send({error: {validate: error.details[0].message}});
	
	// generating id for new feat
	const ObjectId = mongoose.Types.ObjectId;
	const idFeat = new ObjectId;
	req.body._id = idFeat;
	
	// create new feat
	const dbResponse = await User.findByIdAndUpdate(
		req.params._idUser, {
			$push: {
				feats: req.body
			}
		}, {new: true, select: {_id: 0, feats: { $elemMatch: {_id: idFeat} }}}
	).catch(error => {
		return res.status(500).send({error: {server: error}});
	});
	
	res.send(dbResponse.feats[0]);
});


// change User's password
router.patch('/:_idUser', auth, async (req, res) => {
	// check authorisation
	if(req.params._idUser !== req.user._id) return res.status(403).send({error: {auth: 'Request forbidden'}});

	// validate password
	const { error } = validatePassword(req.body);
	if(error) return res.status(400).send({error: {validate: error.details[0].message}});

	//hash new password
	const salt = await bcrypt.genSalt(config.get("bcrypt.salt"));
	req.body.password = await bcrypt.hash(req.body.password, salt);

	// change User's password
	const dbResponse = await User.findByIdAndUpdate(
		req.params._idUser,
		req.body,
		{new: true}
	).catch(error => {
		return res.status(500).send({error: {server: error}});
	});

	res.send(_.pick(dbResponse, ['_id', 'login', 'email', 'feats']));
});

module.exports = router;