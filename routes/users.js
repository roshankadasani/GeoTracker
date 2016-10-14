var express = require('express');
var router = express.Router();
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

var User = require('../models/user')

router.get('/register', function(req, res){
	res.render('register');
});

router.get('/login', function(req, res){
	res.render('login');
});

router.post('/register', function(req, res){
	var agent_name = req.body.agent_name;
	var agent_id = req.body.agent_id;
	var agent_email = req.body.agent_email;
	var password1 = req.body.password1;
	var password2 = req.body.password2;

	req.checkBody('agent_name', 'Name is required').notEmpty();
	req.checkBody('agent_id', 'ID is required').notEmpty();
	req.checkBody('agent_email', 'Email is not valid').isEmail();
	req.checkBody('password1', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password1);

	var errors = req.validationErrors();

	if(errors){
		res.render('register',{
			errors:errors
		});
	} else {
		var newUser = new User({
			agent_name: agent_name,
			agent_email: agent_email,
			agent_id: agent_id,
			password1: password1
		});

		User.createUser(newUser, function(err, user){
			if(err) throw err;
			console.log(user);
		});

		req.flash('success_msg', 'You are registered and can now login');
		res.redirect('/users/login');
	}
});

passport.use(new LocalStrategy(
  function(username, password, done) {
   User.getUserByUserId(username, function(err, user){
		 if(err) throw err;
		 if(!user){
			 return done(null, false, {message: 'Unknown User'});
		 }
		 User.comparePassword(password, user.password1, function(err, isMatch){
			 if(err) throw err;
			 if(isMatch){
				 return done(null, user);
			 } else {
				 return done(null, false, {message:'Invalid password'})
			 }

		 });
	 });
  }));

passport.serializeUser(function(user, done) {
  done(null, user.id);
});

passport.deserializeUser(function(id, done) {
  User.getUserById(id, function(err, user) {
    done(err, user);
  });
});

router.post('/login',
  passport.authenticate('local', {successRedirect:'/', failureRedirect:'/users/login',failureFlash: true}),
  function(req, res) {
    res.redirect('/');
  });

router.get('/logout', function(req,res) {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
})

module.exports = router;
