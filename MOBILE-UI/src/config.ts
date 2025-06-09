import { Platform } from 'react-native';

export const API_URL =
  Platform.OS === 'web'
    ? 'http://localhost:3000'
    : 'http://192.168.1.37:3000'; // ← IP de tu backend en red local