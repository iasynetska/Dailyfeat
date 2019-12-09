// point 'config' module to configuration folder
process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";

const config = require('config');
const bodyParser = require('body-parser');
const mongo = require('./services/mongo.js');
const corsHeaders = require('./services/corsHeaders.js');

const users = require('./routes/userRoutes');
const emails = require('./routes/emailRoutes');
const test = require('./routes/testRoutes');
const auth = require('./routes/authRoutes.js');

const express = require('express');
const app = express();

// app.use(addAccessControl);
app.use(corsHeaders.addHeaders);
app.use(bodyParser.json());
app.use('/api/users', users);
app.use('/api/emails', emails);
app.use('/api/test', test);
app.use('/api/auth', auth);

mongo.connect();

const port = process.env.PORT || config.get("server.port");
app.listen(port, () => console.log(`Server listening on port ${port}...`));