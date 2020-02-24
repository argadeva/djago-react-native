import Axios from 'axios';

const token =
  '1#eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyZXN1bHRzIjp7ImlkIjoxLCJuYW1lIjoiQWRtaW4iLCJlbWFpbCI6ImFkbWluQGFkbWluLmNvbSIsInRva2VuIjpudWxsfSwiaWF0IjoxNTgyNDc2Nzc0LCJleHAiOjE1ODMwODE1NzR9.HCaFI_7L_x2Fl3KsGI3HRjY0gwJw_NWxjAwhrhinxco';

export const getProducts = () => {
  return {
    type: 'GET_PRODUCTS',
    payload: Axios.get('http://54.173.43.255:1000/api/v1/products/onstock', {
      headers: {'x-access-token': token},
    }),
  };
};

export const addProducts = editData => {
  const bodyFormData = new FormData();
  bodyFormData.append('name', editData.name);
  bodyFormData.append('description', editData.description);
  bodyFormData.append('price', editData.price);
  bodyFormData.append('stock', editData.stock);
  bodyFormData.append('category_id', editData.category_id);
  bodyFormData.append('image', editData.image);
  return {
    type: 'ADD_PRODUCTS',
    payload: Axios.post(
      'http://54.173.43.255:1000/api/v1/products',
      bodyFormData,
      {
        headers: {
          'content-type': 'multipart/form-data',
          'x-access-token': token,
        },
      },
    ),
  };
};

export const editProducts = editData => {
  const bodyFormData = new FormData();
  bodyFormData.append('name', editData.name);
  bodyFormData.append('description', editData.description);
  bodyFormData.append('price', editData.price);
  bodyFormData.append('stock', editData.stock);
  bodyFormData.append('category_id', editData.category_id);
  bodyFormData.append('image', editData.image);
  return {
    type: 'EDIT_PRODUCTS',
    payload: Axios.patch(
      `http://54.173.43.255:1000/api/v1/products/${editData.id}`,
      bodyFormData,
      {
        headers: {
          'content-type': 'multipart/form-data',
          'x-access-token': token,
        },
      },
    ),
  };
};

export const deleteProducts = id => {
  return {
    type: 'DELETE_PRODUCTS',
    payload: Axios.delete(`http://54.173.43.255:1000/api/v1/products/${id}`, {
      headers: {'x-access-token': token},
    }),
  };
};
