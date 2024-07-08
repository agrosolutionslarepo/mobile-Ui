import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image, Modal } from 'react-native';

const LoginScreen = ({ setActiveContent }: { setActiveContent: (content: string) => void }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showAlertEmpty, setShowAlertEmpty] = useState(false); // Estado para controlar si se muestra la alerta de falta de campos
  const [showAlertSuccess, setShowAlertSuccess] = useState(false); // Estado para controlar si se muestra la alerta de inicio de sesión exitoso
  const [showAlertFail, setShowAlertFail] = useState(false); // Estado para controlar si se muestra la alerta de inicio de sesión fallido

  const handleLogin = () => {
    if (username !== '' && password !== '' && username !== 'error') {
      setShowAlertSuccess(true); // Mostrar alerta de inicio de sesión exitoso
    } else if (username == 'error') {
      setShowAlertFail(true); // Mostrar alerta de inicio de sesión fallido
    } else {
      setShowAlertEmpty(true); // Mostrar alerta de falta de campos
    }
  };

  const goToHomeScreen = () => {
    setActiveContent('home')
  }

  const goToRegisterScreen = () => {
    setActiveContent('register')
  }

  const goToRecoverScreen = () => {
    setActiveContent('recover')
  }

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
          <Image source={require('../../assets/img/google.png')}
            style={styles.googleImage}
            resizeMode="contain" />
          <Text style={styles.googleButtonText}>Continuar con google</Text>
        </TouchableOpacity>

        <Text style={styles.textForm}>Usuario</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          value={username}
          onChangeText={setUsername}
        />

        <Text style={styles.textForm}>Contraseña</Text>
        <TextInput
          style={styles.input}
          placeholder=""
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Ingresar</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.recoverPasswordButton} onPress={goToRecoverScreen} >
          <Text style={styles.recoverPasswordText}>Olvidé mi contraseña</Text>
        </TouchableOpacity>

        <Text style={styles.registerText}>¿Todavia no tenes cuenta?</Text>

        <TouchableOpacity style={styles.registerButton} onPress={goToRegisterScreen}>
          <Text style={styles.registerButtonText}>Registrarse</Text>
        </TouchableOpacity>

        {/* Modal para la alerta de falta de campos*/}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showAlertEmpty}
          onRequestClose={() => {
            setShowAlertEmpty(false);
          }}
        >
          <View style={styles.modalView}>
            <View style={styles.alertView}>
              <Text style={styles.alertTitle}>Campos incompletos</Text>
              <Text style={styles.alertMessage}>Por favor, complete todos los campos.</Text>
              <TouchableOpacity
                onPress={() => setShowAlertEmpty(false)}
                style={styles.alertButton}
              >
                <Text style={styles.alertButtonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal para la alerta de inicio de sesión exitoso*/}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showAlertSuccess}
          onRequestClose={() => {
            setShowAlertSuccess(false);
          }}
        >
          <View style={styles.modalView}>
            <View style={styles.alertView}>
              <Text style={styles.alertTitle}>Inicio de sesión exitoso</Text>
              <TouchableOpacity
                onPress={goToHomeScreen}
                style={styles.alertButton}
              >
                <Text style={styles.alertButtonText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal para la alerta de inicio de sesión fallido*/}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showAlertFail}
          onRequestClose={() => {
            setShowAlertFail(false);
          }}
        >
          <View style={styles.modalView}>
            <View style={styles.alertView}>
              <Text style={styles.alertTitle}>Oh no! Algo salio mal!</Text>
              <Text style={styles.alertMessage}>El nombre de usuario y/o la contraseña son incorrectos. <br />Intentelo nuevamente.</Text>
              <TouchableOpacity
                onPress={() => setShowAlertFail(false)}
                style={styles.alertButton}
              >
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
    marginBottom: 15
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

    paddingTop: 10,
    paddingBottom: 10,

    paddingLeft: 20,
    paddingRight: 20,

    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5,
  },

  googleImage: {
    width: 32,
    height: 32,
    marginRight: 20
  },

  googleButtonText: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold'
  },

  textForm: {
    width: '80%',
    textAlign: 'left',
    fontSize: 20,
    color: '#D9D9D9',
    fontWeight: 'bold',
    marginLeft: 15
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
    marginBottom: 20
  },

  recoverPasswordText: {
    color: '#FF8BFA',
    fontSize: 20,
    fontWeight: 'bold'
  },

  registerText: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold'
  },

  registerButton: {

  },

  registerButtonText: {
    color: '#FF8BFA',
    fontSize: 20,
    fontWeight: 'bold'
  },

  // Estilos para las alertas
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
  },

  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },

  alertMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
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

});

export default LoginScreen;

