var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');

// User Schema
var UserSchema = mongoose.Schema({
	agent_id: {
		type: String,
		index:true
	},
	password1: {
		type: String
	},
	agent_email: {
		type: String
	},
  agent_name: {
		type: String
	}
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
	bcrypt.genSalt(10, function(err, salt) {
	    bcrypt.hash(newUser.password1, salt, function(err, hash) {
	        newUser.password1 = hash;
	        newUser.save(callback);
	    });
	});
}

module.exports.getUserByUserId = function(agent_id, callback) {
  var query = {agent_id: agent_id};
  User.findOne(query, callback);
}

module.exports.getUserById = function(id, callback){
	User.findById(id, callback);
}


module.exports.comparePassword = function(candidatePassword, hash, callback){
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    	if(err) throw err;
    	callback(null, isMatch);
	});
}
