const localStrategy = require('passport-local').Strategy;
const User = require('./model/User');
const bcrypt = require('bcrypt-nodejs')

const comparePassword = (password, hash) => {
    return bcrypt.compareSync(password, hash);
};

module.exports = function (passport) {
    passport.serializeUser((user, done) => {
        done(null, user)
    })

    passport.deserializeUser((user, done) => {
        done(null, user)
    })

    passport.use(new localStrategy((username, password, done) => {
        User.findOne({ username }, (err, doc) => {
            if (err) {
                done(err);
            }
            else {
                if (doc) {
                    const valid = comparePassword(password, doc.password);
                    if (valid) {
                        done(null, { doc })
                    }
                    else {
                        done(null, false);
                    }
                }
                else {
                    done(null, false);
                }
            }
        })
    }));
}