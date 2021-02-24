import createDataContext from './createDataContext';
import algo_api from '../api/algo';
import moment from 'moment';

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
    try {
      const response = await algo_api.get(`/trades`);

      dispatch({type: 'get_trades', payload: response.data});
    } catch (e) {
      var trade = {
        asset: 'ETH',
        average_price_of_asset: 1700,
        purchase_amount_minus_commission: 20,
        side: buy,
      };

      dispatch({type: 'get_trades', payload: []});
    }
  };
};

const getCapitalHistory = (dispatch) => {
  return async () => {
    try {
      const response = await algo_api.get(`/capital`);
      dispatch({type: 'get_capital_history', payload: response.data});
    } catch (e) {
      var capitals = [];

      for (var i = 0; i < 50; i++) {
        var capital = {
          id: `${i}`,
          capital: i + Math.random() * 10,
          utc_time: moment().subtract(i, 'days'),
        };
        capitals.push(capital);
      }

      dispatch({type: 'get_capital_history', payload: capitals});
    }
  };
};

export const {Provider, Context} = createDataContext(
  algoReducer,
  {getTrades, getCapitalHistory},
  {trades: [], capital_history: []},
);
