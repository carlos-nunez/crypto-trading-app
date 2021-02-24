import {ListItem, Avatar} from 'react-native-elements';
import React, {useState, useContext, useEffect} from 'react';
import {
  Dimensions,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import {Appearance, useColorScheme} from 'react-native';
import {light, dark} from '../styles/defaultStyles';
import moment from 'moment';

const TimePicker = ({setTime, time, plStyle}) => {
  const colorScheme = useColorScheme();

  var theme = colorScheme == 'light' ? light : dark;

  var options = ['1D', '1W', '1M', '1Y', 'All'];

  var eles = options.map((el) => (
    <TouchableOpacity
      style={{borderRadius: 10}}
      onPress={() => {
        setTime(el);
      }}>
      <Text
        style={
          time == el
            ? [
                styles.active,
                {backgroundColor: plStyle, color: theme.foregroundColor},
              ]
            : [
                styles.active,
                {
                  backgroundColor: theme.foregroundColor,
                  color: theme.textColor2,
                },
              ]
        }>
        {el}
      </Text>
    </TouchableOpacity>
  ));

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomColor:
            colorScheme == 'light' ? 'rgba(0,0,0,.2)' : 'rgba(255,255,255,.2)',
        },
      ]}>
      {eles}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 15,
    borderBottomWidth: 0.75,
    margin: 15,
    marginTop: 5,
  },
  active: {
    padding: 4,
    paddingLeft: 6,
    paddingRight: 6,
    fontWeight: '600',
    borderRadius: 5,
    overflow: 'hidden',
  },
});

export default TimePicker;