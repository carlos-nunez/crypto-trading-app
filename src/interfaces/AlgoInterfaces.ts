export interface IAlgoState {
  trades: ITrade[];
  capital_history: ICapital[];
}

export interface IAlgoContext extends IAlgoState {
  state: IAlgoState;
  getTrades: () => Promise<void>;
  getCapitalHistory: () => Promise<void>;
}

export interface IGenericObj {
  [key: string]: any;
}

type BuyOrder = {
  id: string;
  asset: string;
  utc_transaction_time: Date;
  purchase_amount_minus_commission: number;
  average_price_of_asset: number;
  side: string;
};

type SellOrder = {
  asset: string;
  id: string;
  utc_transaction_time: Date;
  sale_amount_minus_commission: number;
  average_price_of_asset: number;
  side: string;
};

export type ITrade = [BuyOrder, SellOrder?];

export interface ICapital {
  capital: number;
  utc_time: Date;
}

export interface ITradeProps {
  order: ITrade;
}
