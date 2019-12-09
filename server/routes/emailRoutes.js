const express = require('express');
const {validateEmail, User} = require('../models/userModel');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validateEmail(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({email: req.body.email});
    if(user) return res.status(200).send(true)

    res.status(200).send(false);
});

module.exports = router;