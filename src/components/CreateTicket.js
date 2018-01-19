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
import TicketLine from './TicketLine.js';

const classMenu = ['110/120', '125', '130','190/200', '222', '241/251', '242/252', '270'];
const locations = ['computers', 'table 1', 'table 2', 'table 3', 'table 4', 'table 5'];

export default class CreateTicket extends Component {
  constructor(props) {
    super(props);
    this.state = {
      modalVisible: false,
      createdBy: '',
      class: classMenu[0],
      location: locations[0],
      description: '',
      formValidate: null,
      firstName: '',
      lastInit:'',
      tickets: [],
    }
    this.submitTicket = this.submitTicket.bind(this);
  }

  static navigationOptions = {
    title: 'Create a ticket'
  }

  loadClassPickerItems() {
    return classMenu.map((course, ind) => (
      <Picker.Item label={course} value={course} key={ind}/>
    ))
  }

  loadLocationItems() {
    return locations.map((place, ind) => (
      <Picker.Item label={place} value={place} key={ind} />
    ))
  }

  createName() {
    let name = this.state.firstName + ' ' + this.state.lastInit;
    this.setState({createdBy: name });
  }

  submitTicket() {
    const { goBack } = this.props.navigation;
    if (this.state.firstName === '' || this.state.lastInit === '') {
      Alert.alert('ERROR!', 'Your name is required');
      this.setState({formValidate: <FormValidationMessage>{'required'}</FormValidationMessage>});
      return;
    } else {
      let createdBy = this.state.firstName + ' ' + this.state.lastInit;
      let socket = this.props.navigation.state.params.socket;
      let ticket = {
        createdBy: createdBy,
        class: this.state.class,
        location: this.state.location,
        description: this.state.description
      }
      socket.emit('submitting ticket', ticket);
      socket.on('ticket submitted!', () => {
        Alert.alert('Success!', 'Your ticket has been submitted. A tutor will be right with you!');
        let update = this.props.navigation.state.params.updateTickets;
        if (typeof update === 'function') {
          update();
        }
        goBack();
      })
      socket.on('duplicate ticket', () => {
        Alert.alert('Uh Oh!', 'Looks like you have already submitted a ticket. If this is a mistake, please see a tutor!');
      })
    }
  }

  render() {
    const formValidate = null;
    return (
      <View>
        <FormLabel>First Name</FormLabel>
        <FormInput
          onChangeText={text => this.setState({firstName: text})}
        />
        {this.state.formValidate}
        <FormLabel>Last Initial</FormLabel>
        <FormInput
          onChangeText={text => this.setState({lastInit: text})}
          maxLength={1}
          style={styles.last}
        />
        {this.state.formValidate}
        <FormLabel>Choose your class</FormLabel>
        <Picker
          textStyle={{fontSize:12}}
          itemStyle={{height:80}}
          mode="dropdown"
          style={styles.picker}
          selectedValue={this.state.class}
          onValueChange={(value) => this.setState({class: value})}>
          {this.loadClassPickerItems()}
        </Picker>
        <FormLabel>Location</FormLabel>
          <Picker
          textStyle={{fontSize:12}}
          itemStyle={{height:80}}
          mode="dropdown"
          style={styles.picker}
          selectedValue={this.state.location}
          onValueChange={(value) => this.setState({location: value})}>
          {this.loadLocationItems()}
        </Picker>
        <FormLabel>Description (optional):</FormLabel>
        <FormInput
            multiline= {false}
            numberOfLines={1}
            maxLength={50}
            onChangeText={(text) => this.setState({description: text})}
              />
        <TouchableOpacity style={styles.submit} onPress={this.submitTicket}>
          <Text style={styles.text}>Submit Ticket</Text>
        </TouchableOpacity>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  picker: {
    marginTop: 0,
    paddingTop: 0,
    height: 100
  },
  submit: {
    alignSelf: 'center',
    marginTop: 40,
  },
  text: {
    color: 'blue',
    borderWidth: 1,
    borderRadius: 8,
    paddingTop: 5,
    paddingLeft: 5,
    paddingRight: 5,
    paddingBottom: 5,
  },
  first: {
    width: 30
  },
  name: {

  },
  last: {
  }

})







/*
  <Picker.Item label='120 & below' value='120 & below'/>
          <Picker.Item label='130' value='130'/>
          <Picker.Item label='190/200' value='190/200'/>
          <Picker.Item label='222' value='222'/>
          <Picker.Item label='251' value='251'/>
          <Picker.Item label='252' value='252'/>
          <Picker.Item label='270' value='270'/>
*/