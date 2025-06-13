import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,  
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import * as Google from 'expo-auth-session/providers/google';
import { Platform } from 'react-native';
import Constants from 'expo-constants';
import * as AuthSession from 'expo-auth-session';
import { API_URL } from '../../config';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession();

const isInExpoGo = Constants.appOwnership === 'expo';

// Client ID para cada plataforma
const CLIENT_ID_IOS = '916278295990-4k1bs4hnhmjibloil2lhsh083ivbf1hk.apps.googleusercontent.com';
const CLIENT_ID_WEB = '916278295990-bh438sjqpfjmja0df5afmubvlroeq2ce.apps.googleusercontent.com';

// Función para decodificar JWT sin librerías
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error al decodificar el token:', e);
    return null;
  }
};

const LoginScreen = ({ setActiveContent }: { setActiveContent: (content: string) => void }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [emailError, setEmailError] = useState<boolean>(false);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [showAlertEmpty, setShowAlertEmpty] = useState<boolean>(false);
  const [showAlertSuccess, setShowAlertSuccess] = useState<boolean>(false);
  const [showAlertFail, setShowAlertFail] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(false);
  
  /*const redirectUri = AuthSession.makeRedirectUri({
    useProxy: true, // 👈🏼 OBLIGATORIO EN EXPO GO
  });*/


  const redirectUri = AuthSession.makeRedirectUri({
    native: 'com.googleusercontent.apps.916278295990-bh438sjqpfjmja0df5afmubvlroeq2ce:/oauthredirect',
    useProxy: true,
  });


  const [request, response, promptAsync] = Google.useAuthRequest({
    clientId: '916278295990-bh438sjqpfjmja0df5afmubvlroeq2ce.apps.googleusercontent.com', // ID de cliente web
    redirectUri: AuthSession.makeRedirectUri({
      useProxy: true, // 👈🏼 OBLIGATORIO EN EXPO GO
    }),
    scopes: ['openid', 'profile', 'email'],
  });
  
  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        handleGoogleToken(idToken);
      }
    }
  }, [response]);

  const handleGoogleToken = async (idToken: string) => {
    try {
      const res = await axios.post(`${API_URL}/auth/google/token`, { idToken });
      const { jwt } = res.data;
      const decoded = parseJwt(jwt);
      await AsyncStorage.setItem('userToken', jwt);
      await AsyncStorage.setItem('decodedToken', JSON.stringify(decoded));
      setShowAlertSuccess(true);
    } catch (e) {
      console.error('Error al loguear con Google:', e);
      setShowAlertFail(true);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    const isEmailEmpty = username.trim() === '';
    const isPasswordEmpty = password.trim() === '';
    setEmailError(isEmailEmpty);
    setPasswordError(isPasswordEmpty);

    if (isEmailEmpty || isPasswordEmpty) {
      setShowAlertEmpty(true);
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email: username,
        contraseña: password
      });

      if (response.status === 200 || response.status === 201) {
        const token = response.data.jwt;
        if (!token) throw new Error('Token faltante');
        const decoded = parseJwt(token);
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('decodedToken', JSON.stringify(decoded));
        setShowAlertSuccess(true);
      } else {
        setShowAlertFail(true);
      }
    } catch (e) {
      console.error('Error al iniciar sesión:', e);
      setShowAlertFail(true);
    } finally {
      setLoading(false);
    }
  };

  const goToHomeScreen = () => setActiveContent('home');
  const goToRegisterScreen = () => setActiveContent('register');
  const goToRecoverScreen = () => setActiveContent('recover');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground source={require('../../assets/img/backgroundLogIn.png')} style={styles.background}>
        <View style={styles.container}>
          <Image source={require('../../assets/img/logoNew.png')} style={styles.logo} resizeMode="contain" />

          <TouchableOpacity style={styles.googlebutton} onPress={() => promptAsync()}>
            <Image source={require('../../assets/img/google.png')} style={styles.googleImage} resizeMode="contain" />
            <Text style={styles.googleButtonText}>Continuar con Google</Text>
          </TouchableOpacity>

          <Text style={styles.textForm}>Email</Text>
          <View style={[styles.inputWithIcon, emailError && styles.inputError]}>
            <MaterialIcons name="email" size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder="ejemplo@correo.com"
              placeholderTextColor="#888"
              style={styles.input}
              value={username}
              onChangeText={text => {
                setUsername(text);
                setEmailError(false);
              }}
            />
          </View>

          <Text style={styles.textForm}>Contraseña</Text>
          <View style={[styles.inputWithIcon, passwordError && styles.inputError]}>
            <MaterialIcons name="lock" size={20} color="#666" style={styles.icon} />
            <TextInput
              placeholder="******"
              placeholderTextColor="#888"
              secureTextEntry
              style={styles.input}
              value={password}
              onChangeText={text => {
                setPassword(text);
                setPasswordError(false);
              }}
            />
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Ingresar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.recoverPasswordButton} onPress={goToRecoverScreen}>
            <Text style={styles.recoverPasswordText}>Olvidé mi contraseña</Text>
          </TouchableOpacity>

          <Text style={styles.registerText}>¿Todavía no tenés cuenta?</Text>
          <TouchableOpacity style={styles.registerButton} onPress={goToRegisterScreen}>
            <Text style={styles.registerButtonText}>Registrarse</Text>
          </TouchableOpacity>

          <Modal transparent visible={showAlertEmpty}>
            <View style={styles.modalView}>
              <View style={styles.alertView}>
                <Text style={styles.alertTitle}>Campos incompletos</Text>
                <Text style={styles.alertMessage}>Por favor, complete todos los campos.</Text>
                <TouchableOpacity onPress={() => setShowAlertEmpty(false)} style={styles.alertButton}>
                  <Text style={styles.alertButtonText}>Volver</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal transparent visible={showAlertSuccess}>
            <View style={styles.modalView}>
              <View style={styles.alertView}>
                <Text style={styles.alertTitle}>Inicio de sesión exitoso</Text>
                <TouchableOpacity onPress={() => { setShowAlertSuccess(false); goToHomeScreen(); }} style={styles.alertButton}>
                  <Text style={styles.alertButtonText}>Continuar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal transparent visible={showAlertFail}>
            <View style={styles.modalView}>
              <View style={styles.alertView}>
                <Text style={styles.alertTitle}>Oh no! Algo salió mal!</Text>
                <Text style={styles.alertMessage}>El email y/o la contraseña son incorrectos. Intente nuevamente.</Text>
                <TouchableOpacity onPress={() => setShowAlertFail(false)} style={styles.alertButton}>
                  <Text style={styles.alertButtonText}>Volver</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </View>
      </ImageBackground>

    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  background: { flex: 1, resizeMode: 'cover', justifyContent: 'center' },
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  logo: { width: 250, height: 150, marginBottom: 15 },
  googlebutton: {
    width: '80%', flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    backgroundColor: '#FFFFFF', borderRadius: 25, marginTop: 20, marginBottom: 30,
    paddingVertical: 10, paddingHorizontal: 20,
    shadowColor: '#000000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.75,
    shadowRadius: 3.84, elevation: 5,
  },
  googleImage: { width: 32, height: 32, marginRight: 20 },
  googleButtonText: { color: '#000000', fontSize: 20, fontWeight: 'bold' },
  textForm: {
    width: '80%', textAlign: 'left', fontSize: 20, color: '#D9D9D9',
    fontWeight: 'bold', marginLeft: 15,
  },
  registerButton: {},
  button: {
    color: '#F5F5F5', marginTop: 20, fontSize: 20, width: '50%', height: 35,
    backgroundColor: '#A01BAC', justifyContent: 'center', alignItems: 'center',
    borderRadius: 25, shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.75,
    shadowRadius: 3.84, elevation: 5,
  },
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  recoverPasswordButton: { marginTop: 10, marginBottom: 20 },
  recoverPasswordText: { color: '#FF8BFA', fontSize: 20, fontWeight: 'bold' },
  registerText: { color: '#FFFFFF', fontSize: 20, fontWeight: 'bold' },
  registerButtonText: { color: '#FF8BFA', fontSize: 20, fontWeight: 'bold' },
  modalView: {
    flex: 1, justifyContent: 'center', alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertView: {
    backgroundColor: '#FFFCE3', padding: 20, borderRadius: 10,
    alignItems: 'center', width: '80%',
  },
  alertTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  alertMessage: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  alertButton: {
    backgroundColor: '#A01BAC',
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  alertButtonText: { fontSize: 18, color: 'white', fontWeight: 'bold' },
  inputError: { borderColor: 'red', borderWidth: 2 },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '80%',
    height: 42,
    backgroundColor: '#D9D9D9',
    borderRadius: 25,
    paddingHorizontal: 14,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
    paddingVertical: 0,
    borderWidth: 0,
    backgroundColor: 'transparent',
    width: '100%'
  },
  icon: { marginRight: 10 },
  inputFocused: { borderWidth: 2, borderColor: '#888' },
});

export default LoginScreen;