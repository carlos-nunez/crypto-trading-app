import React, {Dispatch, ReactNode, useContext} from 'react';
import createDataContext from './createDataContext';
import {IAlgoState, IAlgoContext} from '../interfaces/AlgoInterfaces';
import {GET_TRADES, GET_CAPITAL_HISTORY} from './types';
import algo_api from '../api/api';

type Action = {
  payload: any;
  type: string;
};

const defaultState: IAlgoState = {
  trades: [],
  capital_history: [],
};

const getTrades = async (dispatch: Dispatch<Action>) => {
  try {
    const response = await algo_api.get(`/trades`);
    dispatch({type: GET_TRADES, payload: response.data});
  } catch (e) {
    dispatch({type: GET_TRADES, payload: []});
  }
};

const getCapitalHistory = async (dispatch: Dispatch<Action>) => {
  try {
    const response = await algo_api.get(`/capital`);
    dispatch({type: GET_CAPITAL_HISTORY, payload: response.data});
  } catch (e) {
    dispatch({type: GET_CAPITAL_HISTORY, payload: []});
  }
};

const algoReducer = (state: IAlgoState, action: Action): IAlgoState => {
  switch (action.type) {
    case GET_TRADES:
      return {...state, trades: action.payload};
    case GET_CAPITAL_HISTORY:
      return {...state, capital_history: action.payload};
    default:
      return state;
  }
};

interface IContextProps {
  children: ReactNode;
}

export const {Provider, Context} = createDataContext(algoReducer, {getTrades, getCapitalHistory}, defaultState);

export const AlgoProvider: React.FC<IContextProps> = ({children}) => {
  return <Provider>{children}</Provider>;
};

export const useAlgoContext = (): IAlgoContext => useContext<IAlgoContext>(Context);
