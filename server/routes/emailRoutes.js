const express = require('express');
const {validateEmail} = require('../models/userModel');
const router = express.Router();

router.post('/', async (req, res) => {
    const { error } = validateEmail(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    res.status(500).send("OK");
});

module.exports = router;