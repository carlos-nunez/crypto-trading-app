import createDataContext from './createDataContext';
import algo_api from '../api/algo';

const algoReducer = (state, action) => {
  switch (action.type) {
    case 'get_trades':
      return {...state, trades: action.payload};
    case 'get_capital_history':
      return {...state, capital_history: action.payload};
    default:
      return state;
  }
};

const getTrades = (dispatch) => {
  return async () => {
    const response = await algo_api.get(`/trades`);

    dispatch({type: 'get_trades', payload: response.data});
  };
};

const getCapitalHistory = (dispatch) => {
  return async () => {
    const response = await algo_api.get(`/capital`);
    dispatch({type: 'get_capital_history', payload: response.data});
  };
};

export const {Provider, Context} = createDataContext(
  algoReducer,
  {getTrades, getCapitalHistory},
  {trades: [], capital_history: []},
);
