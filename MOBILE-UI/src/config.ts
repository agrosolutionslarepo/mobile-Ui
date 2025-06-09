import { Platform } from 'react-native';

export const API_URL =
  Platform.OS === 'web'
    ? 'https://backend-agro-xmmx.onrender.com'
    : 'https://backend-agro-xmmx.onrender.com'; // ← IP de tu backend en red localgit 