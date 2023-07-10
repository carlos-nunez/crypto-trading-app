import 'react-native-gesture-handler';
import * as React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import HomeScreen from './src/screens/HomeScreen';
import {Provider as AlgoProvider} from './src/context/AlgoContext';
import {light, dark} from './src/styles/defaultStyles';
import {useColorScheme} from 'react-native';

const Stack = createStackNavigator();

function App() {
  const theme = useColorScheme() === 'light' ? light : dark;

  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{
            headerTransparent: true,
            headerTitle: '',
            headerTitleStyle: {color: theme.backgroundColor},
            headerStyle: {
              backgroundColor: theme.green,
            },
          }}
          name="Home"
          component={HomeScreen}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default () => {
  return (
    <AlgoProvider>
      <App />
    </AlgoProvider>
  );
};
