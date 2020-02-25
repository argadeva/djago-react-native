import React, {Component} from 'react';
import {Footer, FooterTab, Icon, Button} from 'native-base';

export class BottomNav extends Component {
  render() {
    return (
      <Footer>
        <FooterTab>
          {this.props.home ? (
            <Button active>
              <Icon name="ios-wallet" />
            </Button>
          ) : (
            <Button
              onPress={() => this.props.menu.navigation.replace('Cashier')}>
              <Icon name="ios-wallet" />
            </Button>
          )}
          {this.props.products ? (
            <Button active>
              <Icon name="ios-cube" />
            </Button>
          ) : (
            <Button
              onPress={() => this.props.menu.navigation.replace('Products')}>
              <Icon name="ios-cube" />
            </Button>
          )}
          {this.props.categories ? (
            <Button active>
              <Icon name="ios-apps" />
            </Button>
          ) : (
            <Button
              onPress={() => this.props.menu.navigation.replace('Categories')}>
              <Icon name="ios-apps" />
            </Button>
          )}
          {this.props.history ? (
            <Button active>
              <Icon name="ios-paper" />
            </Button>
          ) : (
            <Button
              onPress={() => this.props.menu.navigation.replace('History')}>
              <Icon name="ios-paper" />
            </Button>
          )}
          {this.props.users ? (
            <Button active>
              <Icon name="ios-contacts" />
            </Button>
          ) : (
            <Button onPress={() => this.props.menu.navigation.replace('Users')}>
              <Icon name="ios-contacts" />
            </Button>
          )}
        </FooterTab>
      </Footer>
    );
  }
}

export default BottomNav;
