import axios from 'axios';
import {AsyncStorage} from 'react-native';

var URL = 'https://crypto-trading-algorithm-api.herokuapp.com';

const instance = axios.create({
  baseURL: URL,
});

instance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (err) => {
    return Promise.reject(err);
  },
);

export default instance;
