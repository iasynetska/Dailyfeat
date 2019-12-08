const users = require('./routes/userRoutes');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use('/api/users', users);

const port = 3000;
app.listen(port, () => console.log(`Server listening on port ${port}...`));