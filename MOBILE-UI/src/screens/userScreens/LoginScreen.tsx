import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ImageBackground,
  Image,
  Modal
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ setActiveContent }: { setActiveContent: (content: string) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState(false);
  const [passwordError, setPasswordError] = useState(false);
  const [showAlertEmpty, setShowAlertEmpty] = useState(false);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertFail, setShowAlertFail] = useState(false);

  const handleLogin = async () => {
    const isEmailEmpty = username.trim() === '';
    const isPasswordEmpty = password.trim() === '';
    setEmailError(isEmailEmpty);
    setPasswordError(isPasswordEmpty);

    if (isEmailEmpty || isPasswordEmpty) {
      setShowAlertEmpty(true);
      return;
    }

    try {
      const response = await axios.post('http://localhost:3000/login', {
        email: username,
        contraseña: password
      });

      if (response.status === 200 || response.status === 201) {
        const { token, usuario } = response.data;
        await AsyncStorage.setItem('userToken', token);
        await AsyncStorage.setItem('userData', JSON.stringify(usuario));
        setShowAlertSuccess(true);
      } else {
        setShowAlertFail(true);
      }
    } catch (error) {
      console.error('Error al iniciar sesión:', error);
      setShowAlertFail(true);
    }
  };

  const goToHomeScreen = () => setActiveContent('home');
  const goToRegisterScreen = () => setActiveContent('register');
  const goToRecoverScreen = () => setActiveContent('recover');

  return (
    <ImageBackground
      source={require('../../assets/img/backgroundLogIn.png')}
      style={styles.background}
    >
      <View style={styles.container}>
        <Image
          source={require('../../assets/img/logoNew.png')}
          style={styles.logo}
          resizeMode="contain"
        />

        <TouchableOpacity style={styles.googlebutton} onPress={goToHomeScreen}>
          <Image
            source={require('../../assets/img/google.png')}
            style={styles.googleImage}
            resizeMode="contain"
          />
          <Text style={styles.googleButtonText}>Continuar con google</Text>
        </TouchableOpacity>

        <Text style={styles.textForm}>Email</Text>
        <TextInput
          style={[styles.input, emailError && styles.inputError]}
          placeholder="ejemplo@correo.com"
          placeholderTextColor="#999"
          value={username}
          onChangeText={text => {
            setUsername(text);
            setEmailError(false);
          }}
        />

        <Text style={styles.textForm}>Contraseña</Text>
        <TextInput
          style={[styles.input, passwordError && styles.inputError]}
          placeholder="******"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={text => {
            setPassword(text);
            setPasswordError(false);
          }}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.recoverPasswordButton} onPress={goToRecoverScreen}>
          <Text style={styles.recoverPasswordText}>Olvidé mi contraseña</Text>
        </TouchableOpacity>

        <Text style={styles.registerText}>¿Todavía no tenés cuenta?</Text>
        <TouchableOpacity style={styles.registerButton} onPress={goToRegisterScreen}>
          <Text style={styles.registerButtonText}>Registrarse</Text>
        </TouchableOpacity>

        {/* Modales de alerta */}
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
              <TouchableOpacity
                onPress={() => {
                  setShowAlertSuccess(false);
                  goToHomeScreen();
                }}
                style={styles.alertButton}
              >
                <Text style={styles.alertButtonText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal transparent visible={showAlertFail}>
          <View style={styles.modalView}>
            <View style={styles.alertView}>
              <Text style={styles.alertTitle}>Oh no! Algo salió mal!</Text>
              <Text style={styles.alertMessage}>
                El email y/o la contraseña son incorrectos. Intente nuevamente.
              </Text>
              <TouchableOpacity onPress={() => setShowAlertFail(false)} style={styles.alertButton}>
                <Text style={styles.alertButtonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    resizeMode: 'cover',
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: 250,
    height: 150,
    marginBottom: 15,
  },
  googlebutton: {
    width: '80%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 25,
    marginTop: 20,
    marginBottom: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5,
  },
  googleImage: {
    width: 32,
    height: 32,
    marginRight: 20,
  },
  googleButtonText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
  },
  textForm: {
    width: '80%',
    textAlign: 'left',
    fontSize: 20,
    color: '#D9D9D9',
    fontWeight: 'bold',
    marginLeft: 15,
  },
  input: {
    width: '80%',
    height: 35,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#D9D9D9',
    borderRadius: 25,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5,
  },
  registerButton: {

  },
  button: {
    color: '#F5F5F5',
    marginTop: 20,
    fontSize: 20,
    width: '50%',
    height: 35,
    backgroundColor: '#A01BAC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  recoverPasswordButton: {
    marginTop: 10,
    marginBottom: 20,
  },
  recoverPasswordText: {
    color: '#FF8BFA',
    fontSize: 20,
    fontWeight: 'bold',
  },
  registerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  registerButtonText: {
    color: '#FF8BFA',
    fontSize: 20,
    fontWeight: 'bold',
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  alertView: {
    backgroundColor: '#FFFCE3',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '80%',
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  alertButton: {
    backgroundColor: '#A01BAC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
  },
  alertButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
  },
});

export default LoginScreen;


