import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {Provider} from 'react-redux';
import store from './src/redux/store';

import Splash from './src/screens/Splash';
import SignIn from './src/screens/SignIn';
import Cashier from './src/screens/Home';
import Users from './src/screens/Users';
import Categories from './src/screens/Categories';
import Products from './src/screens/Products';
import History from './src/screens/History';

export class App extends Component {
  render() {
    const Stack = createStackNavigator();

    return (
      <Provider store={store}>
        <NavigationContainer>
          <Stack.Navigator
            initialRouteName="Splash"
            screenOptions={{
              headerShown: false,
            }}>
            <Stack.Screen name="Splash" component={Splash} />
            <Stack.Screen name="SignIn" component={SignIn} />
            <Stack.Screen name="Cashier" component={Cashier} />
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
