import {ListItem} from 'react-native-elements';
import React from 'react';
import {Dimensions, StyleSheet, Text, View, useColorScheme} from 'react-native';
import {light, dark} from '../styles/defaultStyles';
import moment from 'moment';
const window = Dimensions.get('window');
import {ITradeProps} from '../interfaces/AlgoInterfaces';

const Trade = ({order}: ITradeProps) => {
  const theme = useColorScheme() == 'light' ? light : dark;
  const buyOrder = order[0];
  const sellOrder = order[1] ? order[1] : null;
  const net_change = sellOrder ? sellOrder.sale_amount_minus_commission - buyOrder.purchase_amount_minus_commission : 0;

  const isProfit = net_change > 0;

  const percent_change = isProfit
    ? (net_change / buyOrder.purchase_amount_minus_commission) * 100
    : (net_change / buyOrder.purchase_amount_minus_commission) * 100;

  const profitStyle = isProfit ? theme.green : theme.red;
  const buyComponent = (
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

  if (!sellOrder) {
    return <View style={[{backgroundColor: theme.foregroundColor}, styles.container]}>{buyComponent}</View>;
  }

  return (
    <View style={[{backgroundColor: theme.foregroundColor}, styles.container]}>
      {/**Buy Order Element **/}
      {buyComponent}

      {/**Sell Order Element **/}
      <Text style={[styles.time, {color: theme.textColor, backgroundColor: theme.foregroundColor}]}>
        {moment(sellOrder.utc_transaction_time).format('hh:mm:ss a')}
      </Text>
      <ListItem containerStyle={[styles.listItem, {backgroundColor: theme.foregroundColor}]} key={0}>
        <ListItem.Content>
          <ListItem.Title style={{color: theme.textColor2}}>
            {sellOrder.asset} @ ${sellOrder.average_price_of_asset}
          </ListItem.Title>
          <ListItem.Subtitle style={{color: profitStyle}}>
            P/L: {isProfit ? '▲' : '▼'}${net_change.toFixed(2)} ({percent_change.toFixed(2)}
            %)
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Title style={[{backgroundColor: profitStyle, color: theme.foregroundColor}, styles.sell]}>
          {sellOrder.side} ${sellOrder.sale_amount_minus_commission.toFixed(2)}
        </ListItem.Title>
      </ListItem>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
  },
  capital: {
    paddingTop: 0,
    fontSize: 32,
    paddingLeft: 15,
    color: 'white',
    fontWeight: '400',
  },
  listItem: {
    width: window.width,
    paddingTop: 10,
    paddingBottom: 10,
  },
  red: {
    color: 'red',
  },
  green: {
    color: 'green',
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

export default Trade;
