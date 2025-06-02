import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, TextInput, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Parcela {
  _id: string;
  nombreParcela: string;
  tamaño: number;
  ubicacion?: string;
  estado?: boolean;
  gdd?: number;
  latitud?: number;
  longitud?: number;
}

interface Props {
  setActiveContent: (content: string) => void;
  selectedPlot: Parcela;
}

const EditPlotScreen: React.FC<Props> = ({ setActiveContent, selectedPlot }) => {
  const [showAlertEdit, setShowAlertEdit] = useState(false);
  const [showAlertCancel, setShowAlertCancel] = useState(false);

  const [nombreParcela, setNombreParcela] = useState(selectedPlot?.nombreParcela || '');
  const [tamaño, setTamaño] = useState(String(selectedPlot?.tamaño || ''));
  const [ubicacion, setUbicacion] = useState(selectedPlot?.ubicacion || '');
  const [gdd, setGdd] = useState(String(selectedPlot?.gdd || ''));
  const [latitud, setLatitud] = useState(String(selectedPlot?.latitud || ''));
  const [longitud, setLongitud] = useState(String(selectedPlot?.longitud || ''));

  const editPlot = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Token no encontrado');

      await axios.put(`http://localhost:3000/parcelas/updateParcela/${selectedPlot._id}`, {
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

      setShowAlertEdit(true);
    } catch (error) {
      console.error('Error al modificar la parcela:', error);
      Alert.alert('Error', 'No se pudo modificar la parcela. Intente nuevamente.');
    }
  };

  const cancelPlotEdit = () => {
    setShowAlertCancel(true);
  };

  const goToPlotsScreen = () => {
    setActiveContent('plots');
  };
  
  const allowOnlyNumbers = (value: string) => {
    return value
      .replace(/[^0-9.-]/g, '') // permite números, punto decimal y guión
      .replace(/(?!^)-/g, '')   // permite solo un guión al principio
      .replace(/(\..*?)\./g, '$1'); // permite solo un punto decimal
  };

  const allowLettersAndNumbers = (value: string) => value.replace(/[^a-zA-Z0-9\s]/g, '');

  const allowOnlyLetters = (value: string) => value.replace(/[^a-zA-Z\s]/g, '');


 return (
    <View style={styles.plotContainer}>
      <Text style={styles.plotTitle}>Modificar Parcela</Text>

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
          <TouchableOpacity style={styles.button} onPress={cancelPlotEdit}>
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.cancelButton} onPress={editPlot}>
            <Text style={styles.buttonText}>Guardar</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Modal animationType="fade" transparent={true} visible={showAlertEdit}>
        <View style={styles.modalView}>
          <View style={styles.alertView}>
            <Text style={styles.alertMessage}>Modificación de parcela exitosa</Text>
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
            <Text style={styles.alertMessage}>¿Está seguro que quiere cancelar la modificación?</Text>
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

    plotContainer: {
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

    seedName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#000000'
    },

    seedText: {

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
        marginLeft: '10%',
        marginBottom: 5,
        fontWeight: 'bold',
        fontSize: 16,
        color: '#000000',
  },
})

export default EditPlotScreen;