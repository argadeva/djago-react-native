import {combineReducers} from 'redux';

import categoriesReducer from './categories';
import productsReducer from './products';
import checkoutReducer from './checkout';
import historyReducer from './history';
import userReducer from './users';

const reducers = combineReducers({
  user: userReducer,
  categories: categoriesReducer,
  products: productsReducer,
  checkout: checkoutReducer,
  history: historyReducer,
});

export default reducers;
