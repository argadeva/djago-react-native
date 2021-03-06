import React, {Component} from 'react';
import {
  Container,
  Content,
  Form,
  Item,
  Input,
  Label,
  Button,
  Text,
  Card,
  Icon,
  Thumbnail,
} from 'native-base';
import {Alert} from 'react-native';
import Axios from 'axios';
import {StatusBar} from 'react-native';
import Logo from '../assets/logo.png';

import AsyncStorage from '@react-native-community/async-storage';

class SignIn extends Component {
  state = {
    email: '',
    password: '',
  };

  login = () => {
    Axios.post(`http://18.206.61.46:3000/api/v1/users/login`, {
      email: this.state.email,
      password: this.state.password,
    })
      .then(res => {
        const sendToken = async () => {
          try {
            await AsyncStorage.setItem('usertoken', res.data.token);
            await this.props.navigation.replace('Cashier');
          } catch (e) {
            e;
          }
        };
        sendToken();
      })
      .catch(err => {
        Alert.alert(
          'Failed!',
          'Email or password not match!',
          [
            {
              text: 'Close',
              style: 'cancel',
            },
          ],
          {cancelable: false},
        );
      });
  };

  render() {
    return (
      <Container>
        <StatusBar hidden />
        <Content style={{backgroundColor: '#84142D'}}>
          <Thumbnail
            source={Logo}
            style={{
              alignSelf: 'center',
              marginTop: 50,
              height: 100,
              width: 100,
            }}
          />
          <Text
            style={{
              marginTop: 10,
              alignSelf: 'center',
              color: 'white',
              fontWeight: 'bold',
              fontSize: 25,
            }}>
            D'Jago Cafe App
          </Text>
          <Card
            style={{
              marginTop: 20,
              marginLeft: 20,
              marginRight: 20,
            }}>
            <Form>
              <Item stackedLabel>
                <Label>Email</Label>
                <Input
                  autoCapitalize="none"
                  autoCompleteType="email"
                  onChangeText={email => this.setState({email: email})}
                />
              </Item>
              <Item stackedLabel last>
                <Label>Password</Label>
                <Input
                  autoCapitalize="none"
                  autoCompleteType="password"
                  secureTextEntry={true}
                  onChangeText={password => this.setState({password: password})}
                />
              </Item>
            </Form>
            <Button
              onPress={() => this.login()}
              style={{
                marginTop: 20,
                borderRadius: 0,
                backgroundColor: '#C02739',
              }}>
              <Text>Sign In</Text>
              <Icon name="ios-log-in" />
            </Button>
          </Card>
          <Text
            style={{
              marginTop: 10,
              alignSelf: 'center',
              color: 'white',
              fontSize: 12,
            }}>
            If you need account please call IT Division.
          </Text>
        </Content>
      </Container>
    );
  }
}

export default SignIn;
