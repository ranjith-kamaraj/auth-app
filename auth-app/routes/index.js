const express = require('express');
const router = express.Router();
const bunyan = require('bunyan');

let logger = bunyan.createLogger({name: "auth-app"});

const loggedIn = (req, res, next) => {
   if(req.isAuthenticated()){
     logger.info(`Successfully user authenticated!`)
     next()
   }
   else{
     res.redirect('/login');
   }
}

/* GET home page. */
router.get('/', function(req, res, next) {
  logger.info(`Welcome page!`)
  res.render('index');
});

router.get('/login', function(req, res, next) {
  logger.info(`Login page!`)
  res.render('login');
});

router.get('/signup', function(req, res, next) {
  logger.info(`SignUp page!`)
  res.render('signup');
});

router.get('/profile', loggedIn, function(req, res, next) {
  logger.info(`Profile page: ${req.session}`)
  res.send(req.session);
});

router.get('/logout', function(req, res, next){
  req.logout(),
  res.redirect('/')
})

module.exports = router;
