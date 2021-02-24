import {ListItem, Avatar} from 'react-native-elements';
import React, {useState, useContext, useEffect} from 'react';
import {Dimensions, StyleSheet, Text, View} from 'react-native';
import {Appearance, useColorScheme} from 'react-native';
import {light, dark} from '../styles/defaultStyles';
import moment from 'moment';

const Trade = ({order}) => {
  var theme = useColorScheme() == 'light' ? light : dark;

  var buy_order = order[0];

  var sell_order = order[1] ? order[1] : null;

  var buy_element = (
    <>
      <Text
        style={[
          styles.time,
          {color: theme.textColor, backgroundColor: theme.foregroundColor},
        ]}>
        {moment(buy_order.utc_transaction_time).format('hh:mm:ss a - LL')}
      </Text>
      <ListItem
        containerStyle={[
          styles.listItem,
          {backgroundColor: theme.foregroundColor},
        ]}
        key={`${net_change}aa`}>
        <ListItem.Content>
          <ListItem.Title style={{color: theme.textColor2}}>
            {buy_order.asset} @ ${buy_order.average_price_of_asset}
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Title style={{color: theme.textColor2, paddingRight: 10}}>
          {buy_order.side} $
          {buy_order.purchase_amount_minus_commission.toFixed(2)}
        </ListItem.Title>
      </ListItem>
    </>
  );

  if (!sell_order) {
    return (
      <View
        style={{
          backgroundColor: theme.foregroundColor,
          paddingTop: 5,
          paddingBottom: 5,
          borderRadius: 10,
        }}>
        {buy_element}
      </View>
    );
  }

  var net_change =
    sell_order.sale_amount_minus_commission -
    buy_order.purchase_amount_minus_commission;

  var isProfit = net_change > 0;

  var percent_change = isProfit
    ? (net_change / buy_order.purchase_amount_minus_commission) * 100
    : (net_change / buy_order.purchase_amount_minus_commission) * 100;

  var profit_style = isProfit ? theme.green : theme.red;

  return (
    <View
      style={{
        backgroundColor: theme.foregroundColor,
        paddingTop: 5,
        paddingBottom: 5,
        borderRadius: 10,
      }}>
      {/**Buy Order Element **/}
      <Text
        style={[
          styles.time,
          {color: theme.textColor, backgroundColor: theme.foregroundColor},
        ]}>
        {moment(buy_order.utc_transaction_time).format('hh:mm:ss a - LL')}
      </Text>
      <ListItem
        containerStyle={[
          styles.listItem,
          {backgroundColor: theme.foregroundColor},
        ]}
        key={`${net_change}aa`}>
        <ListItem.Content>
          <ListItem.Title style={{color: theme.textColor2}}>
            {buy_order.asset} @ ${buy_order.average_price_of_asset}
          </ListItem.Title>
        </ListItem.Content>
        <ListItem.Title style={{color: theme.textColor2, paddingRight: 10}}>
          {buy_order.side} $
          {buy_order.purchase_amount_minus_commission.toFixed(2)}
        </ListItem.Title>
      </ListItem>

      {/**Sell Order Element **/}
      <Text
        style={[
          styles.time,
          {color: theme.textColor, backgroundColor: theme.foregroundColor},
        ]}>
        {moment(sell_order.utc_transaction_time).format('hh:mm:ss a')}
      </Text>
      <ListItem
        containerStyle={[
          styles.listItem,
          {backgroundColor: theme.foregroundColor},
        ]}
        key={0}>
        <ListItem.Content>
          <ListItem.Title style={{color: theme.textColor2}}>
            {sell_order.asset} @ ${sell_order.average_price_of_asset}
          </ListItem.Title>
          <ListItem.Subtitle style={{color: profit_style}}>
            P/L: {isProfit ? '▲' : '▼'}${net_change.toFixed(2)} (
            {percent_change.toFixed(2)}
            %)
          </ListItem.Subtitle>
        </ListItem.Content>
        <ListItem.Title
          style={[
            {backgroundColor: profit_style, color: theme.foregroundColor},
            styles.sell,
          ]}>
          {sell_order.side} $
          {sell_order.sale_amount_minus_commission.toFixed(2)}
        </ListItem.Title>
      </ListItem>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
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
