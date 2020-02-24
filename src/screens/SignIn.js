import React, {Component} from 'react';
import {Text, View, Button} from 'react-native';

export class SignIn extends Component {
  render() {
    return (
      <View>
        <Text>Sign In Screen</Text>
        <Button
          title="Sign In"
          // onPress={() => this.props.navigate.push('Home')}
        />
      </View>
    );
  }
}

export default SignIn;
