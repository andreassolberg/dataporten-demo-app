
var users = {
	"solberg": "123"
};

var basicauth = function(req, res, next) {

	console.log("Basic authentication");

	if (!req.headers.hasOwnProperty('authorization')) {
		return next();
	}
	var auth = req.headers['authorization'];  // auth is in base64(username:password)  so we need to decode the base64
	var tmp = auth.split(' ');   // Split on a space, the original auth looks like  "Basic Y2hhcmxlczoxMjM0NQ==" and we need the 2nd part
	if (tmp[0].toLowerCase() !== 'basic') {
		return next();
	}

	console.log("Basic authentication: " + auth);

	var buf = new Buffer(tmp[1], 'base64'); // create a buffer and tell it the data coming in is base64
	var plain_auth = buf.toString();        // read it back out as a string

	console.log("Decoded Authorization ", plain_auth);

	// At this point plain_auth = "username:password"

	var creds = plain_auth.split(':');      // split on a ':'
	var username = creds[0];
	var password = creds[1];

	if (users.hasOwnProperty(username)) {
		if (password === users[username]) {
			req.user = {
				"data": {
					"id": "solberg"
				}
			};
		}
	}
	return next();
}

exports.basicauth = basicauth;