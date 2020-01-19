var addHeaders = function (req, res, next) {
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'X-Requested-With, content-type, Authorization');
  next();
}

module.exports.addHeaders = addHeaders;