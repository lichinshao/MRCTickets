const mongoose = require('mongoose');
const dbUri = require('./dbConfig.js').dbUri;
const Schema = mongoose.Schema;

mongoose.connect(dbUri);
const db = mongoose.connection;


/*****Connection *****/
db.on('connected', () => {
  console.log('connected to db')});

db.on('error', () => {
  console.log('error in connecting to db')
});

/***** Schemas *****/

const user = new Schema ({
  name: String,
  username: String,
  password: String,
  role: String
});

const ticket = new Schema({
  createdBy: String,
  createdAt: Date,
  claimedBy: String,
  claimedAt: Date,
  closedAt: Date,
  class: String,
  description: String,
  location: String,
  status: String
});


/**** Model Creation *****/
const User = mongoose.model('User', user);
const Ticket = mongoose.model('Ticket', ticket);

/* Export */

module.exports = {
  User: User,
  Ticket: Ticket,
  mongoose: mongoose
}