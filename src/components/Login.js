import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  Button
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Entypo';
import Admin from './Admin.js';
import TicketLine from './TicketLine.js';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      tickets: this.props.navigation.state.params.tickets,
    }
    this.login = this.login.bind(this);
  }


  static navigationOptions = {
    title: 'Login'
  }

  login() {
    let username = this.state.username;
    if (username === 'Admin') {
      username = username.toLowerCase();
    }
    let password = this.state.password;
    let tickets = this.state.tickets;
    return fetch('http://localhost:3300/login', {
      method:'post',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          username: username,
          password: password
       })
    }).then(res => {
      console.log('res', res)
      if (res._bodyText === 'user does not exist') {
        Alert.alert('Uh Oh!', 'username does not exist');
      } else if (res._bodyText === 'incorrect password') {
        Alert.alert('Uh Oh!', 'password is incorrect!');
      } else {
        const {navigate} = this.props.navigation;
        let user = JSON.parse(res._bodyText);
        if (user.role === 'admin') {
          navigate('Admin', {
          screen: Admin,
          user: user,
          tickets: tickets,
          socket: this.props.navigation.state.params.socket
          })
        }
        if (user.role === 'tutor') {
          navigate('TicketLine', {
            screen: TicketLine,
            user: user,
            tickets: tickets,
            socket: this.props.navigation.state.params.socket
          })
        }
      }
    })
  }


  render() {
    return(
      <View style={styles.container}>
        <TouchableOpacity style={styles.touch}>
          <Icon name='user' style={styles.icon} size={20} color='cornsilk'/>
          <TextInput
            multiline= {false}
            numberOfLines={1}
            maxLength={300}
            style={styles.inputField}
            placeholder='username'
            onChangeText={text => this.setState({username: text})}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.touch}>
          <Icon name='key'style={styles.icon} size={20} color='cornsilk'/>
           <TextInput
            multiline= {false}
            numberOfLines={1}
            maxLength={300}
            style={styles.inputField}
            placeholder='password'
            secureTextEntry={true}
            onChangeText={text => this.setState({password: text})}
          />
        </TouchableOpacity>
        <TouchableOpacity onPress={this.login} style={styles.login} >
          <Text style={styles.loginText}>Log In!</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#129DB7',
    paddingTop: 200,

  },
  touch: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 0,
    marginBottom: 10,

  },
  inputField: {
    height: 40,
    width: 200,
    paddingLeft: 5,
    backgroundColor: 'cornsilk',
    borderColor: 'black',
    borderRadius: 10
  },
  icon: {
    paddingRight: 5
  },
  login: {
    marginTop: 30,
    borderRadius: 10
  },
  loginText: {
    color: 'cornsilk',
    fontFamily: 'ChalkboardSE-Regular',
    fontSize: 20,
    paddingLeft: 10,
    paddingRight: 10,
  }
})