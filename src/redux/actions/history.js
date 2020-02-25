import Axios from 'axios';

export const getHistory = token => {
  return {
    type: 'GET_HISTORY',
    payload: Axios.get(`http://54.173.43.255:1000/api/v1/history`, {
      headers: {'x-access-token': token},
    }),
  };
};
