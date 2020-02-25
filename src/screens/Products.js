import React, {Component} from 'react';
import {
  Container,
  Header,
  Left,
  Body,
  Right,
  Content,
  Button,
  Icon,
  Title,
  Text,
  List,
  ListItem,
  Thumbnail,
  Spinner,
  Form,
  Item,
  Label,
  Input,
  Card,
  CardItem,
  Picker,
} from 'native-base';
import {connect} from 'react-redux';
import {
  getProducts,
  addProducts,
  editProducts,
  deleteProducts,
} from '../redux/actions/products';
import {getCategories} from '../redux/actions/categories';
import {Modal, Alert, Image} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import BottomNav from '../components/BottomNav';
import ImagePicker from 'react-native-image-picker';

export class Products extends Component {
  state = {
    userToken: '',
    productData: [],
    totalPage: '',
    empty: '',
    editData: {
      id: null,
      name: '',
      image: '',
      price: 0,
      category_id: null,
      stock: 0,
      description: '',
      categories: '',
    },
    image: false,
    categoriesData: [],
    sort: 'created_at',
    modal: false,
    formModal: false,
    avatarSource: null,
  };

  getProducts = async () => {
    await this.props.dispatch(getProducts(this.state.userToken));
    this.setState({
      productData: this.props.products.productData.result,
    });
  };

  getCategories = async () => {
    await this.props.dispatch(getCategories(this.state.userToken));
    this.setState({
      categoriesData: this.props.categories.categoriesData.result,
    });
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

  componentDidMount() {
    this.getToken();
    setTimeout(() => {
      this.getProducts();
      this.getCategories();
    }, 1000);
  }

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
    this.props.dispatch(deleteProducts(id, this.state.userToken)).then(() => {
      const index = this.state.productData.findIndex(function(onData) {
        return onData.id === id;
      });
      let array = [...this.state.productData];
      array.splice(index, 1);
      this.setState({productData: array});
    });
  };

  handleUpdate = data => {
    this.setState({
      avatarSource: null,
      modal: true,
      image: false,
      editData: {
        id: data.id,
        name: data.name,
        image: data.image,
        price: data.price,
        category_id: data.category_id,
        stock: data.stock,
        description: data.description,
        categories: data.categories,
      },
    });
  };

  handleAdd = () => {
    this.setState({
      avatarSource: null,
      formModal: true,
      image: false,
      editData: {
        id: null,
        name: '',
        image: '',
        price: 0,
        category_id: null,
        stock: 0,
        description: '',
        categories: '',
      },
    });
  };

  handleFormChange = (key, value) => {
    const editDatas = this.state.editData;
    editDatas[key] = value;
    this.setState({
      editDatas,
    });
  };

  handleChoosePhoto = () => {
    const options = {
      title: 'Select Avatar',
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    ImagePicker.showImagePicker(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else if (response.customButton) {
        console.log('User tapped custom button: ', response.customButton);
      } else {
        this.setState({
          avatarSource: response,
        });
      }
    });
  };

  handleSubmit = async () => {
    if (this.state.editData.id !== null) {
      this.props
        .dispatch(
          editProducts(
            this.state.editData,
            this.state.userToken,
            this.state.avatarSource,
          ),
        )
        .then(() => {
          let id = this.state.editData.id;
          const index = this.state.productData.findIndex(function(onData) {
            return onData.id === id;
          });
          let catId = parseInt(this.state.editData.category_id);
          let index2 = this.state.categoriesData.findIndex(x => x.id === catId);
          let datas = [...this.state.productData];
          let data = {...datas[index]};
          data.name = this.state.editData.name;
          data.image =
            this.state.avatarSource.fileName === undefined
              ? this.state.editData.image
              : 'http://54.173.43.255:1000/uploads/' +
                'file-' +
                this.state.avatarSource.fileName;
          data.price = this.state.editData.price;
          data.category_id = this.state.editData.category_id;
          data.categories = this.state.categoriesData[index2].name;
          data.stock = this.state.editData.stock;
          data.description = this.state.editData.description;
          datas[index] = data;
          this.setState({productData: datas});
        });
    } else {
      this.props
        .dispatch(
          addProducts(
            this.state.editData,
            this.state.userToken,
            this.state.avatarSource,
          ),
        )
        .then(() => {
          let catId = parseInt(this.state.editData.category_id);
          let index = this.state.categoriesData.findIndex(x => x.id === catId);
          let newData = {
            id: this.props.products.addIdData,
            name: this.state.editData.name,
            price: this.state.editData.price,
            image:
              this.state.avatarSource.fileName === undefined
                ? ''
                : 'http://54.173.43.255:1000/uploads/' +
                  'file-' +
                  this.state.avatarSource.fileName,
            categories: this.state.categoriesData[index].name,
            stock: this.state.editData.stock,
            description: this.state.editData.description,
          };

          this.setState({
            productData: this.state.productData.concat(newData),
          });
        });
    }
  };

  render() {
    function formatNumber(num) {
      return 'Rp. ' + num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    }

    return (
      <Container>
        <Header>
          <Left>
            <Button transparent>
              <Icon name="cube" />
            </Button>
          </Left>
          <Body>
            <Title>Products</Title>
          </Body>
          <Right>
            <Button transparent onPress={() => this.handleAdd()}>
              <Icon name="add" />
            </Button>
          </Right>
        </Header>
        <Content style={{paddingHorizontal: 0}}>
          {!this.props.products.isPending ? (
            <>
              <List>
                {this.state.productData.map(product => {
                  return (
                    <ListItem thumbnail key={product.id}>
                      <Left>
                        <Thumbnail
                          source={{
                            uri: `${product.image}`,
                          }}
                        />
                      </Left>
                      <Body>
                        <Text numberOfLines={1}>{product.name}</Text>
                        <Text note numberOfLines={1}>
                          {formatNumber(product.price)}
                        </Text>
                      </Body>
                      <Right>
                        <Button
                          transparent
                          onPress={() => this.handleUpdate(product)}>
                          <Text>Detail</Text>
                        </Button>
                      </Right>
                    </ListItem>
                  );
                })}
              </List>
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
                    <Thumbnail
                      square
                      resizeMode={'cover'}
                      style={{width: '100%', height: 300}}
                      source={{uri: this.state.editData.image}}
                    />
                    <CardItem header bordered>
                      <Text>Name : {this.state.editData.name}</Text>
                    </CardItem>
                    <CardItem bordered>
                      <Text>Categories : {this.state.editData.categories}</Text>
                    </CardItem>
                    <CardItem bordered>
                      <Text>
                        Price : {formatNumber(this.state.editData.price)}
                      </Text>
                    </CardItem>
                    <CardItem bordered>
                      <Text>Stock : {this.state.editData.stock}</Text>
                    </CardItem>
                    <CardItem bordered>
                      <Text>
                        Description : {this.state.editData.description}
                      </Text>
                    </CardItem>
                    <CardItem footer bordered>
                      <Left>
                        <Button
                          transparent
                          onPress={() =>
                            this.setState({modal: false, formModal: true})
                          }>
                          <Icon style={{color: 'orange'}} name="ios-create" />
                          <Text style={{color: 'orange'}}>Update</Text>
                        </Button>
                      </Left>
                      <Right>
                        <Button
                          transparent
                          onPress={() =>
                            this.alertDelete(this.state.editData.id)
                          }>
                          <Icon style={{color: 'red'}} name="ios-trash" />
                          <Text style={{color: 'red'}}>Trash</Text>
                        </Button>
                      </Right>
                    </CardItem>
                  </Card>
                </Content>
              </Modal>
              <Modal
                animationType="slide"
                transparent={false}
                visible={this.state.formModal}>
                <Button
                  transparent
                  onPress={() => this.setState({formModal: false})}>
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
                    {this.state.avatarSource === null ? (
                      <>
                        {this.state.editData.image !== '' ? (
                          <Thumbnail
                            square
                            resizeMode={'cover'}
                            style={{width: '100%', height: 300}}
                            source={{uri: this.state.editData.image}}
                          />
                        ) : null}
                      </>
                    ) : (
                      <>
                        {this.state.avatarSource && (
                          <Thumbnail
                            square
                            resizeMode={'cover'}
                            style={{width: '100%', height: 300}}
                            source={this.state.avatarSource}
                          />
                        )}
                      </>
                    )}
                    <Button primary onPress={() => this.handleChoosePhoto()}>
                      <Text>
                        {this.state.editData.id === null
                          ? 'Add Image'
                          : 'Update Image'}
                      </Text>
                    </Button>
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
                      <Item stackedLabel style={{borderBottomWidth: 0}}>
                        <Label>Categories</Label>
                        <Item picker>
                          <Picker
                            mode="dropdown"
                            iosIcon={<Icon name="arrow-down" />}
                            style={{width: undefined}}
                            placeholder="Select Categories"
                            placeholderStyle={{color: '#bfc6ea'}}
                            placeholderIconColor="#007aff"
                            selectedValue={this.state.editData.category_id}
                            onValueChange={cat =>
                              this.handleFormChange('category_id', cat)
                            }>
                            {this.state.categoriesData.map(categori => {
                              return (
                                <Picker.Item
                                  key={categori.id}
                                  label={categori.name}
                                  value={categori.id}
                                />
                              );
                            })}
                          </Picker>
                        </Item>
                      </Item>

                      <Item stackedLabel>
                        <Label>Price</Label>
                        <Input
                          defaultValue={this.state.editData.price.toString()}
                          keyboardType="numeric"
                          onChangeText={price =>
                            this.handleFormChange('price', price)
                          }
                        />
                      </Item>
                      <Item stackedLabel>
                        <Label>Stock</Label>
                        <Input
                          defaultValue={this.state.editData.stock.toString()}
                          keyboardType="numeric"
                          onChangeText={stock =>
                            this.handleFormChange('stock', stock)
                          }
                        />
                      </Item>
                      <Item stackedLabel>
                        <Label>Description</Label>
                        <Input
                          defaultValue={this.state.editData.description}
                          onChangeText={description =>
                            this.handleFormChange('description', description)
                          }
                        />
                      </Item>
                    </Form>
                    <CardItem footer bordered>
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
        <BottomNav menu={this.props} products={true} />
      </Container>
    );
  }
}

const mapStateToProps = ({products, categories}) => {
  return {
    products,
    categories,
  };
};

export default connect(mapStateToProps)(Products);
