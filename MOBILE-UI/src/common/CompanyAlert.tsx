import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TextInput,
  TouchableWithoutFeedback,
  Keyboard
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { API_URL } from '../config';

// Utilidad para decodificar el JWT sin librerías externas
const parseJwt = (token: string) => {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    console.error('Error al decodificar el token:', e);
    return null;
  }
};

const CompanyAlert: React.FC<{
  onNavigate?: (screen: string) => void;
  onRefreshHeader?: () => void;
}> = ({ onNavigate, onRefreshHeader }) => {
  const [shouldShowCard, setShouldShowCard] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [tipoRegistro, setTipoRegistro] = useState<'empresa' | 'codigo' | null>(null);
  const [empresaName, setEmpresaName] = useState('');
  const [codigoInvitacion, setCodigoInvitacion] = useState('');
  const [erroresCampos, setErroresCampos] = useState({ empresa: false, codigo: false });
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');


  const fetchUserData = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await axios.get(`${API_URL}/usuarios/getUsuarioAutenticado`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const empresaId = response?.data?.empresa;

      if (empresaId === '6840da01ba52fec6d68de6bc') {
        setShouldShowCard(true);
      } else {
        setShouldShowCard(false); // ✅ para ocultar si ya no aplica
      }
    } catch (error) {
      console.error('Error al obtener el usuario:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);


  const handleFinalSubmit = async () => {
    if (tipoRegistro === 'empresa' && !empresaName.trim()) {
      setErroresCampos((prev) => ({ ...prev, empresa: true }));
      return;
    }

    if (tipoRegistro === 'codigo' && !codigoInvitacion.trim()) {
      setErroresCampos((prev) => ({ ...prev, codigo: true }));
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('No se encontró el token');
        return;
      }

      let response;

      if (tipoRegistro === 'empresa') {
        response = await axios.post(
          `${API_URL}/empresas/crearEmpresaDesdeGoogle`,
          { nombreEmpresa: empresaName },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setShowModal(false);
        setSuccessMessage('¡La empresa fue creada con éxito!');
      }

      if (tipoRegistro === 'codigo') {
        response = await axios.post(
          `${API_URL}/inviteCodes/joinCompanyWithCode`,
          { codigo: codigoInvitacion },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );
        setShowModal(false);
        setSuccessMessage('¡Te uniste a la empresa con éxito!');
      }

      // ✅ Si el backend devuelve un nuevo token, actualizalo
      const nuevoToken = response?.data?.token;
      if (nuevoToken) {
        await AsyncStorage.setItem('userToken', nuevoToken);
        const decoded = parseJwt(nuevoToken);
        if (decoded) {
          await AsyncStorage.setItem('decodedToken', JSON.stringify(decoded));
        }
      }

      setShowSuccessModal(true);
    } catch (error: any) {
      console.error('❌ Error:', error?.response?.data || error.message);
    }
  };





  const cerrarModal = () => {
    setShowModal(false);
    setTipoRegistro(null);
    setEmpresaName('');
    setCodigoInvitacion('');
    setErroresCampos({ empresa: false, codigo: false });
  };

  if (loading || !shouldShowCard) return null;

  return (
    <View style={styles.cardContainer}>
      <View style={styles.card}>
        <View style={styles.headerRow}>
          <MaterialIcons name="business" size={28} color="#A01BAC" />
          <Text style={styles.title}>¡Atención!</Text>
        </View>

        <Text style={styles.message}>
          Aún no estás vinculado a una empresa. Podés crear una nueva o ingresar un código de invitación.
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setTipoRegistro('empresa');
              setShowModal(true);
            }}
          >
            <Text style={styles.buttonText}>Crear empresa</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.button}
            onPress={() => {
              setTipoRegistro('codigo');
              setShowModal(true);
            }}
          >
            <Text style={styles.buttonText}>Ingresar código</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal
        transparent
        visible={showModal}
        animationType="fade"
        onRequestClose={cerrarModal}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback onPress={cerrarModal}>
              <View style={styles.backdrop} />
            </TouchableWithoutFeedback>

            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                {tipoRegistro === 'empresa' && (
                  <>
                    <Text style={styles.alertTitle}>Nombre de tu empresa</Text>
                    <View style={[styles.inputWithIcon, erroresCampos.empresa && styles.inputError]}>
                      <MaterialIcons name="business" size={20} color="#666" style={styles.icon} />
                      <TextInput
                        placeholder="Mi Empresa S.A."
                        placeholderTextColor="#888"
                        style={styles.input}
                        value={empresaName}
                        onChangeText={(text) => {
                          setEmpresaName(text);
                          setErroresCampos((prev) => ({ ...prev, empresa: false }));
                        }}
                      />
                    </View>
                    {erroresCampos.empresa && (
                      <Text style={styles.errorText}>Este campo es obligatorio</Text>
                    )}
                  </>
                )}

                {tipoRegistro === 'codigo' && (
                  <>
                    <Text style={styles.alertTitle}>Código de invitación</Text>
                    <View style={[styles.inputWithIcon, erroresCampos.codigo && styles.inputError]}>
                      <MaterialIcons name="vpn-key" size={20} color="#666" style={styles.icon} />
                      <TextInput
                        placeholder="ABC123"
                        placeholderTextColor="#888"
                        style={styles.input}
                        value={codigoInvitacion}
                        onChangeText={(text) => {
                          setCodigoInvitacion(text);
                          setErroresCampos((prev) => ({ ...prev, codigo: false }));
                        }}
                      />
                    </View>
                    {erroresCampos.codigo && (
                      <Text style={styles.errorText}>Este campo es obligatorio</Text>
                    )}
                  </>
                )}

                <TouchableOpacity onPress={handleFinalSubmit} style={styles.alertButton}>
                  <Text style={styles.alertButtonText}>Finalizar Registro</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={cerrarModal}
                  style={[styles.alertButton, { backgroundColor: '#aaa', marginTop: 10 }]}
                >
                  <Text style={styles.alertButtonText}>Volver</Text>
                </TouchableOpacity>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/*Modal de exito */}
      <Modal
        transparent
        visible={showSuccessModal}
        animationType="fade"
        onRequestClose={() => setShowSuccessModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setShowSuccessModal(false)}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.alertTitle}>Éxito</Text>
                <Text style={[styles.message, { marginBottom: 20 }]}>{successMessage}</Text>
                <TouchableOpacity
                  style={styles.alertButton}
                  onPress={async () => {
                    setShowSuccessModal(false);
                    cerrarModal();              // Limpia campos y cierra el modal principal
                    await fetchUserData();      // Refresca para ocultar la card si corresponde
                    onRefreshHeader?.();        // Fuerza que el Header vuelva a cargar los datos
                  }}
                >
                  <Text style={styles.alertButtonText}>Aceptar</Text>
                </TouchableOpacity>

              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    backgroundColor: '#FFFCE3',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 20,
    marginHorizontal: 16,
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 4,
    marginBottom: 15
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
    gap: 6
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#A01BAC',
    textAlign: 'center'
  },
  message: {
    fontSize: 16,
    color: '#333',
    marginBottom: 16,
    textAlign: 'center'
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around'
  },
  button: {
    backgroundColor: '#A01BAC',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold'
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center'
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)'
  },
  modalContent: {
    backgroundColor: '#FFFCE3',
    marginHorizontal: 30,
    borderRadius: 12,
    padding: 20,
    elevation: 5
  },
  alertTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#665996',
    textTransform: 'uppercase'
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10
  },
  input: {
    flex: 1,
    height: 40,
    fontSize: 16,
    color: '#000'
  },
  icon: {
    marginRight: 8
  },
  inputError: {
    borderColor: 'red'
  },
  errorText: {
    color: 'red',
    marginBottom: 10
  },
  alertButton: {
    backgroundColor: '#A01BAC',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center'
  },
  alertButtonText: {
    color: '#fff',
    fontWeight: 'bold'
  }
});

export default CompanyAlert;