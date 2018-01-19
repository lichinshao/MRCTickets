import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  TextInput,
  Image,
  ImageBackground
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { StackNavigator } from 'react-navigation';
import CreateTicket from './CreateTicket.js';

export default class TicketLine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: this.props.navigation.state.params.tickets,
      socket: this.props.navigation.state.params.socket,
      user: this.props.navigation.state.params.user
    }
    this.updateTickets = this.updateTickets.bind(this);
    this.createTicketList = this.createTicketList.bind(this);
    this.setTickets = this.setTickets.bind(this);
    this.changeTicketStatus = this.changeTicketStatus.bind(this);

  }

  static navigationOptions = {
    title: "Ticket Line"
  }

  componentWillMount() {
    this.updateTickets();
  }

  componentWillUnmount() {
    this.state.socket.removeListener('tickets', this.setTickets);
  }

  updateTickets() {
    this.state.socket.emit('get tickets');
    this.state.socket.on('tickets', (tickets) => {
      this.setState(tickets);
    });
  }

  setTickets(tickets) {
    this.setState({tickets: tickets})
  }

  changeTicketStatus(ticket) {
    let socket = this.state.socket;
    socket.emit('change ticket status', ticket);
    socket.on('status successfully changed!', this.updateTickets);
  }



  createTicketList() {
    let tick = this.state.tickets;
    let tickets = cutClosedTickets(tick);
    tickets.forEach(ticket => modifyTime(ticket));

    if (!this.state.user) {
    return tickets.map((ticket, ind) => (
        <TouchableOpacity style={styles.ticket} key={ind}>
          <Icon name='ticket' size={20} color='cornsilk'/>
          <Text style={styles.coveredTicket}>{ticket.createdBy}</Text>
          <Text style={styles.coveredTicket}>{ticket.created}</Text>
        </TouchableOpacity>
      ))
    } else {
      tickets.map(ticket => {
        if (!ticket.status) {
          ticket.status = 'open';
        }
        if (ticket.status === 'open') {
          ticket.next = 'claim';
          ticket.sty = 'open';
        }
        if (ticket.status === 'claimed') {
          ticket.next = 'close';
          ticket.sty = 'claim';
        }
    })
      return (
        tickets.map((ticket, ind) => (
          <TouchableOpacity key={ind} style={styles[ticket.sty]} onPress={() => this.changeTicketStatus(ticket)}>
            <Icon name='ticket' size={20} color='cornsilk'/>
            <Text style={styles.text}>{ticket.createdBy}</Text>
            <Text style={styles.text}>{ticket.class}</Text>
            <Text style={styles.text}>{ticket.next}</Text>
          </TouchableOpacity>
        ))
      )
    }
  }

  render() {
    const { navigate } = this.props.navigation;
    if(!this.state.user) {
      return (
        <View style={styles.container}>
          <View>
            <TouchableOpacity
              style={styles.create}
              onPress={() => navigate('CreateTicket', {
                screen: CreateTicket,
                socket: this.props.navigation.state.params.socket,
                updateTickets: this.updateTickets
              })}
              >
                <Text style={styles.text}>Create a ticket</Text>
                <Icon name='new-message' style={styles.icon} size={30} color='cornsilk'/>
            </TouchableOpacity>
          </View>
          <View style={styles.ticketContainer}>
          <ImageBackground source={require('./MRC_Logo.png')} style={styles.containerImage}>
            <View style={styles.ticketList}>
            {this.createTicketList()}
            </View>
         </ImageBackground>
          </View>
        </View>
      )
    } else {
      return (
        <View style={styles.container}>
          {this.createTicketList()}
        </View>
      )
    }
  }
}

function modifyTime(ticket) {
  var time = ticket.createdAt.substr(11,8);
  var hour = time.substr(0, 2);
  if (Number(hour) > 12) {
    var modHour = Number(hour) - 12;
    time = modHour + time.slice(2, 8) + ' PM';
  } else {
    time = time.slice(1, 8);
    time += ' AM';
  }
  ticket.created = time;
  return;
}

function cutClosedTickets(tickets){
  for (let i = 0; i < tickets.length; i++) {
    if (tickets[i].status === 'closed') {
      tickets.splice(i, 1);
    }
  }
  return tickets;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#129DB7',
    alignItems: 'center'
  },
  containerImage: {
    width: 370,
    height: 400,
    alignItems: 'center'
  },
  ticketContainer: {
    alignItems: 'center',
    width: 450,
    height: 300
  },
  create: {
    width: 350,
    marginTop: 20,
    marginBottom: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    backgroundColor: '#0E4791',
    paddingTop: 10,
    paddingBottom: 5,
    borderRadius: 10
  },
  icon: {
    paddingLeft: 30
  },
  text: {
    fontSize: 16,
    alignSelf: 'center',
    fontFamily: 'ChalkboardSE-Regular',
    fontWeight: 'bold',
    paddingBottom: 5,
    color: 'cornsilk'
  },
  ticket: {
    marginTop: 5,
    marginBottom: 5,
    paddingTop:3,
    paddingBottom: 3,
    flexDirection: 'row',
    backgroundColor: '#129DB7',
    justifyContent: 'space-between',
    paddingLeft: 20,
    paddingRight: 20,
    width: 350,
    borderRadius: 10
  },
  coveredTicket:{
    color: 'cornsilk',
    fontFamily: 'ChalkboardSE-Regular',
    fontWeight: 'bold',
  },
  open: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#129DB7',
    width: 350,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 10
  },
  claim: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#AB096C',
    width: 350,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 5,
    paddingRight: 5,
    borderRadius: 10
  },
  ticketList: {
    marginTop: 10
  }


})