import React, {Component} from 'react';
import {Container, Content, Thumbnail} from 'native-base';
import {StatusBar} from 'react-native';
import Logo from '../assets/logo.png';

import AsyncStorage from '@react-native-community/async-storage';

class Splash extends Component {
  state = {
    userToken: false,
  };

  getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('usertoken');
      if (value === null) {
        this.props.navigation.replace('SignIn');
      } else {
        this.props.navigation.replace('Cashier');
      }
    } catch (e) {
      e;
    }
  };

  componentDidMount() {
    setTimeout(() => {
      this.getToken();
    }, 1000);
  }

  render() {
    return (
      <Container>
        <StatusBar hidden />
        <Content style={{backgroundColor: '#84142D'}}>
          <Thumbnail
            source={Logo}
            style={{
              alignSelf: 'center',
              marginTop: '50%',
              height: 200,
              width: 200,
            }}
          />
        </Content>
      </Container>
    );
  }
}

export default Splash;
