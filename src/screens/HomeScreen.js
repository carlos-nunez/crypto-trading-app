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
import {
  Chart,
  Line,
  Area,
  HorizontalAxis,
  VerticalAxis,
  Tooltip,
} from 'react-native-responsive-linechart';

const window = Dimensions.get('window');

const LineInfo = ({value, position}) => {
  const colorScheme = useColorScheme();

  var theme = colorScheme == 'light' ? light : dark;
  return (
    <>
      <View style={{position: 'absolute', left: position.x, width: 300}}>
        <Text style={{color: theme.textColor}}>
          {moment.unix(value.x).format('LL')}
        </Text>
      </View>
      <View
        style={{
          width: 2,
          height: 100,
          backgroundColor: 'rgba(255,255,255, .3)',
          position: 'absolute',
          left: position.x,
          top: position.y - 50,
        }}
      />
    </>
  );
};

const HomeScreen = () => {
  const {state, getTrades, getCapitalHistory} = useContext(AlgoContext);
  const {trades, capital_history} = state;
  const [isFetching, setIsFetching] = useState(true);
  const colorScheme = useColorScheme();

  var theme = colorScheme == 'light' ? light : dark;

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

  var labels = capital_history.map((cap) => {
    if (Number(moment(cap.utc_time).format('DD')) % 2 == 0)
      return moment(cap.utc_time).format('MM/DD');

    return '';
  });

  var keys = capital_history.map((cap) => {
    return cap.capital;
  });

  var data2 = capital_history.map((cap) => {
    return {x: moment(cap.utc_time).unix(), y: cap.capital};
  });

  var DAT = [];

  for (var i = 0; i < 30; i++) {
    DAT.push({x: 100 + i, y: i + 300 + Math.random() * 10});
  }

  var getMaxMin = (data) => {
    var maxX = 0,
      maxY = 0;

    var minX = data[0].x,
      minY = data[0].y;

    data.forEach((item, i) => {
      if (item.x > maxX) maxX = item.x;
      if (item.y > maxY) maxY = item.y;
      if (item.x < minX) minX = item.x;
      if (item.y < minY) minY = item.y;
    });

    return {maxX, maxY, minY, minX};
  };

  DAT = data2;

  const [balance, setBalance] = useState(0);

  useEffect(() => {
    isFetching == false ? setBalance(keys[keys.length - 1].toFixed(2)) : null;
  }, [isFetching]);

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
      <Text style={[styles.capital, {color: theme.textColor2, marginTop: 25}]}>
        Investing
      </Text>
      <Text
        style={[styles.capital, {color: theme.textColor2, marginBottom: 30}]}>
        ${balance}
      </Text>

      <FlatList
        onRefresh={async () => {
          setIsFetching(true);
          await fetchHelper();
          setIsFetching(false);
        }}
        refreshing={isFetching}
        ListHeaderComponent={
          <>
            <Chart
              style={{height: 230, width: '100%', marginTop: 1}}
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
                  setBalance([keys[keys.length - 1].toFixed(2)]);
                }}
                onTooltipSelect={({x, y}) => {
                  console.log(x, y);
                  setBalance(y.toFixed(2));
                }}
                smoothing={'cubic-spline'}
                theme={{stroke: {color: plStyle, width: 1.5}}}
                tooltipComponent={<LineInfo />}
              />
            </Chart>
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
    fontSize: 32,
    paddingLeft: 15,
    color: 'white',
    fontWeight: '400',
  },
});

export default HomeScreen;
