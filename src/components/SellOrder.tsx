import React from 'react';
import {Dimensions, StyleSheet, Text, useColorScheme} from 'react-native';
import {ListItem} from 'react-native-elements';
import moment from 'moment';
import {light, dark} from '../styles/defaultStyles';
import {ITradeProps} from '../interfaces/AlgoInterfaces';

const window = Dimensions.get('window');

const SellOrder: React.FC<ITradeProps> = ({order}) => {
  const buyOrder = order[0];
  const sellOrder = order[1] ? order[1] : null;
  const theme = useColorScheme() == 'light' ? light : dark;

  const net_change = sellOrder ? sellOrder.sale_amount_minus_commission - buyOrder.purchase_amount_minus_commission : 0;

  const isProfit = net_change > 0;

  const percent_change = (net_change / buyOrder.purchase_amount_minus_commission) * 100;
  const profitStyle = isProfit ? theme.green : theme.red;

  return (
    <>
      <Text style={[styles.time, {color: theme.textColor, backgroundColor: theme.foregroundColor}]}>
        {moment(sellOrder?.utc_transaction_time).format('hh:mm:ss a')}
      </Text>
      <ListItem containerStyle={[styles.listItem, {backgroundColor: theme.foregroundColor}]} key={0}>
        <ListItem.Content>
          <ListItem.Title style={{color: theme.textColor2}}>
            {sellOrder?.asset} @ ${sellOrder?.average_price_of_asset}
          </ListItem.Title>
          <ListItem.Subtitle style={{color: profitStyle}}>
            P/L: {isProfit ? '▲' : '▼'}${net_change.toFixed(2)} ({percent_change.toFixed(2)}
            %)
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Title style={[{backgroundColor: profitStyle, color: theme.foregroundColor}, styles.sell]}>
          {sellOrder?.side} ${sellOrder?.sale_amount_minus_commission.toFixed(2)}
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
  sell: {
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 5,
    overflow: 'hidden',
  },
  time: {
    fontWeight: '600',
    paddingTop: 10,
    paddingLeft: 15,
  },
});

export default SellOrder;
