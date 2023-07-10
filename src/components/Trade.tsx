import React from 'react';
import {StyleSheet, View, useColorScheme} from 'react-native';
import {light, dark} from '../styles/defaultStyles';
import {ITradeProps} from '../interfaces/AlgoInterfaces';
import BuyOrder from './BuyOrder';
import SellOrder from './SellOrder';

const Trade: React.FC<ITradeProps> = ({order}) => {
  const theme = useColorScheme() == 'light' ? light : dark;

  return (
    <View style={[{backgroundColor: theme.foregroundColor}, styles.container]}>
      <BuyOrder order={order} />
      {order[1] && <SellOrder order={order} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 5,
    paddingBottom: 5,
    borderRadius: 10,
  },
});

export default Trade;
