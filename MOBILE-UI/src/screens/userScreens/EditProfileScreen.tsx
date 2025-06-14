import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../config';

const EditProfileScreen = ({ setActiveContent }: { setActiveContent: (screen: string) => void }) => {
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserFromApi = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;

        const response = await axios.get(
          `${API_URL}/usuarios/getUsuarioAutenticado`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          const data = response.data;
          setNombre(data.nombre || '');
          setApellido(data.apellido || '');
        } else {
          console.error('No se pudo obtener los datos del usuario');
        }
      } catch (error: any) {
        console.error('Error al consultar el usuario:', error?.response?.data || error.message);
      }
    };

    fetchUserFromApi();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        console.error('Token no disponible');
        return;
      }

      const response = await axios.put(
        `${API_URL}/usuarios/updateUsuario`,
        {
          nombre,
          apellido,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        setShowSuccessModal(true);
      } else {
        console.error('Error inesperado:', response.data);
      }
    } catch (error: any) {
      console.error('Error al actualizar perfil:', error?.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text style={styles.title}>Editar Perfil</Text>

        <View style={styles.infoContainer}>
          <View style={styles.inputGroup}>
            <MaterialIcons name="person" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              value={nombre}
              onChangeText={setNombre}
              placeholder="Nombre"
              placeholderTextColor="#888"
            />
          </View>

          <View style={styles.inputGroup}>
            <MaterialIcons name="person-outline" size={20} color="#666" style={styles.icon} />
            <TextInput
              style={styles.input}
              value={apellido}
              onChangeText={setApellido}
              placeholder="Apellido"
              placeholderTextColor="#888"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.saveButtonText}>Guardar cambios</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.cancelButton}
            onPress={() => setActiveContent('profile')}
            disabled={loading}
          >
            <Text style={styles.cancelButtonText}>Cancelar</Text>
          </TouchableOpacity>
        </View>

        {/* Modal de éxito */}
        <Modal
          transparent
          visible={showSuccessModal}
          animationType="fade"
          onRequestClose={() => setShowSuccessModal(false)}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalBox}>
              <Text style={styles.modalTitle}>Perfil actualizado correctamente</Text>
              <TouchableOpacity
                onPress={() => {
                  setShowSuccessModal(false);
                  setActiveContent('refresh');
                  setTimeout(() => setActiveContent('profile'), 0);
                }}
                style={styles.modalButton}
              >
                <Text style={styles.modalButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 60,
    backgroundColor: '#FFFCE3'
  },
  infoContainer: {
    backgroundColor: '#FFF',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#665996',
    textTransform: 'uppercase',
  },
  inputGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
    borderRadius: 25,
    paddingHorizontal: 15,
    marginBottom: 20,
    height: 42,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  saveButton: {
    backgroundColor: '#A01BAC',
    paddingVertical: 10,
    borderRadius: 25,
    alignItems: 'center',
    marginTop: 10,
    elevation: 5,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 18,
  },
  cancelButton: {
    marginTop: 15,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#A01BAC',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalBox: {
    backgroundColor: '#FFFCE3',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalButton: {
    backgroundColor: '#A01BAC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default EditProfileScreen;