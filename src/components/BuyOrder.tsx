import React from 'react';
import {Dimensions, StyleSheet, Text, useColorScheme} from 'react-native';
import {ListItem} from 'react-native-elements';
import moment from 'moment';
import {light, dark} from '../styles/defaultStyles';
import {ITradeProps} from '../interfaces/AlgoInterfaces';

const window = Dimensions.get('window');

const BuyOrder: React.FC<ITradeProps> = ({order}) => {
  const buyOrder = order[0];
  const sellOrder = order[1] ? order[1] : null;
  const theme = useColorScheme() == 'light' ? light : dark;
  const net_change = sellOrder ? sellOrder.sale_amount_minus_commission - buyOrder.purchase_amount_minus_commission : 0;

  return (
    <>
      <Text style={[styles.time, {color: theme.textColor, backgroundColor: theme.foregroundColor}]}>
        {moment(buyOrder.utc_transaction_time).format('hh:mm:ss a - LL')}
      </Text>
      <ListItem containerStyle={[styles.listItem, {backgroundColor: theme.foregroundColor}]} key={`${net_change}aa`}>
        <ListItem.Content>
          <ListItem.Title style={{color: theme.textColor2}}>
            {buyOrder.asset} @ ${buyOrder.average_price_of_asset}
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Title style={{color: theme.textColor2, paddingRight: 10}}>
          {sellOrder == null ? 'OPEN' : buyOrder.side} ${buyOrder.purchase_amount_minus_commission.toFixed(2)}
        </ListItem.Title>
      </ListItem>
    </>
  );
};

const styles = StyleSheet.create({
  listItem: {
    width: window.width,
    paddingTop: 10,
    paddingBottom: 10,
  },
  time: {
    fontWeight: '600',
    paddingTop: 10,
    paddingLeft: 15,
  },
});

export default BuyOrder;
