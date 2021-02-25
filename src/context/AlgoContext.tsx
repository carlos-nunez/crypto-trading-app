import createDataContext from './createDataContext';
import algo_api from '../api/algo';

type Action = {
  payload: any;
  type: string;
};

const algoReducer = (state: Object, action: Action) => {
  switch (action.type) {
    case 'get_trades':
      return {...state, trades: action.payload};
    case 'get_capital_history':
      return {...state, capital_history: action.payload};
    default:
      return state;
  }
};

const getTrades = (dispatch: any) => {
  return async () => {
    try {
      const response = await algo_api.get(`/trades`);

      dispatch({type: 'get_trades', payload: response.data});
    } catch (e) {
      dispatch({type: 'get_trades', payload: []});
    }
  };
};

const getCapitalHistory = (dispatch: any) => {
  return async () => {
    try {
      const response = await algo_api.get(`/capital`);
      dispatch({type: 'get_capital_history', payload: response.data});
    } catch (e) {
      dispatch({type: 'get_capital_history', payload: []});
    }
  };
};

export const {Provider, Context} = createDataContext(
  algoReducer,
  {getTrades, getCapitalHistory},
  {trades: [], capital_history: []},
);
