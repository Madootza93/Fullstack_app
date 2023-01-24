var mongoose = require('mongoose');
var schema = mongoose.Schema;

let placeSchema = new schema({
    name: {type:String, require:true},
    icon: {type:String, require:true},
    placeUrl: {type:String, require:true},
    entryDate: {type:Date, default:Date.now}
});

let usersSchema = new schema({
    email: {type:String, require:true},
    pwd: {type:String, require:true},
    entryDate: {type:Date, default:Date.now}
});

let place = mongoose.model('place', placeSchema, 'places');
let users = mongoose.model('users', usersSchema, 'users');
let mySchemas = {'place':place, 'users':users};

module.exports = mySchemas;