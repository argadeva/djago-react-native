import React, {Component} from 'react';
import {
  Container,
  Header,
  Input,
  Icon,
  Text,
  Button,
  Badge,
  Content,
  Item,
  Thumbnail,
  View,
  Spinner,
  ListItem,
  List,
  Left,
  Body,
  Right,
  Card,
  CardItem,
} from 'native-base';
import {Row, Grid, Col} from 'react-native-easy-grid';
import {connect} from 'react-redux';
import {getProducts} from '../redux/actions/products';
import {TouchableOpacity, Modal, StyleSheet} from 'react-native';
import {checkout, getCheckoutDetail} from '../redux/actions/checkout';
import Axios from 'axios';
import qs from 'qs';
import BottomNav from '../components/BottomNav';
import AsyncStorage from '@react-native-community/async-storage';

export class Home extends Component {
  state = {
    productData: [],
    carts: [],
    checkoutDetail: [],
    search: '',
    modal: false,
    userToken: '',
    modal2: false,
    isCheckoutLoading: true,
  };

  setModal = visible => {
    this.setState({
      modal: visible,
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

  getProduct = async () => {
    await this.props.dispatch(getProducts(this.state.userToken));
    this.setState({
      productData: this.props.products.productData.result,
    });
  };

  componentDidMount = () => {
    this.getToken();
    setTimeout(() => {
      this.getProduct();
    }, 1000);
  };

  selectedProduct = product => {
    if (product.stock > 0) {
      const index = this.state.carts.findIndex(function(onCarts) {
        return onCarts.id === product.id;
      });
      if (index < 0) {
        var newProduct = Object.assign(product, {qty: 1});
        this.setState({
          carts: this.state.carts.concat(newProduct),
        });
      }
    }
  };

  plusProduct = id => {
    const index = this.state.carts.findIndex(function(onCarts) {
      return onCarts.id === id;
    });
    let carts = [...this.state.carts];
    let cart = {...carts[index]};
    cart.qty += 1;
    carts[index] = cart;
    if (this.state.carts[index].stock >= cart.qty) {
      this.setState({carts});
    }
  };

  minProduct = id => {
    const index = this.state.carts.findIndex(function(onCarts) {
      return onCarts.id === id;
    });
    if (this.state.carts[index].qty > 1) {
      let carts = [...this.state.carts];
      let cart = {...carts[index]};
      cart.qty -= 1;
      carts[index] = cart;
      this.setState({carts});
    } else {
      const carts = this.state.carts.filter(cart => cart.id !== id);
      this.setState({carts: carts});
    }
  };

  cancelCart = () => {
    this.setState({
      carts: [],
      modal: false,
    });
  };

  getCheckoutDetail = async (idCheckout, token) => {
    await this.props.dispatch(getCheckoutDetail(idCheckout, token));
    this.setState({
      checkoutDetail: this.props.checkout.checkoutDetailData.result,
      isCheckoutLoading: false,
    });
  };

  submitCart = async () => {
    this.setState({modal2: true});
    if (this.state.carts.length !== 0) {
      const number = Date.now();
      await Axios.post(
        'http://18.206.61.46:3000/api/v1/checkout',
        {order_number: number},
        {
          headers: {
            'x-access-token': this.state.userToken,
          },
        },
      ).then(response => {
        for (let i = 0; i < this.state.carts.length; i++) {
          const bodyFormData = qs.stringify({
            order_id: response.data.result.insertId,
            product_id: this.state.carts[i].id,
            qty: this.state.carts[i].qty,
          });
          this.props.dispatch(checkout(bodyFormData, this.state.userToken));
        }
        setTimeout(() => {
          this.getCheckoutDetail(
            response.data.result.insertId,
            this.state.userToken,
          );
        }, 1000);
      });
      await this.cancelCart();
    }
  };

  render() {
    function formatNumber(num) {
      return 'Rp. ' + num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    }

    let countTotal = this.state.carts.reduce(function(prev, cur) {
      return prev + cur.price * cur.qty;
    }, 0);

    let countTotals = formatNumber(countTotal);

    function filterByValue(array, string) {
      return array.filter(name =>
        Object.keys(name).some(value =>
          name[value]
            .toString()
            .toLowerCase()
            .includes(string.toString().toLowerCase()),
        ),
      );
    }

    return (
      <Container>
        <Header
          style={{backgroundColor: '#C02739'}}
          iosBarStyle="light-content"
          androidStatusBarColor="#84142D">
          <Grid style={{padding: 10}}>
            <Row>
              <Item rounded style={{width: '80%', borderBottomWidth: 1}}>
                <Icon name="ios-search" style={{color: 'white'}} />
                <Input
                  placeholder="Search"
                  placeholderTextColor="white"
                  style={{color: 'white', padding: 5}}
                  onChangeText={txt => {
                    this.setState({search: txt});
                  }}
                />
              </Item>
              <Button
                style={{width: '20%'}}
                transparent
                onPress={() => this.setModal(true)}>
                <Icon name="ios-cart" />
                <Badge
                  style={{
                    backgroundColor: '#ffd082',
                    position: 'absolute',
                    right: 0,
                  }}>
                  <Text style={{color: '#84142D'}}>
                    {this.state.carts.length}
                  </Text>
                </Badge>
              </Button>
            </Row>
          </Grid>
        </Header>
        <Content>
          {!this.props.products.isPending ? (
            <Grid>
              {filterByValue(this.state.productData, this.state.search)
                .length !== 0 ? (
                <Row style={{flexWrap: 'wrap'}}>
                  {filterByValue(this.state.productData, this.state.search).map(
                    products => {
                      const index = this.state.carts.findIndex(function(
                        onCarts,
                      ) {
                        return onCarts.id === products.id;
                      });
                      return (
                        <View
                          key={products.id}
                          style={{
                            width: '45%',
                            margin: 8,
                          }}>
                          <TouchableOpacity
                            onPress={() => this.selectedProduct(products)}>
                            <Thumbnail
                              square
                              style={{
                                height: 165,
                                width: 165,
                                resizeMode: 'stretch',
                                alignItems: 'center',
                                justifyContent: 'center',
                              }}
                              source={{
                                uri: products.image,
                              }}
                            />
                            {index >= 0 ? (
                              <View style={styles.overlay}>
                                <Icon
                                  name="ios-checkmark-circle-outline"
                                  style={{maxWidth: '50%', color: 'white'}}
                                />
                              </View>
                            ) : null}
                          </TouchableOpacity>
                          <Text numberOfLines={1} style={{paddingLeft: 5}}>
                            {products.name}
                          </Text>
                          <Text numberOfLines={1} style={{paddingLeft: 5}}>
                            {formatNumber(products.price)}
                          </Text>
                        </View>
                      );
                    },
                  )}
                </Row>
              ) : this.state.search !== '' ? (
                <Text style={{marginHorizontal: '30%', marginTop: 50}}>
                  Product Not Found
                </Text>
              ) : (
                <Spinner color="blue" style={{height: 500, flex: 1}} />
              )}
            </Grid>
          ) : (
            <Spinner color="blue" style={{height: 500}} />
          )}
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modal}>
            <Button transparent onPress={() => this.setModal(false)}>
              <Icon name="close" />
            </Button>
            <Content>
              {this.state.carts.length === 0 ? (
                <Text style={{textAlign: 'center'}}>No Product</Text>
              ) : (
                this.state.carts.map(cartList => {
                  return (
                    <List key={cartList.id}>
                      <ListItem thumbnail>
                        <Left>
                          <Thumbnail
                            square
                            source={{
                              uri: cartList.image,
                            }}
                          />
                        </Left>
                        <Body>
                          <Text numberOfLines={1}>{cartList.name}</Text>
                          <Grid style={{flex: 0.5}}>
                            <Col>
                              <Button
                                bordered
                                success
                                small
                                onPress={() => this.minProduct(cartList.id)}>
                                <Text>-</Text>
                              </Button>
                            </Col>
                            <Col>
                              <Button bordered success small disabled>
                                <Text>{cartList.qty}</Text>
                              </Button>
                            </Col>
                            <Col>
                              <Button
                                bordered
                                success
                                small
                                onPress={() => this.plusProduct(cartList.id)}>
                                <Text>+</Text>
                              </Button>
                            </Col>
                          </Grid>
                        </Body>
                        <Right style={{flex: 1}}>
                          <Text>
                            {formatNumber(cartList.price * cartList.qty)}
                          </Text>
                        </Right>
                      </ListItem>
                    </List>
                  );
                })
              )}
            </Content>
            {this.state.carts.length > 0 ? (
              <>
                <Text style={{padding: 20, alignSelf: 'flex-end'}}>
                  Total: {countTotals}
                </Text>
                <Button
                  style={{backgroundColor: '#151965'}}
                  full
                  onPress={() => this.submitCart()}>
                  <Text>Checkout</Text>
                </Button>
                <Button
                  style={{backgroundColor: '#C02739'}}
                  full
                  danger
                  onPress={() => this.cancelCart()}>
                  <Text>Cancel</Text>
                </Button>
              </>
            ) : null}
          </Modal>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modal2}>
            <Button
              transparent
              onPress={() =>
                this.setState({
                  modal2: false,
                  checkoutDetail: [],
                  isCheckoutLoading: true,
                })
              }>
              <Icon name="close" />
            </Button>
            {this.state.isCheckoutLoading ? (
              <Spinner color="blue" style={{height: 500, flex: 1}} />
            ) : (
              <>
                <Card style={{marginLeft: 20, marginRight: 20}}>
                  <CardItem>
                    <Body>
                      <Text style={{alignSelf: 'center'}}>Orders Detail</Text>
                      <Text style={{alignSelf: 'center'}}>
                        {this.props.checkout.checkoutDetailData.order_number}
                      </Text>
                      <Text style={{alignSelf: 'center'}}>
                        {this.props.checkout.checkoutDetailData.name}
                      </Text>
                    </Body>
                  </CardItem>
                </Card>
                <Card style={{marginLeft: 20, marginRight: 20}}>
                  {this.props.checkout.checkoutDetailData.products.map(
                    detail => {
                      return (
                        <CardItem key={detail.id}>
                          <Left>
                            <Text>{detail.name + '  ' + detail.qty}x</Text>
                          </Left>
                          <Right>
                            <Text>{formatNumber(detail.total)}</Text>
                          </Right>
                        </CardItem>
                      );
                    },
                  )}
                </Card>
                <Card style={{marginLeft: 20, marginRight: 20}}>
                  <CardItem>
                    <Left>
                      <Text>Ppn 10%</Text>
                    </Left>
                    <Right>
                      <Text>
                        {formatNumber(
                          parseInt(this.props.checkout.checkoutDetailData.ppn),
                        )}
                      </Text>
                    </Right>
                  </CardItem>
                  <CardItem>
                    <Left>
                      <Text>Total</Text>
                    </Left>
                    <Right>
                      <Text>
                        {formatNumber(
                          parseInt(
                            this.props.checkout.checkoutDetailData.total,
                          ),
                        )}
                      </Text>
                    </Right>
                  </CardItem>
                  <CardItem>
                    <Left>
                      <Text>Payment</Text>
                    </Left>
                    <Right>
                      <Text>Cash</Text>
                    </Right>
                  </CardItem>
                </Card>
              </>
            )}
          </Modal>
        </Content>
        <BottomNav menu={this.props} home={true} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const mapStateToProps = ({products, checkout}) => {
  return {
    products,
    checkout,
  };
};

export default connect(mapStateToProps)(Home);
