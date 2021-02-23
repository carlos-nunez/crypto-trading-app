import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import {Context as AlgoContext} from '../context/AlgoContext';
import {ListItem} from 'react-native-elements';
import Trade from '../components/Trade';
import {LineChart} from 'react-native-chart-kit';
import {Appearance, useColorScheme} from 'react-native';
import {light, dark} from '../styles/defaultStyles';
import moment from 'moment';

const window = Dimensions.get('window');
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
    return (
      <>
        <Trade order={item} />
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

  var plStyle =
    capital_history[capital_history.length - 1].capital -
      capital_history[capital_history.length - 2].capital >
    0
      ? theme.green
      : theme.red;

  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.foregroundColor}]}>
      <FlatList
        onRefresh={async () => {
          setIsFetching(true);
          await fetchHelper();
          setIsFetching(false);
        }}
        refreshing={isFetching}
        ListHeaderComponent={
          <>
            <Text
              style={[
                styles.capital,
                {color: theme.textColor2, marginTop: 25},
              ]}>
              Investing
            </Text>
            <Text
              style={[
                styles.capital,
                {color: theme.textColor2, marginBottom: 30},
              ]}>
              ${keys[keys.length - 1].toFixed(2)}
            </Text>
            <LineChart
              data={{
                labels: labels,
                datasets: [
                  {
                    data: keys,
                    color: (opacity = 1) => plStyle, // optional
                    strokeWidth: 2,
                  },
                ],
              }}
              width={Dimensions.get('window').width} // from react-native
              height={230}
              withInnerLines={false}
              yAxisLabel="$"
              yAxisSuffix=""
              yAxisInterval={1} // optional, defaults to 1
              chartConfig={{
                backgroundColor: theme.foregroundColor,
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
                  borderRadius: 0,
                },
                fillShadowGradient: plStyle,
                propsForDots: {
                  r: '4',
                  strokeWidth: '1',
                  stroke: '1',
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
    </SafeAreaView>
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
});

export default HomeScreen;
