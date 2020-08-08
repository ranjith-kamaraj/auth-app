const express = require('express');
const router = express.Router();
const User = require('../model/User');
const bcrypt = require('bcrypt-nodejs');
const bunyan = require('bunyan');

const logger = bunyan.createLogger({
    name: 'auth-app',
    env: process.env.NODE_ENV,
    serializers: bunyan.stdSerializers,
    src: true
});

const hashPassword = (password) => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(10));
};

module.exports = function async(passport) {

    router.post('/signup', async(req, res) => {
        const { username, password } = req.body;

        await User.findOne({ username }, (err, doc) => {
            if (err) {
                logger.error(`Error occurs: ${err.message}`);
                res.status(500).send('Error occurs!');
            }
            else {
                if (doc) {
                    logger.info(`User already exist: ${JSON.stringify(doc)}`);
                    res.status(500).send('User already exist!')
                }
                else {
                    const record = new User({
                        username,
                        password: hashPassword(password),
                        uniqueId: new Date().getTime()
                    })
                    record.save((err, user) => {
                        if (err) {
                            logger.error(`Database Error: ${err.message}`);
                            res.send('Database Error!')
                        }
                        else {
                            logger.info(`User added: ${user}`);
                            res.send(user);
                        }
                    })
                }
            }
        })

    });

    router.post('/login', passport.authenticate('local', {
        failureRedirect: '/login',
        successRedirect: '/profile'
    }), (req, res) => {
        res.send('Hey!');
    });

    return router;
};
