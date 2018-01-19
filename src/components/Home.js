import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Alert,
  Image
} from 'react-native';
window.navigator.userAgent = 'react-native';
import Socket from 'socket.io-client';
import Icon from 'react-native-vector-icons/Entypo';
import { StackNavigator } from 'react-navigation';
import Login from './Login.js';
import TicketLine from './TicketLine.js';
import CreateTicket from './CreateTicket.js';

export default class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      tickets: ''
    }
    this.socket = Socket('http://localhost:3300');
    this.updateTickets = this.updateTickets.bind(this);
  }
  static navigationOptions = {
    title: 'Home',
    header: null
  }

  componentWillMount(){
    this.updateTickets();
  }

  updateTickets() {
    this.socket.emit('get tickets');
    this.socket.on('tickets', tickets => {
      this.setState({tickets: tickets});
    })
  }

  render() {
    const { navigate } = this.props.navigation;
    return(
      <View style={styles.container}>
        <View style={styles.headingContainer}>
          <Image source={{uri: 'https://www.dropbox.com/s/ozm5kqgffcuuwtb/bulldog.jpeg?dl=0'}}/>
          <Text style={styles.heading}>Welcome to</Text>
          <Text style={styles.heading}>MRC-Tickets!</Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigate('TicketLine', {
            screen: TicketLine,
            tickets: this.state.tickets,
            socket: this.socket,
            updateTickets: this.updateTickets
          })}
          >

            <Text style={styles.buttonText}>Enter Tickets
            </Text>
            <Icon name='ticket' style={styles.icon} size={25}/>

        </TouchableOpacity>
        <Text style={styles.text}>-- OR --</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigate('Login', {
            screen: 'Login',
            tickets: this.state.tickets,
            socket: this.socket,
            updateTickets: this.updateTickets
          })}
          >
            <Text style={styles.buttonText}>Staff Sign-In</Text>
            <Icon name='baidu' style={styles.icon} size={25}/>
        </TouchableOpacity>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0E4791',
    alignItems: 'center'
  },
  headingContainer: {
    marginTop: 100,
    marginBottom: 70,
    justifyContent: 'center'
  },
  heading: {
    fontWeight: 'bold',
    fontSize: 40,
    textAlign: 'center',
    color: 'white',
    fontFamily: 'ChalkboardSE-Regular'
  },
  text: {
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 20,
    color: '#B0C4DE',
    paddingRight: 20
  },
  button : {
    flexDirection: 'row',
    marginTop: 40,
    marginBottom: 30,
  },
  buttonText: {
    fontSize: 20,
    marginBottom:20,
    color: 'cornsilk',
    fontWeight: 'bold',
    fontFamily: 'ChalkboardSE-Light',
    marginRight: 10
  },
  icon: {
    marginLeft: 5,
    color: 'cornsilk'
  }
})