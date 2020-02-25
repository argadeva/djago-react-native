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
} from 'native-base';
import Axios from 'axios';

import AsyncStorage from '@react-native-community/async-storage';

export class SignIn extends Component {
  state = {
    email: '',
    password: '',
    userToken: false,
  };

  login = () => {
    Axios.post(`http://54.173.43.255:1000/api/v1/users/login`, {
      email: this.state.email,
      password: this.state.password,
    })
      .then(res => {
        const sendToken = async () => {
          try {
            await AsyncStorage.setItem('usertoken', res.data.token);
          } catch (e) {}
        };
        sendToken();
        this.setState({userToken: true});
      })
      .catch(err => {});
  };

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

  componentDidMount() {
    this.getData();
  }

  render() {
    if (this.state.userToken) {
      this.props.navigation.replace('Cashier');
    }

    return (
      <Container>
        <Content>
          <Form>
            <Item floatingLabel>
              <Label>Username</Label>
              <Input onChangeText={email => this.setState({email: email})} />
            </Item>
            <Item floatingLabel last>
              <Label>Password</Label>
              <Input
                onChangeText={password => this.setState({password: password})}
              />
            </Item>
            <Button onPress={() => this.login()}>
              <Text>Click Me!</Text>
            </Button>
          </Form>
        </Content>
      </Container>
    );
  }
}

export default SignIn;
