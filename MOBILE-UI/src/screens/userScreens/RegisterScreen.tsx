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
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
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

const getDaysInMonth = (month: string, year: string): number => {
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  return new Date(y, m, 0).getDate();
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
  const [showUnderageModal, setShowUnderageModal] = useState(false);

  const [showEmpresaModal, setShowEmpresaModal] = useState(false);
  const [tipoRegistro, setTipoRegistro] = useState<'empresa' | 'codigo' | null>(null);
  const [empresaName, setEmpresaName] = useState('');
  const [codigoInvitacion, setCodigoInvitacion] = useState('');

  const [erroresCampos, setErroresCampos] = useState<{ [key: string]: boolean }>({});
  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('01');
  const [selectedMonth, setSelectedMonth] = useState('01');
  const [selectedYear, setSelectedYear] = useState('2000');
  const [fechaError, setFechaError] = useState(false);

  const validarDatos = () => {
    const errores: any = {};
    if (!name.trim()) errores.name = true;
    if (!lastname.trim()) errores.lastname = true;
    if (!username.trim()) errores.username = true;
    if (!password.trim()) errores.password = true;
    if (!mail.trim()) errores.mail = true;
    if (!birthdate.trim()) errores.birthdate = true;
    if (fechaError) errores.birthdate = true;

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
        const token = response.data.jwt;
        if (token) {
          const decodedToken = parseJwt(token);
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

        <Text style={styles.textForm}>Fecha de nacimiento</Text>
        <TouchableOpacity
          style={[
            styles.input,
            erroresCampos.birthdate && styles.inputError,
            fechaError && styles.inputError,
            { justifyContent: 'center' }
          ]}
          onPress={() => setShowDateModal(true)}
        >
          <Text style={{ color: birthdate ? '#000' : '#888' }}>
            {birthdate || 'Seleccionar fecha'}
          </Text>
        </TouchableOpacity>

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

        {/* Modal de fecha */}
        <Modal
          transparent
          visible={showDateModal}
          animationType="fade"
          onRequestClose={() => setShowDateModal(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.alertView}>
              <Text style={styles.alertTitle}>Seleccioná tu fecha de nacimiento</Text>

              <View style={styles.pickerContainer}>
                <View style={styles.pickerGroup}>
                  <Text style={styles.pickerLabel}>Día</Text>
                  <View style={styles.pickerBox}>
                    <Picker
                      selectedValue={selectedDay}
                      style={styles.picker}
                      onValueChange={(itemValue) => setSelectedDay(itemValue)}
                    >
                      {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => {
                        const day = (i + 1).toString().padStart(2, '0');
                        return <Picker.Item key={day} label={day} value={day} />;
                      })}
                    </Picker>
                  </View>
                </View>

                <View style={styles.pickerGroup}>
                  <Text style={styles.pickerLabel}>Mes</Text>
                  <View style={styles.pickerBox}>
                    <Picker
                      selectedValue={selectedMonth}
                      style={styles.picker}
                      onValueChange={(itemValue) => {
                        setSelectedMonth(itemValue);
                        const maxDay = getDaysInMonth(itemValue, selectedYear);
                        if (parseInt(selectedDay, 10) > maxDay) {
                          setSelectedDay(maxDay.toString().padStart(2, '0'));
                        }
                      }}
                    >
                      {Array.from({ length: 12 }, (_, i) => {
                        const month = (i + 1).toString().padStart(2, '0');
                        return <Picker.Item key={month} label={month} value={month} />;
                      })}
                    </Picker>
                  </View>
                </View>

                <View style={styles.pickerGroup}>
                  <Text style={styles.pickerLabel}>Año</Text>
                  <View style={styles.pickerBox}>
                    <Picker
                      selectedValue={selectedYear}
                      style={styles.picker}
                      onValueChange={(itemValue) => {
                        setSelectedYear(itemValue);
                        const maxDay = getDaysInMonth(selectedMonth, itemValue);
                        if (parseInt(selectedDay, 10) > maxDay) {
                          setSelectedDay(maxDay.toString().padStart(2, '0'));
                        }
                      }}
                    >
                      {Array.from({ length: 100 }, (_, i) => {
                        const year = (new Date().getFullYear() - i).toString();
                        return <Picker.Item key={year} label={year} value={year} />;
                      })}
                    </Picker>
                  </View>
                </View>

              </View>


              <TouchableOpacity
                onPress={() => {
                  const selectedDate = new Date(`${selectedYear}-${selectedMonth}-${selectedDay}`);
                  const today = new Date();
                  const ageDiff = today.getFullYear() - selectedDate.getFullYear();
                  const m = today.getMonth() - selectedDate.getMonth();
                  const is18 =
                    ageDiff > 18 ||
                    (ageDiff === 18 && (m > 0 || (m === 0 && today.getDate() >= selectedDate.getDate())));

                  if (is18) {
                    const formattedDate = `${selectedYear}-${selectedMonth}-${selectedDay}`;
                    setBirthdate(formattedDate);
                    setFechaError(false);
                    setErroresCampos((prev) => ({ ...prev, birthdate: false }));
                    setShowDateModal(false);
                  } else {
                    setBirthdate('');
                    setFechaError(true);
                    setShowDateModal(false);
                    setShowUnderageModal(true);
                  }

                }}
                style={[styles.alertButton, { marginTop: 20 }]}
              >
                <Text style={styles.alertButtonText}>Confirmar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => setShowDateModal(false)}
                style={[styles.alertButton, { marginTop: 10, backgroundColor: '#aaa' }]}
              >
                <Text style={styles.alertButtonText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal menor de edad */}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showUnderageModal}
          onRequestClose={() => setShowUnderageModal(false)}
        >
          <View style={styles.modalView}>
            <View style={styles.alertView}>
              <Text style={styles.alertTitle}>Edad insuficiente</Text>
              <Text style={styles.alertMessage}>Debés tener al menos 18 años para registrarte.</Text>
              <TouchableOpacity onPress={() => setShowUnderageModal(false)} style={styles.alertButton}>
                <Text style={styles.alertButtonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

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
    shadowColor: '#000000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75, shadowRadius: 3.84, elevation: 5,
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
  pickerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    maxWidth: '100%',
    marginVertical: 10,
    gap: 12,
  },
  pickerBox: {
    backgroundColor: '#fff',
    borderRadius: 15,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 2,
    width: 85,
    height: 40,
    justifyContent: 'center',
  },
  picker: {
    height: 40,
    borderRadius: 10,
    width: '100%',
    color: '#333',
    fontSize: 14,
  },
  pickerGroup: {
    alignItems: 'center',
    marginHorizontal: 4,
    flex: 1,
  },
  pickerLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    color: '#555',
  },
  
});

export default RegisterScreen;
