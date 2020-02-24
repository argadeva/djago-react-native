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

export class Categories extends Component {
  state = {
    categoriesData: [],
    editData: {
      id: null,
      name: '',
    },
    modal: false,
  };

  getCategories = async () => {
    await this.props.dispatch(getCategories());
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
    this.props.dispatch(deleteCategories(id)).then(() => {
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
    this.getCategories();
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
      console.log('EDIT');
      console.log('EDIT' + this.state.editData.id);
      this.props.dispatch(editCategories(this.state.editData)).then(() => {
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
      this.props.dispatch(addCategories(this.state.editData.name)).then(() => {
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
              <Icon name="grid" />
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
        {!this.props.categories.isPending ? (
          <Content style={{padding: 10}}>
            {this.state.categoriesData.map(categories => {
              return (
                <Card key={categories.id}>
                  <CardItem>
                    <Left>
                      <Icon
                        name="create"
                        style={{color: 'green'}}
                        onPress={() => this.handleUpdate(categories)}
                      />
                    </Left>
                    <Body>
                      <Text>{categories.name}</Text>
                    </Body>
                    <Right>
                      <Icon
                        name="trash"
                        style={{color: 'red'}}
                        onPress={() => this.alertDelete(categories.id)}
                      />
                    </Right>
                  </CardItem>
                </Card>
              );
            })}
            <Modal
              animationType="slide"
              transparent={false}
              visible={this.state.modal}>
              <Button transparent onPress={() => this.setModal(false)}>
                <Icon name="close" />
              </Button>
              <Content style={{padding: 20}}>
                <Form>
                  <Item stackedLabel>
                    <Label>Name</Label>
                    <Input
                      defaultValue={this.state.editData.name}
                      onChangeText={txt => this.handleFormChange('name', txt)}
                    />
                  </Item>
                  <Button
                    style={{marginTop: 30}}
                    onPress={() => this.handleSubmit()}>
                    <Text>
                      {this.state.editData.id === null ? 'Add' : 'Update'}
                    </Text>
                  </Button>
                </Form>
              </Content>
            </Modal>
          </Content>
        ) : (
          <Spinner color="blue" />
        )}
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
