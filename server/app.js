// point 'config' module to configuration folder
process.env["NODE_CONFIG_DIR"] = __dirname + "/config/";

const config = require("config");
const users = require('./routes/userRoutes');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongo = require('./services/mongo.js');

app.use(bodyParser.json());
app.use('/api/users', users);

mongo.connect();

const port = config.get("server.port");
app.listen(port, () => console.log(`Server listening on port ${port}...`));