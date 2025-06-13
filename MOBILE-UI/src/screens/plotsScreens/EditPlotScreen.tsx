import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, TextInput, Alert, TouchableWithoutFeedback, Keyboard, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';
import { MaterialIcons } from '@expo/vector-icons';

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

  const [loading, setLoading] = useState(false);

  const [nombreParcela, setNombreParcela] = useState(selectedPlot?.nombreParcela || '');
  const [tamaño, setTamaño] = useState(String(selectedPlot?.tamaño || ''));
  const [ubicacion, setUbicacion] = useState(selectedPlot?.ubicacion || '');
  const [gdd, setGdd] = useState(String(selectedPlot?.gdd || ''));
  const [latitud, setLatitud] = useState(String(selectedPlot?.latitud || ''));
  const [longitud, setLongitud] = useState(String(selectedPlot?.longitud || ''));

  const editPlot = async () => {
    setLoading(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Token no encontrado');

      await axios.put(`${API_URL}/parcelas/updateParcela/${selectedPlot._id}`, {
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
    } finally {
      setLoading(false);
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
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.plotContainer}>
      <Text style={styles.plotTitle}>Modificar Parcela</Text>

      <View style={styles.formContainer}>
        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="drive-file-rename-outline" size={22} color="rgb(42, 125, 98)" />
            <Text style={styles.label}>Nombre de parcela</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Nombre de parcela"
            placeholderTextColor="#666"
            value={nombreParcela}
            onChangeText={(text) => setNombreParcela(allowLettersAndNumbers(text))}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="square-foot" size={22} color="rgb(42, 125, 98)" />
            <Text style={styles.label}>Tamaño</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Tamaño"
            placeholderTextColor="#666"
            value={tamaño}
            keyboardType="numeric"
            onChangeText={(text) => setTamaño(allowOnlyNumbers(text))}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="location-on" size={22} color="rgb(42, 125, 98)" />
            <Text style={styles.label}>Ubicación</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Ubicación"
            placeholderTextColor="#666"
            value={ubicacion}
            onChangeText={(text) => setUbicacion(allowOnlyLetters(text))}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="device-thermostat" size={22} color="rgb(42, 125, 98)" />
            <Text style={styles.label}>GDD</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="GDD"
            placeholderTextColor="#666"
            value={gdd}
            keyboardType="numeric"
            onChangeText={(text) => setGdd(allowOnlyNumbers(text))}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="public" size={22} color="rgb(42, 125, 98)" />
            <Text style={styles.label}>Latitud</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Latitud"
            placeholderTextColor="#666"
            value={latitud}
            keyboardType="numeric"
            onChangeText={(text) => setLatitud(allowOnlyNumbers(text))}
          />
        </View>

        <View style={styles.inputGroup}>
          <View style={styles.labelContainer}>
            <MaterialIcons name="public" size={22} color="rgb(42, 125, 98)" />
            <Text style={styles.label}>Longitud</Text>
          </View>
          <TextInput
            style={styles.input}
            placeholder="Longitud"
            placeholderTextColor="#666"
            value={longitud}
            keyboardType="numeric"
            onChangeText={(text) => setLongitud(allowOnlyNumbers(text))}
          />
        </View>

        <View style={styles.formButtonsContainer}>
          <TouchableOpacity
            style={styles.cancelButton}
            onPress={cancelPlotEdit}
            disabled={loading}
          >
            <Text style={styles.buttonText}>Cancelar</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.button} onPress={editPlot} disabled={loading}>
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Guardar</Text>
            )}
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
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({

  plotContainer: {
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
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  label: {
    fontWeight: 'bold',
    marginLeft: 6,
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
    backgroundColor: '#aaa',
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
    fontWeight: 'bold'
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
  }
})

export default EditPlotScreen;