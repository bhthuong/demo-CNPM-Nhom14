var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');
var Schema = mongoose.Schema;
var schema = new Schema({
    ID: { type: String, required: false, allowNull: false, primaryKey: true},
    name: { type: String, required: false },
    dateOfBirth: { type: Date, required: false },
    age: { type: Number, required: false },
    sdt: { type: String, required: false },
    address: { type: String, required: false },

});

module.exports = mongoose.model('UserNV', schema);