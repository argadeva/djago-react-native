import Axios from 'axios';

export const getHistory = token => {
  return {
    type: 'GET_HISTORY',
    payload: Axios.get(`http://18.206.61.46:3000/api/v1/history`, {
      headers: {'x-access-token': token},
    }),
  };
};
