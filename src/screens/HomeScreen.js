import React, {useState, useContext, useEffect} from 'react';
import {
  View,
  Text,
  FlatList,
  Dimensions,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  Appearance,
  useColorScheme,
} from 'react-native';
import {ListItem} from 'react-native-elements';
import moment from 'moment';
import {
  Chart,
  Line,
  Area,
  HorizontalAxis,
  VerticalAxis,
  Tooltip,
} from 'react-native-responsive-linechart';

import Trade from '../components/Trade';
import TimePicker from '../components/TimePicker';
import ChartLine from '../components/ChartLine';
import {light, dark} from '../styles/defaultStyles';
import {Context as AlgoContext} from '../context/AlgoContext';
const window = Dimensions.get('window');

const HomeScreen = () => {
  /** Global State **/
  const {state, getTrades, getCapitalHistory} = useContext(AlgoContext);
  const {trades, capital_history} = state;

  /**Local State**/
  const [isFetching, setIsFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(0);
  const [time, setTime] = useState('1D');

  /**Dark/Light Theme Hook**/
  const colorScheme = useColorScheme();
  var theme = colorScheme == 'light' ? light : dark;

  /** Helper Functions **/
  const fetchHelper = async () => {
    await getTrades();
    await getCapitalHistory();
    setIsFetching(false);
  };

  /**
  Gets the max/min y and x values of an array
  @param data array of {x, y} values
  @returns {maxX, maxY, minX, minY}
  **/
  var getMaxMin = (data) => {
    var maxX = 0,
      maxY = 0,
      minX = data[0].x,
      minY = data[0].y;

    data.forEach((item, i) => {
      if (item.x > maxX) maxX = item.x;
      if (item.y > maxY) maxY = item.y;
      if (item.x < minX) minX = item.x;
      if (item.y < minY) minY = item.y;
    });

    return {maxX, maxY, minY, minX};
  };

  console.log(capital_history);

  /**
  Renders the trade item
  @param order tuple of [buy, sell] orders
  @returns Trade element
  **/
  const renderItem = ({item}) => {
    return (
      <View
        style={{
          backgroundColor: theme.backgroundColor,
          paddingTop: 1,
          paddingBottom: 1,
          marginBottom: 0,
        }}>
        <Trade order={item} />
      </View>
    );
  };

  /**Side Effects**/

  /**Initial Data Fetch**/
  useEffect(() => {
    fetchHelper();
  }, []);

  /**Update the Balance After isFetching is Finished**/
  useEffect(() => {
    isFetching == false
      ? setBalance(
          capital_history[capital_history.length - 1].capital.toFixed(2),
        )
      : null;
  }, [isFetching]);

  /**Data Organization**/
  var data2 = capital_history.map((cap) => {
    return {x: moment(cap.utc_time).unix(), y: cap.capital};
  });

  /**Variables**/
  var DAT = [];
  DAT = data2;

  /**Loading**/
  if (isFetching) {
    return (
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.foregroundColor,
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}>
        <ActivityIndicator />
      </View>
    );
  }

  var plStyle = capital_history
    ? capital_history[0].capital - capital_history[1].capital > 0
      ? theme.green
      : theme.red
    : theme.green;

  /**Done Loading**/
  return (
    <SafeAreaView
      style={[styles.container, {backgroundColor: theme.foregroundColor}]}>
      <FlatList
        onRefresh={async () => {
          setRefreshing(true);
          await fetchHelper();
          setRefreshing(false);
        }}
        refreshing={refreshing}
        ListHeaderComponent={
          <>
            <Text
              style={[
                styles.capital,
                {color: theme.textColor2, marginTop: 25},
              ]}>
              Capital
            </Text>
            <Text
              style={[
                styles.capital,
                {color: theme.textColor2, marginBottom: 30},
              ]}>
              ${balance}
            </Text>
            <Chart
              style={{height: 175, width: '100%', marginTop: 1}}
              data={DAT}
              padding={{left: 0, bottom: 20, right: 2, top: 0}}
              xDomain={{
                min: getMaxMin(DAT).minX,
                max: getMaxMin(DAT).maxX + 20,
              }}
              yDomain={{
                min: getMaxMin(DAT).minY - 3,
                max: getMaxMin(DAT).maxY + 3,
              }}>
              <VerticalAxis
                tickCount={10}
                theme={{
                  grid: {visible: false},
                  axis: {visible: false, stroke: {color: '#aaa', width: 2}},
                  ticks: {visible: false, stroke: {color: '#aaa', width: 2}},
                  labels: {
                    visible: false,
                    formatter: (v: number) => v.toFixed(2),
                  },
                }}
              />
              <HorizontalAxis
                tickCount={9}
                theme={{
                  grid: {visible: false},
                  axis: {visible: false, stroke: {color: '#aaa', width: 2}},
                  ticks: {visible: false, stroke: {color: '#aaa', width: 2}},
                  labels: {
                    visible: false,
                    label: {rotation: 0},
                    formatter: Math.round,
                  },
                }}
              />
              <Area
                smoothing={'cubic-spline'}
                theme={{
                  gradient: {
                    from: {
                      color: theme.foregroundColor,
                      opacity: 0.6,
                    },
                    to: {
                      color: theme.foregroundColor,
                      opacity: 0.05,
                    },
                  },
                }}
              />
              <Line
                hideTooltipOnDragEnd={true}
                onTooltipSelectEnd={() => {
                  setBalance([
                    capital_history[capital_history.length - 1].capital.toFixed(
                      2,
                    ),
                  ]);
                }}
                onTooltipSelect={({x, y}) => {
                  console.log(x, y);
                  setBalance(y.toFixed(2));
                }}
                smoothing={'cubic-spline'}
                theme={{stroke: {color: plStyle, width: 1.5}}}
                tooltipComponent={<ChartLine />}
              />
            </Chart>
            <TimePicker time={time} setTime={setTime} plStyle={plStyle} />
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
  },
  capital: {
    paddingTop: 0,
    fontSize: 34,
    paddingLeft: 15,
    color: 'white',
    fontWeight: '500',
  },
});

export default HomeScreen;
