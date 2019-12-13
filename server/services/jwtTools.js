const jwt = require('jsonwebtoken');
const config = require('config');

function checkUserAuthorised(req, res) {
	try{
		const { _id } = jwt.verify(req.headers['x-auth-token'], config.get("jwtPrivateKey"));
		if(req.params._id !== _id) 
		{
			res.status(403).send({error: {auth: 'Not authorised'}});
			return false;
		}
	} catch (error) {
		res.status(401).send({error: {auth: error}});
		return false;
	}
	return true;
}

exports.checkUserAuthorised = checkUserAuthorised;