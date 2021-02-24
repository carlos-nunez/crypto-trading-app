import React from 'react';
import {View, Text, Dimensions} from 'react-native';
import {Appearance, useColorScheme} from 'react-native';
import {light, dark} from '../styles/defaultStyles';
import moment from 'moment';
const window = Dimensions.get('window');

const ChartLine = ({value, position}) => {
  const colorScheme = useColorScheme();
  var theme = colorScheme == 'light' ? light : dark;
  var leftOffset = position.x;
  console.log(value);
  if (position.x > window.width - 190) {
    leftOffset = window.width - 190;
  }

  return (
    <>
      <View style={{position: 'absolute', left: leftOffset, width: 300}}>
        <Text style={{color: theme.textColor}}>
          {moment.unix(value.z).format('LL hh:mm a')}
        </Text>
      </View>
      <View
        style={{
          width: 2,
          height: 100,
          backgroundColor:
            colorScheme == 'light'
              ? 'rgba(0,0,0, .1) '
              : 'rgba(255,255,255, .2)',
          position: 'absolute',
          left: position.x,
          top: position.y - 50,
        }}
      />
    </>
  );
};

export default ChartLine;
