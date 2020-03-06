import Axios from 'axios';
import qs from 'qs';

export const getUsers = token => {
  return {
    type: 'GET_USERS',
    payload: Axios.get(`http://18.206.61.46:3000/api/v1/users`, {
      headers: {'x-access-token': token},
    }),
  };
};

export const addUsers = (data, token) => {
  const bodyFormData = qs.stringify({
    name: data.name,
    email: data.email,
    password: data.password,
  });
  return {
    type: 'ADD_USERS',
    payload: Axios.post(`http://18.206.61.46:3000/api/v1/users`, bodyFormData, {
      headers: {
        'content-type': 'application/x-www-form-urlencoded;charset=utf-8',
        'x-access-token': token,
      },
    }),
  };
};

export const editUsers = (editData, token) => {
  const bodyFormData = qs.stringify({
    name: editData.name,
    email: editData.email,
    password: editData.password,
  });
  return {
    type: 'EDIT_USERS',
    payload: Axios.patch(
      `http://18.206.61.46:3000/api/v1/users/${editData.id}`,
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

export const deleteUsers = (id, token) => {
  return {
    type: 'EDIT_CATEGORIES',
    payload: Axios.delete(`http://18.206.61.46:3000/api/v1/users/${id}`, {
      headers: {'x-access-token': token},
    }),
  };
};
