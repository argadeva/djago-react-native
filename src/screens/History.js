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
  List,
  ListItem,
  Card,
  CardItem,
  Spinner,
} from 'native-base';
import {Col, Row, Grid} from 'react-native-easy-grid';
import BottomNav from '../components/BottomNav';
import {StyleSheet, Modal} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {connect} from 'react-redux';
import {getCheckout, getCheckoutDetail} from '../redux/actions/checkout';
import {getHistory} from '../redux/actions/history';

export class History extends Component {
  state = {
    checkoutData: [],
    historyData: [],
    detailData: [],
    modal: false,
    userToken: '',
    isLoadingDetail: true,
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
      this.getHistory();
      this.getCheckout();
    }, 1000);
  }

  getCheckout = async () => {
    await this.props.dispatch(getCheckout(this.state.userToken));
    this.setState({
      checkoutData: this.props.checkout.checkoutData.result,
    });
  };

  getHistory = async () => {
    await this.props.dispatch(getHistory(this.state.userToken));
    this.setState({
      historyData: this.props.history.historyData.history,
    });
  };

  handleDetail = id => {
    this.setState({
      modal: true,
    });
    this.props
      .dispatch(getCheckoutDetail(id, this.state.userToken))
      .then(result => {
        this.setState({detailData: result.value.data, isLoadingDetail: false});
      });
  };

  render() {
    function formatNumber(num) {
      return 'Rp. ' + num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    }

    let todayIncome = this.state.historyData.todayIncome;
    let yesterdayIncome = this.state.historyData.yesterdayIncome;
    let orderthisWeek = this.state.historyData.orderthisWeek;
    let orderlastWeek = this.state.historyData.orderlastWeek;
    let currentYearIncome = this.state.historyData.currentYearIncome;
    let lastYearIncome = this.state.historyData.lastYearIncome;
    return (
      <Container>
        <Header
          style={{backgroundColor: '#C02739'}}
          iosBarStyle="light-content"
          androidStatusBarColor="#84142D">
          <Left>
            <Button transparent>
              <Icon name="ios-paper" />
            </Button>
          </Left>
          <Body>
            <Title>History</Title>
          </Body>
          <Right />
        </Header>
        <Content>
          {this.state.checkoutData.length > 0 ? (
            <>
              <Grid>
                <Row style={{marginHorizontal: 5, marginTop: 5}}>
                  <Col style={styles.colCard1}>
                    <Grid>
                      <Col style={{flex: 3, alignSelf: 'center', padding: 10}}>
                        <Text style={{fontSize: 12, color: 'white'}}>
                          Today’s Income
                        </Text>
                        <Text style={{fontSize: 12, color: 'white'}}>
                          {formatNumber(parseInt(todayIncome))}
                        </Text>
                      </Col>
                      <Col style={{flex: 1, alignSelf: 'center', padding: 10}}>
                        <Text
                          style={{fontSize: 12, color: 'white'}}
                          numberOfLines={1}>
                          {Math.round(
                            (todayIncome / yesterdayIncome) * 100 - 100,
                          )}
                          %
                        </Text>
                      </Col>
                    </Grid>
                  </Col>
                  <Col style={styles.colCard2}>
                    <Grid>
                      <Col style={{flex: 3, alignSelf: 'center', padding: 10}}>
                        <Text style={{fontSize: 12, color: 'white'}}>
                          Orders
                        </Text>
                        <Text style={{fontSize: 12, color: 'white'}}>
                          {orderthisWeek}
                        </Text>
                      </Col>
                      <Col style={{flex: 1, alignSelf: 'center', padding: 10}}>
                        <Text
                          style={{fontSize: 12, color: 'white'}}
                          numberOfLines={1}>
                          {Math.round(
                            (orderthisWeek / orderlastWeek) * 100 - 100,
                          )}
                          %
                        </Text>
                      </Col>
                    </Grid>
                  </Col>
                </Row>
                <Row style={{marginHorizontal: 5}}>
                  <Col style={styles.colCard4}>
                    <Grid>
                      <Col style={{flex: 6, alignSelf: 'center', padding: 10}}>
                        <Text style={{fontSize: 12, color: 'white'}}>
                          This Year’s Income
                        </Text>
                        <Text style={{fontSize: 12, color: 'white'}}>
                          {formatNumber(parseInt(currentYearIncome))}
                        </Text>
                      </Col>
                      <Col style={{flex: 1, alignSelf: 'center', padding: 10}}>
                        <Text style={{fontSize: 12, color: 'white'}}>
                          {Math.round(
                            (currentYearIncome / lastYearIncome) * 100 - 100,
                          )}
                          %
                        </Text>
                      </Col>
                    </Grid>
                  </Col>
                </Row>
              </Grid>
              <List style={{padding: 10}}>
                <ListItem itemDivider>
                  <Left>
                    <Text>ORDER LIST</Text>
                  </Left>
                  <Right>
                    <Text>DETAILS</Text>
                  </Right>
                </ListItem>
                {this.state.checkoutData.map(checkout => {
                  return (
                    <ListItem key={checkout.id}>
                      <Left>
                        <Text>{checkout.order_number}</Text>
                      </Left>
                      <Right>
                        <Button
                          transparent
                          onPress={() => this.handleDetail(checkout.id)}>
                          <Icon name="arrow-forward" />
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
                  onPress={() =>
                    this.setState({modal: false, isLoadingDetail: true})
                  }>
                  <Icon name="close" />
                </Button>
                {this.state.isLoadingDetail ? (
                  <Spinner color="blue" style={{height: 500}} />
                ) : (
                  <>
                    <Card style={{marginLeft: 20, marginRight: 20}}>
                      <CardItem>
                        <Body>
                          <Text style={{alignSelf: 'center'}}>
                            Orders Detail
                          </Text>
                          <Text style={{alignSelf: 'center'}}>
                            {this.state.detailData.order_number}
                          </Text>
                          <Text style={{alignSelf: 'center'}}>
                            {this.state.detailData.name}
                          </Text>
                        </Body>
                      </CardItem>
                    </Card>
                    <Card style={{marginLeft: 20, marginRight: 20}}>
                      {this.state.detailData.products.map(detail => {
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
                      })}
                    </Card>
                    <Card style={{marginLeft: 20, marginRight: 20}}>
                      <CardItem>
                        <Left>
                          <Text>Ppn 10%</Text>
                        </Left>
                        <Right>
                          <Text>
                            {formatNumber(parseInt(this.state.detailData.ppn))}
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
                              parseInt(this.state.detailData.total),
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
            </>
          ) : (
            <Spinner color="blue" style={{height: 500}} />
          )}
        </Content>
        <BottomNav menu={this.props} history={true} />
      </Container>
    );
  }
}

const styles = StyleSheet.create({
  colCard1: {
    margin: 5,
    backgroundColor: 'red',
    height: 80,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  colCard2: {
    margin: 5,
    backgroundColor: 'orange',
    height: 80,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  colCard3: {
    margin: 5,
    backgroundColor: 'green',
    height: 80,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  colCard4: {
    margin: 5,
    backgroundColor: 'blue',
    height: 80,
    borderRadius: 2,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});

const mapStateToProps = ({checkout, history}) => {
  return {
    checkout,
    history,
  };
};

export default connect(mapStateToProps)(History);
