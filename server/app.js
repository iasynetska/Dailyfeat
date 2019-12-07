const users = require('./routes/users');
const express = require('express');
const app = express();

app.use('/api/users', users);