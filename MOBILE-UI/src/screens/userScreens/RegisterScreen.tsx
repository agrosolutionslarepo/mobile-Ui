import React, { useState } from 'react';
import axios from 'axios';
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
import AsyncStorage from '@react-native-async-storage/async-storage';

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

const RegisterScreen = ({ setActiveContent }: { setActiveContent: (content: string) => void }) => {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mail, setMail] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const [showAlertEmpty, setShowAlertEmpty] = useState(false);
  const [showAlertFail, setShowAlertFail] = useState(false);
  const [showAlertEmpresaCodigo, setShowAlertEmpresaCodigo] = useState(false);
  const [showSuccessFinal, setShowSuccessFinal] = useState(false);

  const [showEmpresaModal, setShowEmpresaModal] = useState(false);
  const [tipoRegistro, setTipoRegistro] = useState<'empresa' | 'codigo' | null>(null);
  const [empresaName, setEmpresaName] = useState('');
  const [codigoInvitacion, setCodigoInvitacion] = useState('');

  const [erroresCampos, setErroresCampos] = useState<{ [key: string]: boolean }>({});

  const validarDatos = () => {
    const errores: any = {};
    if (!name.trim()) errores.name = true;
    if (!lastname.trim()) errores.lastname = true;
    if (!username.trim()) errores.username = true;
    if (!password.trim()) errores.password = true;
    if (!mail.trim()) errores.mail = true;
    if (!birthdate.trim()) errores.birthdate = true;

    setErroresCampos(errores);

    if (Object.keys(errores).length > 0) {
      setShowAlertEmpty(true);
      return false;
    }
    return true;
  };

  const handleNextStep = () => {
    if (validarDatos()) {
      setShowEmpresaModal(true);
    }
  };

  const handleFinalSubmit = async () => {
    const payload: any = {
      nombre: name,
      apellido: lastname,
      nombreUsuario: username,
      contraseña: password,
      email: mail,
      fechaNacimiento: birthdate,
      estado: true
    };

    if (tipoRegistro === 'empresa') {
      if (!empresaName.trim()) {
        setErroresCampos((prev) => ({ ...prev, empresa: true }));
        return;
      }
      payload.empresaData = {
        nombreEmpresa: empresaName,
        estado: true
      };
    } else if (tipoRegistro === 'codigo') {
      if (!codigoInvitacion.trim()) {
        setErroresCampos((prev) => ({ ...prev, codigo: true }));
        return;
      }
      payload.codigoInvitacion = codigoInvitacion;
    }

    try {
      const response = await axios.post('http://localhost:3000/usuarios/registrarse', payload);

      if (response.status === 200 || response.status === 201) {
        // Guardar token y usuario en AsyncStorage
        const token = response.data.jwt;

        if (token) {
          const decodedToken = parseJwt(token);
          console.log('🔐 Token decodificado desde registro:', decodedToken);

          await AsyncStorage.setItem('userToken', token);
          if (decodedToken) {
            await AsyncStorage.setItem('decodedToken', JSON.stringify(decodedToken));
          }
        }



        setShowEmpresaModal(false);
        setShowSuccessFinal(true);
      } else {
        setShowEmpresaModal(false);
        setShowAlertFail(true);
      }
    } catch (error) {
      console.error('Error de conexión:', error);
      setShowEmpresaModal(false);
      setShowAlertFail(true);
    }
  };


  const goToLoginScreen = () => {
    setActiveContent('login');
  };

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

        <Text style={styles.textForm}>Nombre</Text>
        <TextInput
          placeholder="Ej: Juan"
          placeholderTextColor="#888"
          style={[styles.input, erroresCampos.name && styles.inputError]}
          value={name}
          onChangeText={(text) => {
            setName(text);
            setErroresCampos((prev) => ({ ...prev, name: false }));
          }}
        />

        <Text style={styles.textForm}>Apellido</Text>
        <TextInput
          placeholder="Ej: Pérez"
          placeholderTextColor="#888"
          style={[styles.input, erroresCampos.lastname && styles.inputError]}
          value={lastname}
          onChangeText={(text) => {
            setLastname(text);
            setErroresCampos((prev) => ({ ...prev, lastname: false }));
          }}
        />

        <Text style={styles.textForm}>Usuario</Text>
        <TextInput
          placeholder="Ej: juanperez99"
          placeholderTextColor="#888"
          style={[styles.input, erroresCampos.username && styles.inputError]}
          value={username}
          onChangeText={(text) => {
            setUsername(text);
            setErroresCampos((prev) => ({ ...prev, username: false }));
          }}
        />

        <Text style={styles.textForm}>Contraseña</Text>
        <TextInput
          placeholder="********"
          placeholderTextColor="#888"
          secureTextEntry={true}
          style={[styles.input, erroresCampos.password && styles.inputError]}
          value={password}
          onChangeText={(text) => {
            setPassword(text);
            setErroresCampos((prev) => ({ ...prev, password: false }));
          }}
        />

        <Text style={styles.textForm}>E-Mail</Text>
        <TextInput
          placeholder="Ej: juan@email.com"
          placeholderTextColor="#888"
          style={[styles.input, erroresCampos.mail && styles.inputError]}
          value={mail}
          onChangeText={(text) => {
            setMail(text);
            setErroresCampos((prev) => ({ ...prev, mail: false }));
          }}
        />

        <Text style={styles.textForm}>Fecha de nacimiento (AAAA-MM-DD)</Text>
        <TextInput
          placeholder="Ej: 2000-01-01"
          placeholderTextColor="#888"
          style={[styles.input, erroresCampos.birthdate && styles.inputError]}
          value={birthdate}
          onChangeText={(text) => {
            setBirthdate(text);
            setErroresCampos((prev) => ({ ...prev, birthdate: false }));
          }}
        />

        <TouchableOpacity style={styles.button} onPress={handleNextStep}>
          <Text style={styles.buttonText}>Siguiente</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.backButton} onPress={goToLoginScreen}>
          <Image
            source={require('../../assets/img/arrowLeft.png')}
            style={styles.backImage}
            resizeMode="contain"
          />
          <Text style={styles.backButtonText}>Volver</Text>
        </TouchableOpacity>
        {/* Modal campos vacíos */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showAlertEmpty}
          onRequestClose={() => setShowAlertEmpty(false)}
        >
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

        {/* Modal error */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showAlertFail}
          onRequestClose={() => setShowAlertFail(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.alertView}>
              <Text style={styles.alertTitle}>¡Error!</Text>
              <Text style={styles.alertMessage}>No se pudo completar el registro.</Text>
              <TouchableOpacity onPress={() => setShowAlertFail(false)} style={styles.alertButton}>
                <Text style={styles.alertButtonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal campos vacíos empresa/código */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showAlertEmpresaCodigo}
          onRequestClose={() => setShowAlertEmpresaCodigo(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.alertView}>
              <Text style={styles.alertTitle}>¡Falta información!</Text>
              <Text style={styles.alertMessage}>Completá el campo requerido para continuar.</Text>
              <TouchableOpacity
                onPress={() => setShowAlertEmpresaCodigo(false)}
                style={styles.alertButton}
              >
                <Text style={styles.alertButtonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal crear empresa / ingresar código */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showEmpresaModal}
          onRequestClose={() => setShowEmpresaModal(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.alertView}>
              {!tipoRegistro ? (
                <>
                  <Text style={styles.alertTitle}>¿Cómo querés continuar?</Text>
                  <TouchableOpacity
                    onPress={() => setTipoRegistro('empresa')}
                    style={styles.alertButton}
                  >
                    <Text style={styles.alertButtonText}>Crear Empresa</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setTipoRegistro('codigo')}
                    style={[styles.alertButton, { marginTop: 10, backgroundColor: '#720E85' }]}
                  >
                    <Text style={styles.alertButtonText}>Ingresar Código</Text>
                  </TouchableOpacity>
                </>
              ) : tipoRegistro === 'empresa' ? (
                <>
                  <Text style={styles.alertTitle}>Nombre de tu empresa</Text>
                  <TextInput
                    style={[
                      styles.input,
                      { width: 250, backgroundColor: '#fff' },
                      erroresCampos.empresa && styles.inputError
                    ]}
                    placeholder="Mi Empresa S.A."
                    value={empresaName}
                    onChangeText={(text) => {
                      setEmpresaName(text);
                      setErroresCampos((prev) => ({ ...prev, empresa: false }));
                    }}
                  />
                  {erroresCampos.empresa && (
                    <Text style={{ color: 'red', marginBottom: 10 }}>Este campo es obligatorio</Text>
                  )}
                  <TouchableOpacity
                    onPress={handleFinalSubmit}
                    style={[styles.alertButton, { marginTop: 10 }]}
                  >
                    <Text style={styles.alertButtonText}>Finalizar Registro</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setTipoRegistro(null)}
                    style={[styles.alertButton, { marginTop: 10, backgroundColor: '#aaa' }]}
                  >
                    <Text style={styles.alertButtonText}>Volver</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.alertTitle}>Código de invitación</Text>
                  <TextInput
                    style={[
                      styles.input,
                      { width: 250, backgroundColor: '#fff' },
                      erroresCampos.codigo && styles.inputError
                    ]}
                    placeholder="ABC123"
                    value={codigoInvitacion}
                    onChangeText={(text) => {
                      setCodigoInvitacion(text);
                      setErroresCampos((prev) => ({ ...prev, codigo: false }));
                    }}
                  />
                  {erroresCampos.codigo && (
                    <Text style={{ color: 'red', marginBottom: 10 }}>Este campo es obligatorio</Text>
                  )}
                  <TouchableOpacity
                    onPress={handleFinalSubmit}
                    style={[styles.alertButton, { marginTop: 10 }]}
                  >
                    <Text style={styles.alertButtonText}>Finalizar Registro</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => setTipoRegistro(null)}
                    style={[styles.alertButton, { marginTop: 10, backgroundColor: '#aaa' }]}
                  >
                    <Text style={styles.alertButtonText}>Volver</Text>
                  </TouchableOpacity>
                </>
              )}
            </View>
          </View>
        </Modal>


        {/* Modal de éxito */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showSuccessFinal}
          onRequestClose={() => setShowSuccessFinal(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.alertView}>
              <Text style={styles.alertTitle}>¡Registro exitoso!</Text>
              <Text style={styles.alertMessage}>Tu cuenta fue creada correctamente.</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowSuccessFinal(false);
                  setActiveContent('home');
                }}
                style={styles.alertButton}
              >
                <Text style={styles.alertButtonText}>Ir al inicio</Text>
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
    elevation: 5,
  },
  inputError: {
    borderWidth: 2,
    borderColor: 'red',
  },
  button: {
    marginTop: 20,
    width: '50%',
    height: 35,
    backgroundColor: '#A01BAC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  backButton: {
    marginTop: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backImage: {
    width: 16,
    height: 16,
    marginRight: 8,
  },
  backButtonText: {
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
    textAlign: 'center',
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
    textAlign: 'center',
  },
});

export default RegisterScreen;
