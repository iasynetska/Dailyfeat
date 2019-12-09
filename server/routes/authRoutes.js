const bcrypt = require('bcryptjs');
const _ = require('lodash');
const { User, validateUserAuth } = require('../models/userModel');
const express = require('express');

const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validateUserAuth(req.body)
    if (error) return res.status(400).send(error.details[0].message);

    let user = await User.findOne({ email: req.body.email})
    if (!user) return res.status(400).send('Invalid email or password.');

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) return res.status(400).send('Invalid email or password.');

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ['login', 'email']));
});

module.exports = router;