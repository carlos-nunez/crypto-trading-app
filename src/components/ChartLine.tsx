import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import {useColorScheme} from 'react-native';
import moment from 'moment';
import {light, dark} from '../styles/defaultStyles';

const window = Dimensions.get('window');

interface IChartLineProps {
  value: {x: number; y: number; z: number};
  position: {x: number; y: number};
}
const ChartLine = ({value, position}: IChartLineProps) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme == 'light' ? light : dark;
  let leftOffset = position.x;

  if (position.x > window.width - 190) {
    leftOffset = window.width - 190;
  }

  return (
    <>
      <View style={{position: 'absolute', left: leftOffset, width: 300}}>
        <Text style={{color: theme.textColor}}>{moment.unix(value.z).format('LL hh:mm a')}</Text>
      </View>
      <View
        style={{
          width: 2,
          height: 100,
          backgroundColor: colorScheme === 'light' ? 'rgba(0,0,0, .1) ' : 'rgba(255,255,255, .2)',
          position: 'absolute',
          left: position.x,
          top: position.y - 50,
        }}
      />
    </>
  );
};

export default ChartLine;
