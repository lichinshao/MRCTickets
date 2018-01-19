import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Picker,
  Modal,
  TextInput,
  Alert
} from 'react-native';
import { StackNavigator } from 'react-navigation';
import Icon from 'react-native-vector-icons/Entypo';
import { FormLabel, FormInput, Form, FormValidationMessage } from 'react-native-elements';


export default class AddForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      username: '',
      password: '',
      role: this.props.navigation.state.params.role
    }
    this.addUser = this.addUser.bind(this);
  }

  static navigationOptions = {
    title: 'Add User Form'
  }

  addUser() {
    console.log('in addUser')
    let socket = this.props.navigation.state.params.socket;
    console.log('socket:', socket)
    if (this.state.name === '' || this.state.username === '' || this.state.password === '') {
      Alert.alert('Uh Oh!', 'ALL fields must be populated!');
      return;
    }
    let newUser = {
      name: this.state.name,
      username: this.state.username,
      role: this.state.role,
      password: this.state.password
    };
    socket.emit('add user', newUser);
    socket.on('successfully added user!', () => {
      Alert.alert('Success!', 'User has been added!')
    });
    socket.on('user already exists!', () => {
      Alert.alert('Error!', 'Username is already in use. Please try another!')
    })
  }

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.touch}>
          <Text style={styles.text}>Name</Text>
          <TextInput onChangeText={text => this.setState({name: text})}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touch}>
          <Text style={styles.text}>Username</Text>
          <TextInput onChangeText={text => this.setState({username: text})}/>
        </TouchableOpacity>
        <TouchableOpacity style={styles.touch}>
          <Text style={styles.text}

          >Password</Text>
          <TextInput secureTextEntry={true} onChangeText={text => this.setState({password: text})}/>
        </TouchableOpacity>
        <TouchableOpacity onPress={this.addUser} style={styles.touch}>
          <Text style={styles.text}>Add!</Text>
        </TouchableOpacity>
      </View>
    )
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
    paddingTop: 40
  },
  touch: {
    marginTop: 10,
    marginBottom: 10
  },
  text: {
    fontWeight: 'bold',
    fontSize: 20
  }
})
