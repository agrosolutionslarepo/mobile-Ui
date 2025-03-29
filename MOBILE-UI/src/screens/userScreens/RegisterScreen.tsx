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

const RegisterScreen = ({ setActiveContent }: { setActiveContent: (content: string) => void }) => {
  const [name, setName] = useState('');
  const [lastname, setLastname] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [mail, setMail] = useState('');
  const [birthdate, setBirthdate] = useState('');

  const [showAlertEmpty, setShowAlertEmpty] = useState(false);
  const [showAlertFail, setShowAlertFail] = useState(false);
  const [showEmpresaModal, setShowEmpresaModal] = useState(false);
  const [tipoRegistro, setTipoRegistro] = useState<'empresa' | 'codigo' | null>(null);
  const [empresaName, setEmpresaName] = useState('');
  const [codigoInvitacion, setCodigoInvitacion] = useState('');

  const validarDatos = () => {
    if (!name || !lastname || !username || !password || !mail || !birthdate) {
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
      if (!empresaName) return;
      payload.empresaData = {
        nombreEmpresa: empresaName,
        estado: true
      };
    } else if (tipoRegistro === 'codigo') {
      if (!codigoInvitacion) return;
      payload.codigoInvitacion = codigoInvitacion;
    }

    try {
      const response = await axios.post('http://localhost:3000/usuarios/registrarse', payload);
      if (response.status === 200 || response.status === 201) {
        setShowEmpresaModal(false);
        setActiveContent('login'); // o redirigir a otra vista de éxito
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
        <TextInput style={styles.input} value={name} onChangeText={setName} />

        <Text style={styles.textForm}>Apellido</Text>
        <TextInput style={styles.input} value={lastname} onChangeText={setLastname} />

        <Text style={styles.textForm}>Usuario</Text>
        <TextInput style={styles.input} value={username} onChangeText={setUsername} />

        <Text style={styles.textForm}>Contraseña</Text>
        <TextInput
          style={styles.input}
          secureTextEntry={true}
          value={password}
          onChangeText={setPassword}
        />

        <Text style={styles.textForm}>E-Mail</Text>
        <TextInput style={styles.input} value={mail} onChangeText={setMail} />

        <Text style={styles.textForm}>Fecha de nacimiento (AAAA-MM-DD)</Text>
        <TextInput
          style={styles.input}
          placeholder="2000-01-01"
          value={birthdate}
          onChangeText={setBirthdate}
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

        {/* Modal error en el registro */}
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

        {/* Modal crear empresa o ingresar código */}
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
                    style={[styles.input, { width: 250, backgroundColor: '#fff' }]}
                    placeholder="Mi Empresa S.A."
                    value={empresaName}
                    onChangeText={setEmpresaName}
                  />
                  <TouchableOpacity
                    onPress={handleFinalSubmit}
                    style={[styles.alertButton, { marginTop: 10 }]}
                  >
                    <Text style={styles.alertButtonText}>Finalizar Registro</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <>
                  <Text style={styles.alertTitle}>Código de invitación</Text>
                  <TextInput
                    style={[styles.input, { width: 250, backgroundColor: '#fff' }]}
                    placeholder="ABC123"
                    value={codigoInvitacion}
                    onChangeText={setCodigoInvitacion}
                  />
                  <TouchableOpacity
                    onPress={handleFinalSubmit}
                    style={[styles.alertButton, { marginTop: 10 }]}
                  >
                    <Text style={styles.alertButtonText}>Finalizar Registro</Text>
                  </TouchableOpacity>
                </>
              )}
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


