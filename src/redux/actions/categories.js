import Axios from 'axios';

const token =
  '1#eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHRzIjp7ImlkIjoxLCJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInRva2VuIjpudWxsfSwiaWF0IjoxNTgyNDc2Nzc0LCJleHAiOjE1ODMwODE1NzR9.HCaFI_7L_x2Fl3KsGI3HRjY0gwJw_NWxjAwhrhinxco';

export const getCategories = () => {
  return {
    type: 'GET_CATEGORIES',
    payload: Axios.get('http://54.173.43.255:1000/api/v1/categories', {
      headers: {'x-access-token': token},
    }),
  };
};

export const addCategories = data => {
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

export const editCategories = editData => {
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

export const deleteCategories = id => {
  return {
    type: 'DELETE_CATEGORIES',
    payload: Axios.delete(`http://54.173.43.255:1000/api/v1/categories/${id}`, {
      headers: {'x-access-token': token},
    }),
  };
};
