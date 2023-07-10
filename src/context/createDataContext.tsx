import React, {useReducer} from 'react';
import {IGenericObj} from '../interfaces/AlgoInterfaces';

type Actions = {
  [key: string]: any;
};

export default (reducer: any, actions: any, defaultValue: any) => {
  const Context: any = React.createContext(defaultValue);

  const Provider: any = ({children}: IGenericObj) => {
    const [state, dispatch] = useReducer(reducer, defaultValue);

    const boundActions: Actions = {};
    for (let key in actions) {
      boundActions[key] = actions[key](dispatch);
    }

    return <Context.Provider value={{state, ...boundActions}}>{children}</Context.Provider>;
  };

  return {Context, Provider};
};
