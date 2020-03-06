import Axios from 'axios';

export const getProducts = token => {
  return {
    type: 'GET_PRODUCTS',
    payload: Axios.get('http://18.206.61.46:3000/api/v1/products/onstock', {
      headers: {'x-access-token': token},
    }),
  };
};

export const addProducts = (editData, token, avatarSource) => {
  const bodyFormData = new FormData();
  bodyFormData.append('name', editData.name);
  bodyFormData.append('description', editData.description);
  bodyFormData.append('price', editData.price);
  bodyFormData.append('stock', editData.stock);
  bodyFormData.append('category_id', editData.category_id);
  if (avatarSource !== null) {
    bodyFormData.append('image', {
      uri: avatarSource.uri,
      type: 'image/jpeg',
      name: avatarSource.fileName,
    });
  }

  return {
    type: 'ADD_PRODUCTS',
    payload: Axios.post(
      'http://18.206.61.46:3000/api/v1/products',
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

export const editProducts = (editData, token, avatarSource) => {
  const bodyFormData = new FormData();
  bodyFormData.append('name', editData.name);
  bodyFormData.append('description', editData.description);
  bodyFormData.append('price', editData.price);
  bodyFormData.append('stock', editData.stock);
  bodyFormData.append('category_id', editData.category_id);
  if (avatarSource !== null) {
    bodyFormData.append('image', {
      uri: avatarSource.uri,
      type: 'image/jpeg',
      name: avatarSource.fileName,
    });
  }

  return {
    type: 'EDIT_PRODUCTS',
    payload: Axios.patch(
      `http://18.206.61.46:3000/api/v1/products/${editData.id}`,
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

export const deleteProducts = (id, token) => {
  return {
    type: 'DELETE_PRODUCTS',
    payload: Axios.delete(`http://18.206.61.46:3000/api/v1/products/${id}`, {
      headers: {'x-access-token': token},
    }),
  };
};
