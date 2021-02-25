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
import getMaxMin from '../utils/chart_funcs';
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
  let theme = colorScheme == 'light' ? light : dark;

  /** Helper Functions **/
  const fetchHelper = async () => {
    await getTrades();
    await getCapitalHistory();
    setIsFetching(false);
  };

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
          paddingTop: 0,
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
  let data2 = capital_history.map((cap, i) => {
    return {x: i, y: cap.capital, z: moment(cap.utc_time).unix()};
  });

  /**Variables**/
  let DAT = [];
  DAT = data2;

  var plStyle =
    capital_history[0]?.capital - capital_history[1]?.capital > 0
      ? theme.green
      : theme.red;

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
              padding={{left: 0, bottom: 20, right: 0, top: 0}}
              xDomain={{
                min: getMaxMin(DAT).minX,
                max: getMaxMin(DAT).maxX,
              }}
              yDomain={{
                min: getMaxMin(DAT).minY,
                max: getMaxMin(DAT).maxY,
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
                hideTooltipAfter={100}
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
        data={[...trades].reverse()}
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
