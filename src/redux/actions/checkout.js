import Axios from 'axios';

export const checkout = (bodyFormData, token) => {
  return {
    type: 'CHECKOUT_ORDER',
    payload: Axios.post(
      'http://54.173.43.255:1000/api/v1/checkout/cart',
      bodyFormData,
      {
        headers: {
          'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
          'x-access-token': token,
        },
      },
    ),
  };
};

export const getCheckoutDetail = (idCheckout, token) => {
  return {
    type: 'GET_CHECKOUT_DETAIL',
    payload: Axios.get(
      `http://54.173.43.255:1000/api/v1/checkout/${idCheckout}`,
      {
        headers: {'x-access-token': token},
      },
    ),
  };
};

export const getCheckout = token => {
  return {
    type: 'GET_CHECKOUT',
    payload: Axios.get(`http://54.173.43.255:1000/api/v1/checkout`, {
      headers: {'x-access-token': token},
    }),
  };
};
