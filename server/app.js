// point 'config' module to configuration folder
process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";

const config = require('config');

const users = require('./routes/userRoutes');
const emails = require('./routes/emailRoutes');
const test = require('./routes/testRoutes');

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongo = require('./services/mongo.js');

app.use(bodyParser.json());
app.use('/api/users', users);
app.use('/api/emails', emails);
app.use('/api/test', test);

mongo.connect();

const port = process.env.PORT || config.get("server.port");
app.listen(port, () => console.log(`Server listening on port ${port}...`));