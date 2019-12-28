const bcrypt = require('bcryptjs');
const config = require('config');
const _ = require('lodash');
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth.js');

const { User,
	validateUser,
	validateNewFeat,
	validateUpdatedFeat,
	validateHabit,
	validatePassword,
	formatValidationErrors } = require('../models/userModel');

// create new User
router.post('/', async (req, res) => {
	const { error } = validateUser(req.body);
	if(error) return res.status(400).send({error: {validation : formatValidationErrors(error)}});

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
	if(error) return res.status(400).send({error: {validation : formatValidationErrors(error)}});

	// check if active feat exist
	const user = await User.findOne(
		{
			_id : req.params._idUser,
			feats: {$elemMatch: {'created': {$gt:new Date(Date.now() - 24*60*60 * 1000)}}}
		}
	).catch(error => {
		return res.status(500).send({error: {server: error}});
	});
	if(user) {
		return res.status(400).send({error: {feat: 'Active feat already exists'}});
	}
	
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
	if(error) return res.status(400).send({error: {validation : formatValidationErrors(error)}});

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


// change User's feat
router.patch('/:_idUser/feats/:_idFeat', auth, async (req, res) => {
	// check authorisation
	if(req.params._idUser !== req.user._id) return res.status(403).send({error: {auth: 'Request forbidden'}});

	// validate feat
	const { error } = validateUpdatedFeat(req.body);
	if(error) return res.status(400).send({error: { validation : formatValidationErrors(error)}});

	// get fields from request to update
	let fieldsToUpdate = Object.keys(req.body)
		.reduce((accumulator, currentValue) => {
			accumulator['feats.$.' + currentValue] = req.body[currentValue];
			return accumulator
		}, {});

	// change User's feat
	const dbResponse = await User.findOneAndUpdate(
		{"_id":req.params._idUser, "feats._id": req.params._idFeat},
		fieldsToUpdate,
		{new: true}
	).catch(error => {
		return res.status(500).send({error: {server: error}});
	});

	if(dbResponse) {
		return res.send(_.pick(dbResponse, ['_id', 'login', 'email', 'feats']));
	} else {
		return res.status(404).send({error: {feat: 'Not found'}});
	}
});


// remove User's feat
router.delete('/:_idUser/feats/:_idFeat', auth, async (req, res) => {
	// check authorisation
	if(req.params._idUser !== req.user._id) return res.status(403).send({error: {auth: 'Request forbidden'}});

	// remove User's feat
	const dbResponse = await User.findOneAndUpdate(
		{"_id" : req.params._idUser, "feats._id": req.params._idFeat},
		{$pull: {"feats": {"_id" : req.params._idFeat}}},
		{new: true}
	).catch(error => {
		return res.status(500).send({error: {server: error}});
	});

	if(dbResponse) {
		return res.send(_.pick(dbResponse, ['_id', 'login', 'email', 'feats']));
	} else {
		return res.status(404).send({error: {feat: 'Not found'}});
	}
});


// get only active feat or all feats
router.get('/:_idUser/feats', auth, async (req, res) => {
	// check authorisation
	if (req.params._idUser !== req.user._id) return res.status(403).send({error: {auth: 'Request forbidden'}});

	let dbResponse;
	const onlyActive = req.query.only_active;

	// get db result
	if(onlyActive === "true" || onlyActive === undefined) {
		dbResponse = User.findById(
			req.params._idUser,
			{_id: 0, feats: {$elemMatch: {'created': {$gt:new Date(Date.now() - 24*60*60 * 1000)}}}}
		)
	} else if (onlyActive == "false") {
		dbResponse = User.findById(
			req.params._idUser,
			{_id: 0, feats: 1}
		)
	} else {
		return res.status(400).send({error: {request: "Request parameter is not correct"}});
	}

	// get result from Promise
	const result = await dbResponse.catch(error => {
		return res.status(500).send({error: {server: error}});
	});

	res.send(result);
});

// create new habit
router.post('/:_idUser/habits', auth, async (req, res) => {

	if (req.params._idUser !== req.user._id){ 
		return res.status(403).send({
			error: {
				auth: 'Request forbidden'
			}
		});
	}

	const { habits } = await User.findById(req.params._idUser);

	let isUnfinishedHabit = habits.some(habit => !habit.isClosed);

	if (isUnfinishedHabit) {
		return res.status(400).send({
			error: {
				validation: 'Unfinished habit found'
			}
		});
	}

	const { error } = validateHabit(req.body);
	if (error){ 
		return res.status(400).send({
			error: {
				validation: formatValidationErrors(error)
			}
		});
	}

	const ObjectId = mongoose.Types.ObjectId;
	const idHabit = new ObjectId;
	req.body._id = idHabit;

	const dbResponse = await User.findByIdAndUpdate(
		req.params._idUser, {
			$push: {
				habits: req.body
			}
		}, {
			new: true,
			select: {
				_id: 0,
				habits: {
					$elemMatch: {
						_id: idHabit
					}
				}
			}
		}
	).catch(error => {
		return res.status(500).send({
			error: {
				server: error
			}
		});
	});

	res.send(dbResponse.habits[0]);
});

// change User's habit
router.patch('/:_idUser/habits/:_idHabit', auth, async (req, res) => {

	if (req.params._idUser !== req.user._id) return res.status(403).send({
		error: {
			auth: 'Request forbidden'
		}
	});

	const { error } = validateHabit(req.body);
	if (error) return res.status(400).send({
		error: {
			validation: formatValidationErrors(error)
		}
	});

	let fieldsToUpdate = Object.keys(req.body)
		.reduce((accumulator, currentValue) => {
			accumulator['habits.$.' + currentValue] = req.body[currentValue];
			return accumulator
		}, {});

	const dbResponse = await User.findOneAndUpdate({
			"_id": req.params._idUser,
			"habits._id": req.params._idHabit
		},
		fieldsToUpdate, {
			new: true
		}
	).catch(error => {
		return res.status(500).send({
			error: {
				server: error
			}
		});
	});

	if (dbResponse) {
		return res.send(_.pick(dbResponse, ['habits']));
	} else {
		return res.status(404).send({
			error: {
				feat: 'Not found'
			}
		});
	}
});

module.exports = router;