import React, {useState, useEffect} from 'react';
import {View, Text, FlatList, StyleSheet, ActivityIndicator, SafeAreaView, useColorScheme} from 'react-native';
import moment from 'moment';
import {Chart, Line, Area, HorizontalAxis, VerticalAxis} from 'react-native-responsive-linechart';

import Trade from '../components/Trade';
import TimePicker from '../components/TimePicker';
import ChartLine from '../components/ChartLine';
import {light, dark} from '../styles/defaultStyles';
import {useAlgoContext} from '../context/AlgoContext';
import {getMaxMin} from '../utils/chart_funcs';
import {ICapital, ITrade} from '../interfaces/AlgoInterfaces';

const HomeScreen: React.FC = () => {
  /** Global State **/
  const {state, getTrades, getCapitalHistory} = useAlgoContext();
  const {trades, capital_history} = state;

  /**Local State**/
  const [isFetching, setIsFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [balance, setBalance] = useState(0);
  const [time, setTime] = useState('1D');

  /**Dark/Light Theme Hook**/
  const colorScheme = useColorScheme();
  const theme = colorScheme === 'light' ? light : dark;
  const dynamicStyles = styles(theme);

  /** Helper Functions **/
  const fetchHelper = async () => {
    await getTrades();
    await getCapitalHistory();
    setIsFetching(false);
  };

  /**Initial Data Fetch**/
  useEffect(() => {
    fetchHelper();
  }, []);

  /** Update the Balance After isFetching is Finished**/
  useEffect(() => {
    !isFetching ? setBalance(parseFloat(capital_history[capital_history.length - 1].capital.toFixed(2))) : null;
  }, [isFetching]);

  /** Data **/
  const data = capital_history.map((cap: ICapital, i: number) => {
    return {x: i, y: cap.capital, z: moment(cap.utc_time).unix()};
  });

  const plStyle = capital_history[0]?.capital - capital_history[1]?.capital > 0 ? theme.green : theme.red;

  if (isFetching) {
    return (
      <View style={dynamicStyles.container}>
        <ActivityIndicator />
      </View>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.container}>
      <FlatList
        onRefresh={async () => {
          setRefreshing(true);
          await fetchHelper();
          setRefreshing(false);
        }}
        refreshing={refreshing}
        ListHeaderComponent={
          <>
            <Text style={[dynamicStyles.capital, {color: theme.textColor2, marginTop: 25}]}>Capital</Text>
            <Text style={[dynamicStyles.capital, {color: theme.textColor2, marginBottom: 30}]}>${balance}</Text>
            <Chart
              style={{height: 175, width: '100%', marginTop: 1}}
              data={data}
              padding={{left: 0, bottom: 20, right: 0, top: 0}}
              xDomain={{
                min: getMaxMin(data).minX,
                max: getMaxMin(data).maxX,
              }}
              yDomain={{
                min: getMaxMin(data).minY,
                max: getMaxMin(data).maxY,
              }}
            >
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
                    formatter: (v: number) => v.toFixed(2),
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
                  const newBal = parseFloat(capital_history[capital_history.length - 1].capital.toFixed(2));
                  setBalance(newBal);
                }}
                onTooltipSelect={({x, y}) => {
                  setBalance(Number(y.toFixed(2)));
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
        renderItem={({item}: {item: ITrade}) => {
          return (
            <View style={dynamicStyles.tradeView}>
              <Trade order={item} />
            </View>
          );
        }}
        keyExtractor={(_, index) => index.toString()}
      />
    </SafeAreaView>
  );
};

const styles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.foregroundColor,
      justifyContent: 'center',
      alignItems: 'center',
    },
    capital: {
      paddingTop: 0,
      fontSize: 34,
      paddingLeft: 15,
      color: theme.text,
      fontWeight: '500',
    },
    tradeView: {
      backgroundColor: theme.backgroundColor,
      paddingTop: 0,
      paddingBottom: 1,
      marginBottom: 0,
    },
  });

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   capital: {
//     paddingTop: 0,
//     fontSize: 34,
//     paddingLeft: 15,
//     color: 'white',
//     fontWeight: '500',
//   },
// });

export default HomeScreen;
