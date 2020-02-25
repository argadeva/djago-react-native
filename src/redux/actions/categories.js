import Axios from 'axios';

export const getCategories = token => {
  return {
    type: 'GET_CATEGORIES',
    payload: Axios.get('http://54.173.43.255:1000/api/v1/categories', {
      headers: {'x-access-token': token},
    }),
  };
};

export const addCategories = (data, token) => {
  return {
    type: 'ADD_CATEGORIES',
    payload: Axios.post(
      `http://54.173.43.255:1000/api/v1/categories`,
      {name: data},
      {
        headers: {'x-access-token': token},
      },
    ),
  };
};

export const editCategories = (editData, token) => {
  return {
    type: 'EDIT_CATEGORIES',
    payload: Axios.patch(
      `http://54.173.43.255:1000/api/v1/categories/${editData.id}`,
      {name: editData.name},
      {
        headers: {'x-access-token': token},
      },
    ),
  };
};

export const deleteCategories = (id, token) => {
  return {
    type: 'DELETE_CATEGORIES',
    payload: Axios.delete(`http://54.173.43.255:1000/api/v1/categories/${id}`, {
      headers: {'x-access-token': token},
    }),
  };
};
