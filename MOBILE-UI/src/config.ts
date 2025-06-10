import { Platform } from 'react-native';

export const API_URL =
  Platform.OS === 'web'
    ? 'https://backend-agro-2.onrender.com'
    : 'https://backend-agro-2.onrender.com'; // ← IP de tu backend en red localgit 