import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddSeedScreen = ({ setActiveContent }) => {
  const [showAlertAdd, setShowAlertAdd] = useState(false);
  const [showAlertCancel, setShowAlertCancel] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [showIncompleteModal, setShowIncompleteModal] = useState(false);


  const [nombreParcela, setNombreParcela] = useState('');
  const [tamaño, setTamaño] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [gdd, setGdd] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');

  const [nombreParcelaError, setNombreParcelaError] = useState(false);
  const [tamañoError, setTamañoError] = useState(false);
  const [ubicacionError, setUbicacionError] = useState(false);
  const [gddError, setGddError] = useState(false);
  const [latitudError, setLatitudError] = useState(false);
  const [longitudError, setLongitudError] = useState(false);



  const allowOnlyNumbers = (value) => value.replace(/[^0-9.-]/g, '').replace(/(?!^)-/g, '').replace(/(\..*?)\./g, '$1');
  const allowLettersAndNumbers = (value) => value.replace(/[^a-zA-Z0-9\s]/g, '');
  const allowOnlyLetters = (value) => value.replace(/[^a-zA-Z\s]/g, '');

  const addPlot = async () => {
    // Verificamos campos vacíos
    const isNombreEmpty = !nombreParcela;
    const isTamañoEmpty = !tamaño;
    const isUbicacionEmpty = !ubicacion;
    const isGddEmpty = !gdd;
    const isLatitudEmpty = !latitud;
    const isLongitudEmpty = !longitud;

    // Establecer errores
    setNombreParcelaError(isNombreEmpty);
    setTamañoError(isTamañoEmpty);
    setUbicacionError(isUbicacionEmpty);
    setGddError(isGddEmpty);
    setLatitudError(isLatitudEmpty);
    setLongitudError(isLongitudEmpty);

    // Mostrar modal si hay al menos un campo vacío
    if (
      isNombreEmpty || isTamañoEmpty || isUbicacionEmpty ||
      isGddEmpty || isLatitudEmpty || isLongitudEmpty
    ) {
      setShowIncompleteModal(true);
      return;
    }

    // Si todo está ok, enviar
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Token no encontrado');

      await axios.post('http://localhost:3000/parcelas/createParcela', {
        nombreParcela,
        tamaño: parseFloat(tamaño),
        ubicacion,
        gdd: parseInt(gdd),
        latitud: parseFloat(latitud),
        longitud: parseFloat(longitud),
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setShowAlertAdd(true);
    } catch (error) {
      console.error('Error al crear la parcela:', error);
      setShowErrorModal(true);
    }
  };


  const cancelPlotAdd = () => setShowAlertCancel(true);
  const goToPlotsScreen = () => setActiveContent('plots');

  return (
    <ScrollView contentContainerStyle={styles.plotsContainer}>
      <Text style={styles.plotTitle}>Agregar parcela</Text>

      <View style={styles.formContainer}>

        {/* Datos generales */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>📛 Nombre de parcela</Text>
          <TextInput style={[styles.input, nombreParcelaError && styles.inputError]} placeholder="Ej: Lote Norte" placeholderTextColor="#999" value={nombreParcela} onChangeText={(text) => setNombreParcela(allowLettersAndNumbers(text))} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>📐 Tamaño (ha)</Text>
          <TextInput style={[styles.input, tamañoError && styles.inputError]} placeholder="Ej: 5.5" placeholderTextColor="#999" value={tamaño} keyboardType="numeric" onChangeText={(text) => setTamaño(allowOnlyNumbers(text))} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>🌡️ GDD</Text>
          <TextInput style={[styles.input, gddError && styles.inputError]} placeholder="Ej: 1200" placeholderTextColor="#999" value={gdd} keyboardType="numeric" onChangeText={(text) => setGdd(allowOnlyNumbers(text))} />
        </View>

        {/* Ubicación */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>📍 Ubicación</Text>
          <TextInput style={[styles.input, ubicacionError && styles.inputError]} placeholder="Ej: Córdoba, AR" placeholderTextColor="#999" value={ubicacion} onChangeText={(text) => setUbicacion(allowOnlyLetters(text))} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>🌐 Latitud</Text>
          <TextInput style={[styles.input, latitudError && styles.inputError]} placeholder="Ej: -31.417" placeholderTextColor="#999" value={latitud} keyboardType="numeric" onChangeText={(text) => setLatitud(allowOnlyNumbers(text))} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>🌐 Longitud</Text>
          <TextInput style={[styles.input, longitudError && styles.inputError]} placeholder="Ej: -64.183" placeholderTextColor="#999" value={longitud} keyboardType="numeric" onChangeText={(text) => setLongitud(allowOnlyNumbers(text))} />
        </View>

        <View style={styles.formButtonsContainer}>
          <TouchableOpacity style={styles.button} onPress={cancelPlotAdd}><Text style={styles.buttonText}>Cancelar</Text></TouchableOpacity>
          <TouchableOpacity style={styles.cancelButton} onPress={addPlot}><Text style={styles.buttonText}>Agregar</Text></TouchableOpacity>
        </View>
      </View>

      {/* Modal éxito */}
      <Modal animationType="fade" transparent={true} visible={showAlertAdd}>
        <View style={styles.modalView}>
          <View style={styles.alertView}>
            <Text style={styles.alertMessage}>Ingreso de parcela exitoso</Text>
            <TouchableOpacity onPress={goToPlotsScreen} style={styles.alertButton}><Text style={styles.alertButtonText}>Continuar</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal cancelar */}
      <Modal animationType="fade" transparent={true} visible={showAlertCancel}>
        <View style={styles.modalView}>
          <View style={styles.alertView}>
            <Text style={styles.alertMessage}>¿Está seguro que quiere cancelar el ingreso de esta parcela?</Text>
            <View style={styles.alertButtonsContainer}>
              <TouchableOpacity onPress={goToPlotsScreen} style={styles.alertButton}><Text style={styles.alertButtonText}>Sí</Text></TouchableOpacity>
              <TouchableOpacity onPress={() => setShowAlertCancel(false)} style={styles.alertButton}><Text style={styles.alertButtonText}>No</Text></TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de campos incompletos */}
      <Modal animationType="fade" transparent={true} visible={showIncompleteModal}>
        <View style={styles.modalView}>
          <View style={styles.alertView}>
            <Text style={styles.alertMessage}>Por favor, complete todos los campos antes de continuar.</Text>
            <TouchableOpacity onPress={() => setShowIncompleteModal(false)} style={styles.alertButton}>
              <Text style={styles.alertButtonText}>Aceptar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal de error */}
      <Modal animationType="fade" transparent={true} visible={showErrorModal}>
        <View style={styles.modalView}>
          <View style={styles.alertView}>
            <Text style={styles.alertMessage}>Error al crear la parcela. Intente nuevamente.</Text>
            <TouchableOpacity onPress={() => setShowErrorModal(false)} style={styles.alertButton}>
              <Text style={styles.alertButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  plotsContainer: {
    flexGrow: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFCE3'
  },
  plotTitle: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 22,
    color: '#665996',
    textTransform: 'uppercase'
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5
  },
  inputGroup: {
    marginBottom: 15
  },
  input: {
    width: '100%',
    height: 40,
    padding: 10,
    backgroundColor: '#D9D9D9',
    borderRadius: 25,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 18,
    color: 'rgb(42, 125, 98)'
  },
  formButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20
  },
  button: {
    width: '48%',
    height: 40,
    backgroundColor: '#A01BAC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    elevation: 5
  },
  cancelButton: {
    width: '48%',
    height: 40,
    backgroundColor: '#A01BAC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    elevation: 5
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold'
  },
  modalView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  alertView: {
    backgroundColor: '#FFFCE3',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    maxWidth: '80%'
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center'
  },
  alertButtonsContainer: {
    flexDirection: 'row'
  },
  alertButton: {
    backgroundColor: '#A01BAC',
    borderRadius: 20, 
    marginHorizontal: 10, 
    paddingHorizontal: 20, 
    paddingVertical: 10
  },
  alertButtonText: { 
    fontSize: 18, 
    color: 'white', 
    fontWeight: 'bold' },  
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
  }

});

export default AddSeedScreen;