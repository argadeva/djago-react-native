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
} from 'native-base';
import {connect} from 'react-redux';
import {
  getProducts,
  addProducts,
  editProducts,
  deleteProducts,
} from '../redux/actions/products';
import {getCategories} from '../redux/actions/categories';
import {Modal, Alert} from 'react-native';

export class Products extends Component {
  state = {
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
    },
    image: false,
    categoriesData: [],
    sort: 'created_at',
    modal: false,
  };

  getProducts = async () => {
    await this.props.dispatch(getProducts());
    this.setState({
      productData: this.props.products.productData.result,
    });
  };

  getCategories = async () => {
    await this.props.dispatch(getCategories());
    this.setState({
      categoriesData: this.props.categories.categoriesData.result,
    });
  };

  componentDidMount() {
    this.getProducts();
    this.getCategories();
  }

  handleUpdate = data => {
    this.setState({
      image: false,
      editData: {
        id: data.id,
        name: data.name,
        image: data.image,
        price: data.price,
        category_id: data.category_id,
        stock: data.stock,
        description: data.description,
      },
      modal: true,
    });
  };

  setModal = visible => {
    this.setState({
      modal: visible,
    });
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
            <Button transparent>
              <Icon name="add" />
            </Button>
          </Right>
        </Header>
        {!this.props.categories.isPending ? (
          <Content>
            <List>
              {this.state.productData.map(product => {
                return (
                  <ListItem thumbnail key={product.id}>
                    <Left>
                      <Thumbnail
                        square
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
          </Content>
        ) : (
          <Spinner color="blue" />
        )}
        <Modal
          animationType="slide"
          transparent={false}
          visible={this.state.modal}>
          <Button transparent onPress={() => this.setModal(false)}>
            <Icon name="close" />
          </Button>
          <Content style={{padding: 20}}>
            <Text>{this.state.editData.name}</Text>
          </Content>
        </Modal>
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
