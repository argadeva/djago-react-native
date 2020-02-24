import React, {Component} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {Image} from 'react-native';
import {Provider} from 'react-redux';
import store from './src/redux/store';

import Splash from './src/screens/Splash';
import SignIn from './src/screens/SignIn';
import Home from './src/screens/Home';
import Users from './src/screens/Users';
import Categories from './src/screens/Categories';
import Products from './src/screens/Products';

export class App extends Component {
  state = {
    isLoading: false,
    userToken: true,
  };

  componentDidMount() {
    // setTimeout(() => {
    //   this.setState({isLoading: false});
    // }, 1000);
  }

  render() {
    if (this.state.isLoading) {
      return <Splash />;
    }

    const AuthStack = createStackNavigator();
    const HomeStack = createStackNavigator();
    const UsersStack = createStackNavigator();
    const Tabs = createBottomTabNavigator();

    const HomeStackScreen = () => (
      <HomeStack.Navigator>
        <HomeStack.Screen name="Cashier" component={Home} />
      </HomeStack.Navigator>
    );

    const UsersStackScreen = () => (
      <UsersStack.Navigator>
        <UsersStack.Screen name="Users" component={Users} />
      </UsersStack.Navigator>
    );

    const TabsStackScreen = () => (
      <Tabs.Navigator
        initialRouteName="Products"
        tabBarOptions={{
          activeTintColor: '#e91e63',
        }}>
        <Tabs.Screen name="Cashier" component={HomeStackScreen} />
        <Tabs.Screen name="Products" component={Products} />
        <Tabs.Screen name="Categories" component={Categories} />
        <Tabs.Screen name="History" component={UsersStackScreen} />
        <Tabs.Screen name="Users" component={UsersStackScreen} />
      </Tabs.Navigator>
    );

    return (
      <Provider store={store}>
        <NavigationContainer>
          {this.state.userToken ? (
            <TabsStackScreen />
          ) : (
            <AuthStack.Navigator>
              <AuthStack.Screen
                name="SignIn"
                component={SignIn}
                options={{title: 'Sign In'}}
              />
            </AuthStack.Navigator>
          )}
        </NavigationContainer>
      </Provider>
    );
  }
}

export default App;
