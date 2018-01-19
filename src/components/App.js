/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Entypo';
import { StackNavigator } from 'react-navigation';
import Home from './Home.js';
import Login from './Login.js';
import TicketLine from './TicketLine.js';
import CreateTicket from './CreateTicket.js';
import Admin from './Admin.js';
import AddForm from './AddForm.js';

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

const App = StackNavigator({
  Home: {screen: Home},
  Login: {screen: Login},
  TicketLine: {screen: TicketLine},
  CreateTicket: {screen: CreateTicket},
  Admin: {screen: Admin},
  AddForm: {screen: AddForm}
});

export default App;

// export default class App extends Component<{}> {
//   constructor(props) {
//     super(props);
//   }


//   render() {
//     return (
//       <View style={styles.container}>
//         <Home/>
//       </View>
//     );
//   }
// }



const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
