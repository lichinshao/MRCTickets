const express = require('express');
const db = require('../database/db').mongoose;
const http = require('http');
const socketio = require('socket.io');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const moment = require('moment-timezone');
const User = require('../database/db').User;
const Ticket = require('../database/db').Ticket;



const app = express();
const server = http.Server(app);
let socket = socketio(server);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var port = process.env.PORT || 3300;
server.listen(port, () => {console.log('listening on 3300...')});

socket.on('connection', socket => {
  console.log('this is the socket id', socket.id)
  console.log('this is the handshake', socket.handshake)

  socket.on('get tickets', () => {
      console.log('getting tickets')
     Ticket.find({}, (err, tickets) => {
      if (err) throw err;
      if (tickets) {
        socket.emit('tickets', tickets);
      }
    })
  })

  socket.on('update admin tickets', () => {
    Ticket.find({}, (err, tickets) => {
      if (err) throw err;
      if (tickets) {
        socket.emit('update admin tickets', tickets);
      }
    })
  })

  socket.on('submitting ticket', (ticket) => {
    let now = moment.tz('America/Los_Angeles').format();
    now = now.slice(0, 19);
    let newTicket = {
      createdBy: ticket.createdBy,
      createdAt: now,
      class: ticket.class,
      description: ticket.description,
      location: ticket.location,
      status: 'open'
    };
    Ticket.findOne({
      createdBy: ticket.createdBy,
      class: ticket.class
    }, (err, ticket) => {
      if (err) throw err;
      if (!ticket) {
        Ticket.create(newTicket, (err, entry) => {
          if (err) throw err;
          if (entry) {
            Ticket.find({}, (err, tickets) => {
              if (err) throw err;
              if (tickets) {
                socket.emit('ticket submitted!', tickets);
              }
            })
          }
        })
      }else {
        socket.emit('duplicate ticket');
      }
    })
  })

  socket.on('change ticket status', (ticket) => {
    Ticket.findOne({
      createdBy: ticket.createdBy,
      class: ticket.class
    }, (err, ticket) => {
      if (err) throw err;
      if (!ticket) {
        socket.emit('could not find ticket in db');
      }
      if (ticket) {
        if (!ticket.status || ticket.status === 'open') {
          Ticket.update({
            createdBy: ticket.createdBy,
            class: ticket.class}, {$set: {status: 'claimed'}}, function(err, ticket){
            if (err) {console.log('err', err)}
            console.log(ticket)
            socket.emit('status successfully changed!');
          })
        }
        if (ticket.status === 'claimed') {
          Ticket.update(ticket, {$set: {status: 'closed'}}, (err, ticket) => {
            if (err) throw err;
            socket.emit('status successfully changed!')
          })
        }
      }
    })
  })

  socket.on('add user', user => {
    console.log('adding this user', user);
    let salt = bcrypt.genSaltSync(10);
    let salt2 = bcrypt.hashSync(user.password, salt);
    let newUser = user;
    newUser.password = salt2;
    console.log(newUser)
    User.findOne({name: newUser.name}, (err, user) => {
    if (err) throw err;
    if (!user) {
      User.create(newUser, (err, entry) => {
        if (err) throw err;
        if (entry) {
          socket.emit('successfully added user!')
       }
      })
    } else {
      socket.emit('user already exists!')
    }
  })
  })

})

/**** Request handlers ***/
app.get('/getTickets', getTickets);
app.post('/submitTicket', submitTicket);
app.post('/addAdmin', addAdmin);
app.post('/addTutor', addTutor);
app.post('/login', login);
app.post('/changeTicketStatus', changeTicketStatus);



/***Helper Functions***/
function getTickets(req, res) {
  Ticket.find({}, (err, tickets) => {
    if (err) throw err;
    if (tickets) {
      console.log('server getting tickets in db', tickets)
    }
  })
}

function submitTicket(req, res) {
  console.log('in server submitting ticket', req.body)
  let time = moment.tz('America/Los_Angeles').format();
  let newTicket = {
    createdBy: req.body.createdBy,
    createdAt: time,
    class: req.body.class,
    description: req.body.description,
    location: req.body.location,
    status: 'open'
  };
  Ticket.findOne({
    createdBy: req.body.createdBy,
    class: req.body.class
  }, (err, ticket) => {
    if (err) throw err;
    if (!ticket) {
      Ticket.create(newTicket, (err, entry) => {
        if (err) throw err;
        res.status(200);
        res.send(newTicket);
      })
    }else {
      res.status(200);
      res.send('duplicate ticket');
    }
  })
}

function addAdmin(req, res) {
  let salt = bcrypt.genSaltSync(10);
  let salt2 = bcrypt.hashSync(req.body.password, salt);
  let newAdmin = {
    name: req.body.name,
    username: req.body.username,
    role: 'admin',
    password: salt2
  };
  User.findOne({name: req.body.name}, (err, user) => {
    if (err) throw err;
    if (!user) {
      User.create(newAdmin, (err, entry) => {
        if (err) throw err;
        if (entry) {
          res.status(200);
          res.send(newAdmin);
       }
      })
    } else {
       res.status(200);
       res.send('this admin already exists')
    }
  })
}

function addTutor(req, res) {
  console.log('in addTutor in server');
  let salt = bcrypt.genSaltSync(10);
  let salt2 = bcrypt.hashSync(req.body.password, salt);
  let newTutor = {
    name: req.body.name,
    username: req.body.username,
    role: 'tutor',
    password: salt2
  };
  User.findOne({username: req.body.username}, (err, user) => {
    if (err) throw err;
    if (!user) {
      User.create(newTutor, (err, entry) => {
        if (err) throw err;
        if (entry) {
          res.status(200);
          res.send(newTutor);
       }
      })
    } else {
       res.status(200);
       res.send('this tutor already exists')
    }
  })
}

function login(req, res) {
  let username = req.body.username;
  let password = req.body.password;

  User.findOne({username: req.body.username}, (err, user) => {
    if (err) throw err;
    if (!user) {
      res.status(200);
      res.send('user does not exist');
    } else if (bcrypt.compareSync(password, user.password)) {
        res.status(200);
        res.send(user);
    } else {
      res.status(200);
      res.send('incorrect password');
    }
  })
}

function changeTicketStatus(req, res) {
  console.log('in change ticket status in server', req.body)
  let ticket = req.body;
  Ticket.findOne({
    createdBy: ticket.createdBy,
    class: ticket.class
  }, (err, ticket) => {
    if (err) throw err;
    if (!ticket) {
      res.status(200);
      res.send('could not find ticket in db')
    }
    if (ticket) {
      console.log('changing status?', ticket)
      if (!ticket.status) {
        Ticket.update({
          createdBy: ticket.createdBy,
          class: ticket.class}, {$set: {status: 'claimed'}}, function(err, ticket){
          if (err) {console.log('err', err)}
          // console.log(ticket)
          res.status(200);
          res.send(ticket);
        })
      }
      if (ticket.status === 'claimed') {
        Ticket.update(ticket, {$set: {status: 'closed'}}, (err, ticket) => {
          if (err) throw err;
          res.status(200);
          res.send(ticket);
        })
      }

    }
  })
}






