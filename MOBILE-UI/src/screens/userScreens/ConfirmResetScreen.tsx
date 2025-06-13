import React, { useState } from 'react';
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
import { MaterialIcons } from '@expo/vector-icons';
import { API_URL } from '../../config';

const ConfirmResetScreen = ({ setActiveContent }: { setActiveContent: (content: string) => void }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<{email:boolean;code:boolean;password:boolean}>({email:false, code:false, password:false});
  const [loading, setLoading] = useState(false);
  const [showAlertEmpty, setShowAlertEmpty] = useState(false);
  const [showAlertSuccess, setShowAlertSuccess] = useState(false);
  const [showAlertFail, setShowAlertFail] = useState(false);

  const handleConfirm = async () => {
    const newErrors = {
      email: !email.trim(),
      code: !code.trim(),
      password: !password.trim()
    };
    setErrors(newErrors);
    if (newErrors.email || newErrors.code || newErrors.password) {
      setShowAlertEmpty(true);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${API_URL}/usuarios/confirmarReset`, {
        email,
        codigo: code,
        contraseña: password
      });
      if (response.status === 200 || response.status === 201) {
        setShowAlertSuccess(true);
      } else {
        setShowAlertFail(true);
      }
    } catch (e) {
      console.error('Error confirmando reset:', e);
      setShowAlertFail(true);
    } finally {
      setLoading(false);
    }
  };

  const goToLogin = () => setActiveContent('login');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ImageBackground source={require('../../assets/img/backgroundLogIn.png')} style={styles.background}>
        <View style={styles.container}>
          <Image source={require('../../assets/img/logoNew.png')} style={styles.logo} resizeMode="contain" />
          <Text style={styles.recoverText}>Restablecer contraseña</Text>
          <Text style={styles.textForm}>E-Mail</Text>
          <View style={[styles.inputWithIcon, errors.email && styles.inputError]}>
            <MaterialIcons name="email" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="ejemplo@correo.com"
              placeholderTextColor="#888"
              value={email}
              onChangeText={text => {
                setEmail(text);
                setErrors(prev => ({ ...prev, email: false }));
              }}
            />
          </View>
          <Text style={styles.textForm}>Contraseña</Text>
          <View style={[styles.inputWithIcon, errors.password && styles.inputError]}>
            <MaterialIcons name="lock" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="******"
              placeholderTextColor="#888"
              secureTextEntry
              value={password}
              onChangeText={text => {
                setPassword(text);
                setErrors(prev => ({ ...prev, password: false }));
              }}
            />
          </View>
          <Text style={styles.textForm}>Código</Text>
          <View style={[styles.inputWithIcon, errors.code && styles.inputError]}>
            <MaterialIcons name="confirmation-number" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              placeholder="ABCDE"
              placeholderTextColor="#888"
              value={code}
              onChangeText={text => {
                setCode(text);
                setErrors(prev => ({ ...prev, code: false }));
              }}
            />
          </View>
          <TouchableOpacity style={styles.button} onPress={handleConfirm} disabled={loading}>
            {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Confirmar</Text>}
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={goToLogin}>
            <Image source={require('../../assets/img/arrowLeft.png')} style={styles.backImage} resizeMode="contain" />
            <Text style={styles.backButtonText}>Volver</Text>
          </TouchableOpacity>

          <Modal transparent visible={showAlertEmpty} animationType="fade">
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

          <Modal transparent visible={showAlertSuccess} animationType="fade">
            <View style={styles.modalView}>
              <View style={styles.alertView}>
                <Text style={styles.alertTitle}>¡Contraseña actualizada!</Text>
                <TouchableOpacity onPress={goToLogin} style={styles.alertButton}>
                  <Text style={styles.alertButtonText}>Iniciar sesión</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>

          <Modal transparent visible={showAlertFail} animationType="fade">
            <View style={styles.modalView}>
              <View style={styles.alertView}>
                <Text style={styles.alertTitle}>Oh no! Algo salió mal</Text>
                <Text style={styles.alertMessage}>Verifique el código e intente nuevamente.</Text>
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
  recoverText: {
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#F9F9F9'
  },
  textForm: { width: '80%', textAlign: 'left', fontSize: 20, color: '#D9D9D9', fontWeight: 'bold', marginLeft: 15 },
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
  buttonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  backButton: { marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' },
  backImage: { width: 16, height: 16, marginRight: 8 },
  backButtonText: { color: '#FF8BFA', fontSize: 20, fontWeight: 'bold' },
  modalView: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0, 0, 0, 0.5)' },
  alertView: { backgroundColor: '#FFFCE3', padding: 20, borderRadius: 10, alignItems: 'center', width: '80%' },
  alertTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  alertMessage: { fontSize: 16, marginBottom: 20, textAlign: 'center' },
  alertButton: { backgroundColor: '#A01BAC', borderRadius: 20, marginHorizontal: 10, paddingHorizontal: 20, paddingVertical: 10 },
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
  input: { flex: 1, fontSize: 16, color: '#000', paddingVertical: 0, backgroundColor: 'transparent', width: '100%' },
  icon: { marginRight: 10 },
});

export default ConfirmResetScreen;