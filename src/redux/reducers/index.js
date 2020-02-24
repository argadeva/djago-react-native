import {combineReducers} from 'redux';

import categoriesReducer from './categories';
import productsReducer from './products';

const reducers = combineReducers({
  categories: categoriesReducer,
  products: productsReducer,
});

export default reducers;
