import React from 'react';
import {StyleSheet, Text, View, TouchableOpacity, useColorScheme} from 'react-native';
import {light, dark} from '../styles/defaultStyles';

interface ITimePicker {
  time: string;
  setTime: React.Dispatch<React.SetStateAction<string>>;
  plStyle: string;
}
const TimePicker: React.FC<ITimePicker> = ({time, setTime, plStyle}) => {
  const colorScheme = useColorScheme();
  const theme = colorScheme == 'light' ? light : dark;
  const timeOptions = ['1D', '1W', '1M', '1Y', 'All'];

  return (
    <View
      style={[
        styles.container,
        {
          borderBottomColor: colorScheme == 'light' ? 'rgba(0,0,0,.2)' : 'rgba(255,255,255,.2)',
        },
      ]}
    >
      {timeOptions.map((timeOption) => (
        <TouchableOpacity
          style={{borderRadius: 10}}
          onPress={() => {
            setTime(timeOption);
          }}
        >
          <Text
            style={
              time == timeOption
                ? [styles.active, {backgroundColor: plStyle, color: theme.foregroundColor}]
                : [
                    styles.active,
                    {
                      backgroundColor: theme.foregroundColor,
                      color: theme.textColor2,
                    },
                  ]
            }
          >
            {timeOption}
          </Text>
        </TouchableOpacity>
      ))}
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
