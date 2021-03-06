import React, {Component} from 'react';
import {
  Container,
  Header,
  Content,
  Left,
  Body,
  Right,
  Title,
  Icon,
  Button,
  Text,
  Form,
  Label,
  Input,
  Item,
  Card,
  CardItem,
  Spinner,
} from 'native-base';
import AsyncStorage from '@react-native-community/async-storage';
import Axios from 'axios';
import BottomNav from '../components/BottomNav';
import {connect} from 'react-redux';
import {
  getUsers,
  addUsers,
  editUsers,
  deleteUsers,
} from '../redux/actions/users';
import {Modal, Alert} from 'react-native';

export class Users extends Component {
  state = {
    modal: false,
    userToken: '',
    userData: [],
    isPending: true,
    editData: {
      id: null,
      name: '',
      email: '',
      password: '',
    },
  };

  componentDidMount() {
    this.getToken();
    setTimeout(() => {
      this.getUsers();
    }, 1000);
  }

  getUsers = async () => {
    await this.props.dispatch(getUsers(this.state.userToken));
    this.setState({
      userData: this.props.user.userData.result,
      isPending: false,
    });
  };

  removeToken = async () => {
    try {
      await AsyncStorage.removeItem('usertoken');
      await this.props.navigation.replace('Splash');
    } catch (e) {
      e;
    }
  };

  getToken = async () => {
    try {
      const value = await AsyncStorage.getItem('usertoken');
      if (value !== null) {
        this.setState({
          userToken: value,
        });
      }
    } catch (e) {
      e;
    }
  };

  alertDelete = id => {
    Alert.alert(
      'Warning!',
      'Are you sure you delete this?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.handleRemove(id)},
      ],
      {cancelable: false},
    );
  };

  handleRemove = id => {
    this.props
      .dispatch(deleteUsers(id, this.state.userToken))
      .then(() => {
        const index = this.state.userData.findIndex(function(onData) {
          return onData.id === id;
        });
        let array = [...this.state.userData];
        array.splice(index, 1);
        this.setState({userData: array});
      })
      .then(() => {
        Alert.alert(
          'Succes!',
          'Delete data success!',
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

  handleFormChange = (key, value) => {
    const editDatas = this.state.editData;
    editDatas[key] = value;
    this.setState({
      editDatas,
    });
  };

  handleAdd = () => {
    this.setState({
      editData: {
        id: null,
      },
      modal: true,
    });
  };

  handleUpdate = data => {
    this.setState({
      editData: {
        id: data.id,
        name: data.name,
        email: data.email,
        password: '',
      },
      modal: true,
    });
  };

  alertLogout = () => {
    Alert.alert(
      'Warning!',
      'Are you sure to Logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {text: 'OK', onPress: () => this.logOut()},
      ],
      {cancelable: false},
    );
  };

  logOut = () => {
    Axios.post(
      `http://18.206.61.46:3000/api/v1/users/logout`,
      {token: this.state.userToken},
      {
        headers: {'x-access-token': this.state.userToken},
      },
    )
      .then(res => {
        this.removeToken();
      })
      .catch(err => {});
  };

  handleSubmit = () => {
    const formValidationName = data => {
      // eslint-disable-next-line
      let Regex = /^[a-zA-Z][a-zA-Z ]*$/;
      return Regex.test(data);
    };

    const formValidationEmail = data => {
      // eslint-disable-next-line
      let Regex = /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/;
      return Regex.test(data);
    };

    const formValidationPass = data => {
      // eslint-disable-next-line
      let Regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
      return Regex.test(data);
    };

    if (!formValidationName(this.state.editData.name)) {
      Alert.alert(
        'Error!',
        'Name must be only word and space!',
        [
          {
            text: 'Close',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    } else if (!formValidationEmail(this.state.editData.email)) {
      Alert.alert(
        'Error!',
        'Email not valid!',
        [
          {
            text: 'Close',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    } else if (!formValidationPass(this.state.editData.password)) {
      Alert.alert(
        'Error!',
        'Password Minimum 8 characters, at least 1 letter and 1 number!',
        [
          {
            text: 'Close',
            style: 'cancel',
          },
        ],
        {cancelable: false},
      );
    } else {
      if (this.state.editData.id !== null) {
        this.props
          .dispatch(editUsers(this.state.editData, this.state.userToken))
          .then(() => {
            let id = this.state.editData.id;
            const index = this.state.userData.findIndex(function(onData) {
              return onData.id === id;
            });
            let datas = [...this.state.userData];
            let data = {...datas[index]};
            data.name = this.state.editData.name;
            data.email = this.state.editData.email;
            datas[index] = data;
            this.setState({userData: datas, modal: false});
          })
          .then(() => {
            Alert.alert(
              'Succes!',
              'Edit data success!',
              [
                {
                  text: 'Close',
                  style: 'cancel',
                },
              ],
              {cancelable: false},
            );
          });
      } else {
        this.props
          .dispatch(addUsers(this.state.editData, this.state.userToken))
          .then(() => {
            let newData = {
              id: this.props.user.addIdData,
              name: this.state.editData.name,
              email: this.state.editData.email,
            };
            this.setState({
              userData: this.state.userData.concat(newData),
              modal: false,
            });
          })
          .then(() => {
            Alert.alert(
              'Succes!',
              'Add data success!',
              [
                {
                  text: 'Close',
                  style: 'cancel',
                },
              ],
              {cancelable: false},
            );
          });
      }
    }
  };

  render() {
    return (
      <Container>
        <Header
          style={{backgroundColor: '#C02739'}}
          iosBarStyle="light-content"
          androidStatusBarColor="#84142D">
          <Left>
            <Button transparent>
              <Icon name="ios-contacts" />
            </Button>
          </Left>
          <Body>
            <Title>Users</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.alertLogout()}>
              <Icon name="ios-log-out" />
            </Button>
          </Right>
        </Header>
        <Content padder>
          {!this.state.isPending ? (
            <>
              <Button
                success
                style={{marginBottom: 10}}
                onPress={() => this.handleAdd()}>
                <Text>ADD</Text>
                <Icon name="add" />
              </Button>
              {this.state.userData.map(users => {
                return (
                  <Card key={users.id}>
                    <CardItem header bordered>
                      <Text>{users.name}</Text>
                    </CardItem>
                    <CardItem bordered>
                      <Body>
                        <Text>{users.email}</Text>
                      </Body>
                    </CardItem>
                    <CardItem footer bordered>
                      <Left>
                        <Button
                          transparent
                          onPress={() => this.handleUpdate(users)}>
                          <Icon style={{color: 'orange'}} name="ios-create" />
                          <Text style={{color: 'orange'}}>Update</Text>
                        </Button>
                      </Left>
                      <Right>
                        <Button
                          transparent
                          onPress={() => this.alertDelete(users.id)}>
                          <Icon style={{color: 'red'}} name="ios-trash" />
                          <Text style={{color: 'red'}}>Trash</Text>
                        </Button>
                      </Right>
                    </CardItem>
                  </Card>
                );
              })}
              <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.modal}>
                <Button
                  transparent
                  onPress={() => this.setState({modal: false})}>
                  <Icon name="close" />
                </Button>
                <Content padder>
                  <Card>
                    <CardItem header>
                      <Text>
                        {this.state.editData.id === null
                          ? 'Add User'
                          : 'Update User'}
                      </Text>
                    </CardItem>
                    <Form style={{marginHorizontal: 10}}>
                      <Item stackedLabel>
                        <Label>Name</Label>
                        <Input
                          defaultValue={this.state.editData.name}
                          onChangeText={name =>
                            this.handleFormChange('name', name)
                          }
                        />
                      </Item>
                      <Item stackedLabel>
                        <Label>Email</Label>
                        <Input
                          autoCapitalize="none"
                          autoCompleteType="email"
                          defaultValue={this.state.editData.email}
                          onChangeText={email =>
                            this.handleFormChange('email', email)
                          }
                        />
                      </Item>
                      <Item stackedLabel last>
                        <Label>Password</Label>
                        <Input
                          autoCapitalize="none"
                          autoCompleteType="password"
                          secureTextEntry={true}
                          defaultValue={this.state.editData.password}
                          onChangeText={password =>
                            this.handleFormChange('password', password)
                          }
                        />
                      </Item>
                    </Form>
                    <CardItem footer>
                      <Left />
                      <Right>
                        <Button success onPress={() => this.handleSubmit()}>
                          <Text>
                            {this.state.editData.id === null ? 'Add' : 'Update'}
                          </Text>
                        </Button>
                      </Right>
                    </CardItem>
                  </Card>
                </Content>
              </Modal>
            </>
          ) : (
            <Spinner color="blue" style={{height: 500}} />
          )}
        </Content>
        <BottomNav menu={this.props} users={true} />
      </Container>
    );
  }
}

const mapStateToProps = ({user}) => {
  return {
    user,
  };
};

export default connect(mapStateToProps)(Users);
