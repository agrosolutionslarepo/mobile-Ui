import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../config';

const EditCompanyScreen = ({ setActiveContent }: { setActiveContent: (screen: string) => void }) => {
  const [nombreEmpresa, setNombreEmpresa] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);

  useEffect(() => {
    const fetchEmpresa = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const res = await axios.get(`${API_URL}/empresas/getNombreEmpresa`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setNombreEmpresa(res.data.nombreEmpresa);
      } catch (err) {
        console.error('Error al obtener nombre de empresa:', err);
      }
    };

    fetchEmpresa();
  }, []);

  const actualizarEmpresa = async () => {
    if (!nombreEmpresa.trim()) {
      setShowErrorModal(true);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.put(`${API_URL}/empresas/updateEmpresa`,
        { nombreEmpresa },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowSuccessModal(true);
    } catch (err) {
      console.error('Error al actualizar empresa:', err);
      setShowErrorModal(true);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Editar nombre de empresa</Text>

        <TextInput
          style={styles.input}
          placeholder="Nuevo nombre de empresa"
          value={nombreEmpresa}
          onChangeText={setNombreEmpresa}
        />

        <TouchableOpacity style={styles.button} onPress={actualizarEmpresa}>
          <Text style={styles.buttonText}>Guardar cambios</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => setActiveContent('company')}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>

      {/* ✅ Modal de éxito */}
      <Modal visible={showSuccessModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Actualización exitosa</Text>
            <Text style={styles.modalMessage}>El nombre de la empresa fue actualizado correctamente.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => {
                setShowSuccessModal(false);
                setActiveContent('company');
              }}>
              <Text style={styles.modalButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ❌ Modal de error */}
      <Modal visible={showErrorModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Error</Text>
            <Text style={styles.modalMessage}>No se pudo actualizar el nombre. Intentá nuevamente.</Text>
            <TouchableOpacity
              style={styles.modalButton}
              onPress={() => setShowErrorModal(false)}>
              <Text style={styles.modalButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    paddingTop: 60,
    backgroundColor: '#FFFCE3'
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#665996',
    textAlign: 'center',
    marginBottom: 30,
    textTransform: 'uppercase'
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 10,
    fontSize: 16,
    marginBottom: 20
  },
  button: {
    backgroundColor: '#A01BAC',
    paddingVertical: 12,
    borderRadius: 25,
    alignItems: 'center',
    elevation: 5,
    marginBottom: 10
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  cancelText: {
    textAlign: 'center',
    color: '#555',
    fontSize: 16,
    textDecorationLine: 'underline'
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  modalBox: {
    backgroundColor: '#FFFCE3',
    padding: 20,
    borderRadius: 15,
    width: '80%',
    alignItems: 'center'
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333'
  },
  modalMessage: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20
  },
  modalButton: {
    backgroundColor: '#A01BAC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold'
  }
});

export default EditCompanyScreen;

