import React, {Component} from 'react';
import {Footer, FooterTab, Icon, Button} from 'native-base';

export class BottomNav extends Component {
  render() {
    return (
      <Footer>
        <FooterTab style={{backgroundColor: '#84142D'}}>
          {this.props.home ? (
            <Button active style={{backgroundColor: '#C02739'}}>
              <Icon name="ios-wallet" />
            </Button>
          ) : (
            <Button
              onPress={() => this.props.menu.navigation.replace('Cashier')}>
              <Icon name="ios-wallet" style={{color: '#fff'}} />
            </Button>
          )}
          {this.props.products ? (
            <Button active style={{backgroundColor: '#C02739'}}>
              <Icon name="ios-cube" />
            </Button>
          ) : (
            <Button
              onPress={() => this.props.menu.navigation.replace('Products')}>
              <Icon name="ios-cube" style={{color: '#fff'}} />
            </Button>
          )}
          {this.props.categories ? (
            <Button active style={{backgroundColor: '#C02739'}}>
              <Icon name="ios-apps" />
            </Button>
          ) : (
            <Button
              onPress={() => this.props.menu.navigation.replace('Categories')}>
              <Icon name="ios-apps" style={{color: '#fff'}} />
            </Button>
          )}
          {this.props.history ? (
            <Button active style={{backgroundColor: '#C02739'}}>
              <Icon name="ios-paper" />
            </Button>
          ) : (
            <Button
              onPress={() => this.props.menu.navigation.replace('History')}>
              <Icon name="ios-paper" style={{color: '#fff'}} />
            </Button>
          )}
          {this.props.users ? (
            <Button active style={{backgroundColor: '#C02739'}}>
              <Icon name="ios-contacts" />
            </Button>
          ) : (
            <Button onPress={() => this.props.menu.navigation.replace('Users')}>
              <Icon name="ios-contacts" style={{color: '#fff'}} />
            </Button>
          )}
        </FooterTab>
      </Footer>
    );
  }
}

export default BottomNav;
