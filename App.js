import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import store from './src/redux/store';

import Splash from './src/screens/Splash';
import SignIn from './src/screens/SignIn';
import Home from './src/screens/Home';
import Users from './src/screens/Users';
import Categories from './src/screens/Categories';
import Products from './src/screens/Products';
import History from './src/screens/History';

import AsyncStorage from '@react-native-community/async-storage';

export class App extends Component {
  state = {
    isLoading: false,
    userToken: false,
  };

  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({isLoading: false});
    // }, 1000);
    this.getData();
  }

  getData = async () => {
    try {
      const value = await AsyncStorage.getItem('usertoken');
      if (value !== null) {
        this.setState({
          userToken: true,
        });
      }
    } catch (e) {
      e;
    }
  };

  render() {
    if (this.state.isLoading) {
      return <Splash />;
    }

    const Stack = createStackNavigator();

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Products"
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="Cashier" component={Home} />
            <Stack.Screen name="Products" component={Products} />
            <Stack.Screen name="Categories" component={Categories} />
            <Stack.Screen name="History" component={History} />
            <Stack.Screen name="Users" component={Users} />
          </Stack.Navigator>
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
