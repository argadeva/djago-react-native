import React, {Component} from 'react';
import {
  Container,
  Content,
  Card,
  CardItem,
  Body,
  Text,
  Icon,
  Right,
  Spinner,
  Header,
  Left,
  Button,
  Title,
  Form,
  Item,
  Label,
  Input,
} from 'native-base';
import {connect} from 'react-redux';
import {
  getCategories,
  addCategories,
  editCategories,
  deleteCategories,
} from '../redux/actions/categories';
import {Modal, Alert} from 'react-native';
import BottomNav from '../components/BottomNav';
import AsyncStorage from '@react-native-community/async-storage';

export class Categories extends Component {
  state = {
    categoriesData: [],
    editData: {
      id: null,
      name: '',
    },
    modal: false,
    userToken: '',
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

  getCategories = async () => {
    await this.props.dispatch(getCategories(this.state.userToken));
    this.setState({
      categoriesData: this.props.categories.categoriesData.result,
    });
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
    this.props.dispatch(deleteCategories(id, this.state.userToken)).then(() => {
      const index = this.state.categoriesData.findIndex(function(onData) {
        return onData.id === id;
      });
      let array = [...this.state.categoriesData];
      array.splice(index, 1);
      this.setState({categoriesData: array});
    });
  };

  handleUpdate = data => {
    this.setState({
      editData: {
        id: data.id,
        name: data.name,
      },
      modal: true,
    });
  };

  componentDidMount() {
    this.getToken();
    setTimeout(() => {
      this.getCategories();
    }, 1000);
  }

  handleFormChange = (name, value) => {
    const editDatas = this.state.editData;
    editDatas[name] = value;
    this.setState({
      editDatas,
    });
  };

  handleAdd = () => {
    this.setState({
      editData: {
        id: null,
        name: '',
      },
      modal: true,
    });
  };

  setModal = visible => {
    this.setState({
      modal: visible,
    });
  };

  handleSubmit = () => {
    if (this.state.editData.id !== null) {
      this.props
        .dispatch(editCategories(this.state.editData, this.state.userToken))
        .then(() => {
          let id = this.state.editData.id;
          const index = this.state.categoriesData.findIndex(function(onData) {
            return onData.id === id;
          });
          let datas = [...this.state.categoriesData];
          let data = {...datas[index]};
          data.name = this.state.editData.name;
          datas[index] = data;
          this.setState({categoriesData: datas, modal: false});
        });
    } else {
      this.props
        .dispatch(addCategories(this.state.editData.name, this.state.userToken))
        .then(() => {
          let newData = {
            id: this.props.categories.addIdData,
            name: this.state.editData.name,
          };
          this.setState({
            categoriesData: this.state.categoriesData.concat(newData),
            modal: false,
          });
        });
    }
  };

  render() {
    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name="ios-apps" />
            </Button>
          </Left>
          <Body>
            <Title>Categories</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.handleAdd()}>
              <Icon name="add" />
            </Button>
          </Right>
        </Header>
        <Content padder>
          {!this.props.categories.isPending ? (
            <>
              {this.state.categoriesData.map(categories => {
                return (
                  <Card key={categories.id}>
                    <CardItem header bordered>
                      <Text>{categories.name}</Text>
                    </CardItem>
                    <CardItem footer bordered>
                      <Left>
                        <Button
                          transparent
                          onPress={() => this.handleUpdate(categories)}>
                          <Icon style={{color: 'orange'}} name="ios-create" />
                          <Text style={{color: 'orange'}}>Update</Text>
                        </Button>
                      </Left>
                      <Right>
                        <Button
                          transparent
                          onPress={() => this.alertDelete(categories.id)}>
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
                          ? 'Add Categories'
                          : 'Update Categories'}
                      </Text>
                    </CardItem>
                    <Form style={{marginHorizontal: 10}}>
                      <Item stackedLabel>
                        <Label>Name</Label>
                        <Input
                          defaultValue={this.state.editData.name}
                          onChangeText={txt =>
                            this.handleFormChange('name', txt)
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
        <BottomNav menu={this.props} categories={true} />
      </Container>
    );
  }
}

const mapStateToProps = ({categories}) => {
  return {
    categories,
  };
};

export default connect(mapStateToProps)(Categories);
