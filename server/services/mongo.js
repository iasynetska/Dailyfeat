const config = require('config');
const mongoose = require('mongoose');

// connect to MongoDb
const connect = function(){
	const user = config.get("mongo.user");
	const password = config.get("mongo.password");
	const server = config.get("mongo.server");
	const collection = config.get("mongo.collection");

	const url = 'mongodb+srv://'+user+':'+password+'@'+server+'/'+collection+'?retryWrites=true&w=majority';
	mongoose.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
	var db = mongoose.connection;
	db.on('error', console.error.bind(console, 'connection error:'));
	db.once('open', function() {
	  console.log("Connected to MongoDb");
	});
}

module.exports.connect = connect;