import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Entypo';
import TicketLine from './TicketLine.js';
import AddForm from './AddForm.js';

export default class Admin extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: this.props.navigation.state.params.user,
      tickets: this.props.navigation.state.params.tickets,
      socket: this.props.navigation.state.params.socket
    }
  }

  static navigationOptions = {
    title: 'Admin Hub'
  }

  render() {
    const {navigate} = this.props.navigation;
    return (
      <View style={styles.container}>
        <Text style={styles.welcome}>Welcome, {this.state.user.name}!</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigate('TicketLine', {
            screen: TicketLine,
            tickets: this.state.tickets,
            socket: this.state.socket,
            updateTickets: this.updateTickets,
            user: this.state.user
          })}
        >
          <Text style={styles.text}>Enter Ticket Line</Text>
          <Icon name='ticket' style={styles.icon} size={25} color='cornsilk'/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Ticket Stats</Text>
          <Icon name='line-graph' style={styles.icon} size={25} color='cornsilk'/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.text}>Tutor Stats</Text>
          <Icon name='line-graph' style={styles.icon} size={25} color='cornsilk'/>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigate('AddForm', {
            screen: AddForm,
            role: 'tutor',
            socket: this.state.socket
          })}
        >
          <Text style={styles.text}>Add Tutor</Text>
          <Icon name='baidu' style={styles.icon} size={25} color='cornsilk'/>
        </TouchableOpacity>
        <TouchableOpacity
        style={styles.button}
        onPress={() => navigate('AddForm', {
          screen: AddForm,
          role: 'admin',
          socket: this.state.socket
        })}>
          <Text style={styles.text}>Add Admin</Text>
          <Icon name='baidu' style={styles.icon} size={25} color='cornsilk'/>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#5206B4',
    paddingTop: 40,
  },
  button: {
    marginTop: 20,
    marginBottom: 20,
    flexDirection: 'row',
    backgroundColor: '#C19AF3',
    paddingTop: 15,
    paddingBottom: 10
  },
  welcome: {
    fontSize: 30,
    fontFamily: 'ChalkboardSE-Regular',
    fontWeight: 'bold',
    marginBottom: 20,
    color: 'cornsilk'
  },
  text: {
    fontFamily: 'ChalkboardSE-Regular',
    fontWeight: 'bold',
    fontSize: 20,
    color: 'cornsilk',
    marginLeft: 20
  },
  icon: {
    paddingLeft: 10
  }
})





