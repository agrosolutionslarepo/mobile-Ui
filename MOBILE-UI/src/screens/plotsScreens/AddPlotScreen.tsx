import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddSeedScreen = ({ setActiveContent }: { setActiveContent: (content: string) => void }) => {
  const [showAlertAdd, setShowAlertAdd] = useState(false);
  const [showAlertCancel, setShowAlertCancel] = useState(false);

  const [nombreParcela, setNombreParcela] = useState('');
  const [tamaño, setTamaño] = useState('');
  const [ubicacion, setUbicacion] = useState('');
  const [gdd, setGdd] = useState('');
  const [latitud, setLatitud] = useState('');
  const [longitud, setLongitud] = useState('');

  const allowOnlyNumbers = (value: string) => {
    return value
      .replace(/[^0-9.-]/g, '')
      .replace(/(?!^)-/g, '')
      .replace(/(\..*?)\./g, '$1');
  };

  const allowLettersAndNumbers = (value: string) => value.replace(/[^a-zA-Z0-9\s]/g, '');
  const allowOnlyLetters = (value: string) => value.replace(/[^a-zA-Z\s]/g, '');

  const addPlot = async () => {
    if (!nombreParcela || !tamaño || !ubicacion || !gdd || !latitud || !longitud) {
      Alert.alert('Campos incompletos', 'Por favor, complete todos los campos antes de continuar.');
      return;
    }

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
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowAlertAdd(true);
    } catch (error) {
      console.error('Error al crear la parcela:', error);
      Alert.alert('Error', 'No se pudo crear la parcela. Intente nuevamente.');
    }
  };

  const cancelPlotAdd = () => {
    setShowAlertCancel(true);
  };

  const goToPlotsScreen = () => {
    setActiveContent('plots');
  };

  return (
    <View style={styles.plotsContainer}>
      <Text style={styles.plotTitle}>Agregar parcela</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre de parcela</Text>
        <TextInput
          style={styles.input}
          placeholder="Nombre de parcela"
          value={nombreParcela}
          onChangeText={(text) => setNombreParcela(allowLettersAndNumbers(text))}
        />

        <Text style={styles.label}>Tamaño</Text>
        <TextInput
          style={styles.input}
          placeholder="Tamaño"
          value={tamaño}
          keyboardType="numeric"
          onChangeText={(text) => setTamaño(allowOnlyNumbers(text))}
        />

        <Text style={styles.label}>Ubicación</Text>
        <TextInput
          style={styles.input}
          placeholder="Ubicación"
          value={ubicacion}
          onChangeText={(text) => setUbicacion(allowOnlyLetters(text))}
        />

        <Text style={styles.label}>GDD</Text>
        <TextInput
          style={styles.input}
          placeholder="GDD"
          value={gdd}
          keyboardType="numeric"
          onChangeText={(text) => setGdd(allowOnlyNumbers(text))}
        />

        <Text style={styles.label}>Latitud</Text>
        <TextInput
          style={styles.input}
          placeholder="Latitud"
          value={latitud}
          keyboardType="numeric"
          onChangeText={(text) => setLatitud(allowOnlyNumbers(text))}
        />

        <Text style={styles.label}>Longitud</Text>
        <TextInput
          style={styles.input}
          placeholder="Longitud"
          value={longitud}
          keyboardType="numeric"
          onChangeText={(text) => setLongitud(allowOnlyNumbers(text))}
        />

        <View style={styles.formButtonsContainer}>
          <TouchableOpacity style={styles.button} onPress={cancelPlotAdd}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={addPlot}>
            <Text style={styles.buttonText}>Agregar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal animationType="fade" transparent={true} visible={showAlertAdd}>
        <View style={styles.modalView}>
          <View style={styles.alertView}>
            <Text style={styles.alertMessage}>Ingreso de parcela exitoso</Text>
            <View style={styles.alertButtonsContainer}>
              <TouchableOpacity onPress={goToPlotsScreen} style={styles.alertButton}>
                <Text style={styles.alertButtonText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <Modal animationType="fade" transparent={true} visible={showAlertCancel}>
        <View style={styles.modalView}>
          <View style={styles.alertView}>
            <Text style={styles.alertMessage}>¿Está seguro que quiere cancelar el ingreso de esta parcela?</Text>
            <View style={styles.alertButtonsContainer}>
              <TouchableOpacity onPress={goToPlotsScreen} style={styles.alertButton}>
                <Text style={styles.alertButtonText}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowAlertCancel(false)} style={styles.alertButton}>
                <Text style={styles.alertButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};


const styles = StyleSheet.create({

    plotsContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFFCE3',
        width: '100%'
    },

    plotTitle: {
        color: '#000000',
        fontSize: 20,
        fontWeight: 'bold',
        marginTop: 20,
        textAlign: 'center'
    },

    formContainer: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        width: '100%'
    },

    input: {
        width: '80%',

        height: 40,
        padding: 10,

        marginLeft: '10%',
        marginRight: '10%',
        marginBottom: 20,

        backgroundColor: '#D9D9D9',
        borderRadius: 25,

        fontSize:20,
        fontWeight:'bold',
        textAlign:'center',

        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.75,
        shadowRadius: 3.84,
        elevation: 5,
    },

    formButtonsContainer: {
        flexDirection: 'row',
        marginLeft: '10%',
        marginRight: '10%',
    },

    button: {
        color: '#F5F5F5',
        marginTop: 20,
        fontSize: 20,
        width: '45%',
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

    cancelButton: {
        marginLeft: '10%',

        color: '#F5F5F5',
        marginTop: 20,
        fontSize: 20,
        width: '45%',
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

    alertButtonsContainer: {
        flexDirection: 'row',

    },

    alertButton: {
        backgroundColor: '#A01BAC',
        borderRadius: 20,
        marginLeft: 10,

        paddingLeft: 20,
        paddingRight: 20
    },

    alertButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },

    label: {
    width: '80%',
    marginLeft: '10%',
    marginBottom: 0,
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    },

})

export default AddSeedScreen;