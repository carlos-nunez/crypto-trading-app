import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
} from 'react-native';
import {Context as AlgoContext} from '../context/AlgoContext';
import {ListItem, Avatar} from 'react-native-elements';
const window = Dimensions.get('window');
import {LineChart} from 'react-native-chart-kit';
import {Appearance, useColorScheme} from 'react-native';
import {light, dark} from '../styles/defaultStyles';

import moment from 'moment';
const HomeScreen = () => {
  const {state, getTrades, getCapitalHistory} = useContext(AlgoContext);
  const {trades, capital_history} = state;
  const [isFetching, setIsFetching] = useState(true);
  const colorScheme = useColorScheme();

  var theme = colorScheme == 'light' ? light : dark;
  console.log(theme);

  const fetchHelper = async () => {
    await getTrades();
    await getCapitalHistory();
    setIsFetching(false);
  };

  useEffect(() => {
    fetchHelper();
  }, []);

  const renderItem = ({item}) => {
    var net_change =
      item[1].sale_amount_minus_commission -
      item[0].purchase_amount_minus_commission;

    var isProfit = net_change > 0;

    var profit_style = isProfit ? styles.green : styles.red;

    const data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June'],
      datasets: [
        {
          data: [20, 45, 28, 80, 99, 43],
          color: (opacity = 1) => `rgba(134, 65, 244, ${opacity})`, // optional
          strokeWidth: 2, // optional
        },
      ],
      legend: ['Rainy Days'], // optional
    };

    return (
      <>
        <Text style={[styles.time, {color: theme.textColor}]}>
          {moment(item[0].transaction_time).format('hh:mm:ss a - LL')}
        </Text>
        <ListItem
          containerStyle={[
            styles.listItem,
            {backgroundColor: theme.foregroundColor},
          ]}
          key={0}>
          <ListItem.Content>
            <ListItem.Title style={{color: theme.textColor2}}>
              {item[0].asset} @ ${item[0].average_price_of_asset}
            </ListItem.Title>
            <ListItem.Subtitle style={{color: theme.textColor}}>
              Allocated: ${item[0].purchase_amount_minus_commission}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Title style={{color: theme.textColor2}}>
            {item[0].side}
          </ListItem.Title>
        </ListItem>

        <Text style={[styles.time, {color: theme.textColor}]}>
          {moment(item[1].transaction_time).format('hh:mm:ss a - LL')}
        </Text>
        <ListItem
          containerStyle={[
            styles.listItem,
            {backgroundColor: theme.foregroundColor},
          ]}
          key={0}>
          <ListItem.Content>
            <ListItem.Title style={{color: theme.textColor2}}>
              {item[1].asset} @ ${item[1].average_price_of_asset}
            </ListItem.Title>
            <ListItem.Subtitle style={profit_style}>
              Sold for: ${item[1].sale_amount_minus_commission} P/L:{' '}
              {isProfit ? '+' : '-'}${net_change}
            </ListItem.Subtitle>
          </ListItem.Content>
          <ListItem.Title style={profit_style}>{item[1].side}</ListItem.Title>
        </ListItem>
      </>
    );
  };

  console.log('TRADES ------------', trades);
  console.log('CAPITALS ----------', capital_history);

  var labels = capital_history.map((cap) => {
    return moment(cap.utc_time).format('MM/DD');
  });

  var keys = capital_history.map((cap) => {
    return cap.capital;
  });

  if (isFetching && keys.length == 0) {
    return (
      <View
        style={[styles.container, {backgroundColor: theme.foregroundColor}]}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <View style={[styles.container, {backgroundColor: theme.foregroundColor}]}>
      <FlatList
        onRefresh={async () => {
          setIsFetching(true);
          await fetchHelper();
          setIsFetching(false);
        }}
        refreshing={isFetching}
        ListHeaderComponent={
          <>
            <Text style={[styles.capital, {color: theme.textColor2}]}>
              Current Balance: ${keys[keys.length - 1]}
            </Text>
            <LineChart
              data={{
                labels: labels,
                datasets: [
                  {
                    data: keys,
                    color: (opacity = 1) => theme.green, // optional
                    stroke: 1,
                  },
                ],
              }}
              width={Dimensions.get('window').width} // from react-native
              height={220}
              yAxisLabel="$"
              yAxisSuffix=""
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: 'green',
                backgroundGradientFrom: theme.foregroundColor,
                backgroundGradientTo: theme.foregroundColor,
                decimalPlaces: 2, // optional, defaults to 2dp
                color: (opacity = 1) =>
                  colorScheme == 'dark'
                    ? `rgba(255,255,255, ${opacity})`
                    : `rgba(0,0,0, ${opacity})`,
                labelColor: (opacity = 1) =>
                  colorScheme == 'dark'
                    ? `rgba(255,255,255, ${opacity})`
                    : `rgba(0,0,0, ${opacity})`,
                style: {
                  borderRadius: 16,
                },
                propsForDots: {
                  r: '6',
                  strokeWidth: '2',
                  stroke: '',
                },
              }}
              bezier
              style={{
                marginVertical: 0,
                borderRadius: 0,
              }}
            />
          </>
        }
        data={trades}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
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
    paddingTop: 15,
    fontSize: 20,
    textAlign: 'center',
    color: 'white',
    fontWeight: '600',
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
  time: {
    fontWeight: '600',
    paddingTop: 10,
    paddingLeft: 15,
  },
});

export default HomeScreen;
