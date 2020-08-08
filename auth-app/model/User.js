const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    username: String,
    password: String,
    uniqueId:String
});

module.exports = mongoose.model('users', userSchema, 'users');
