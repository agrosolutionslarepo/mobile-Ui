import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Modal,
  TextInput,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
  Platform,
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '../../config';

interface Cosecha {
  _id: string;
  fechaCosecha: string;
  cantidadCosechada: number;
  unidad: string;
  observaciones?: string;
  cultivo: {
    semilla?: { nombreSemilla: string };
    parcela?: { nombreParcela: string };
  };
}

interface Props {
  setActiveContent: (content: string) => void;
  selectedCrop: Cosecha;
}

const EditCropScreen: React.FC<Props> = ({ setActiveContent, selectedCrop }) => {
  const [fechaCosecha, setFechaCosecha] = useState<string>(
    selectedCrop?.fechaCosecha || ''
  );
  const [cantidadCosechada, setCantidadCosechada] = useState<string>(
    String(selectedCrop?.cantidadCosechada ?? '')
  );
  const [unidad, setUnidad] = useState<string>(selectedCrop?.unidad || '');
  const [observaciones, setObservaciones] = useState<string>(
    selectedCrop?.observaciones || ''
  );

const [showAlertEdit, setShowAlertEdit] = useState(false);
const [showAlertCancel, setShowAlertCancel] = useState(false);
const [showIncompleteModal, setShowIncompleteModal] = useState(false);
const [showErrorModal, setShowErrorModal] = useState(false);

  const [showDateModal, setShowDateModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState('01');
  const [selectedMonth, setSelectedMonth] = useState('01');
  const [selectedYear, setSelectedYear] = useState('2025');

  const [fechaError, setFechaError] = useState(false);
  const [cantidadError, setCantidadError] = useState(false);
  const [unidadError, setUnidadError] = useState(false);

  const allowOnlyNumbers = (value: string) => value.replace(/[^0-9]/g, '');
  const allowAlphanumeric = (value: string) => value.replace(/[^a-zA-Z0-9\s]/g, '');

  const getDaysInMonth = (month: string, year: string): number => {
    const m = parseInt(month, 10);
    const y = parseInt(year, 10);
    return new Date(y, m, 0).getDate();
  };

  const goToCropsScreen = () => setActiveContent('crops');

  const editCrop = async () => {
    const isFechaEmpty = !fechaCosecha;
    const isCantidadEmpty = !cantidadCosechada;
    const isUnidadEmpty = !unidad;

    setFechaError(isFechaEmpty);
    setCantidadError(isCantidadEmpty);
    setUnidadError(isUnidadEmpty);

    if (isFechaEmpty || isCantidadEmpty || isUnidadEmpty) {
      setShowIncompleteModal(true);
      return;
    }

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Token no encontrado');

      await axios.put(
        `${API_URL}/cosechas/updateCosecha/${selectedCrop._id}`,
        {
          fechaCosecha,
          cantidadCosechada: parseFloat(cantidadCosechada),
          unidad,
          observaciones,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setShowAlertEdit(true);
    } catch (error) {
      console.error('Error al modificar la cosecha:', error);
      setShowErrorModal(true);
    }
  };

  const cancelCropEdit = () => setShowAlertCancel(true);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.title}>Modificar cosecha</Text>

        <View style={styles.formContainer}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>📅 Fecha de cosecha</Text>
            <TouchableOpacity
              style={[styles.input, fechaError && styles.inputError]}
              onPress={() => setShowDateModal(true)}
            >
              <Text style={{ textAlign: 'center', color: fechaCosecha ? '#000' : '#999' }}>
                {fechaCosecha ? fechaCosecha.split('T')[0] : 'Seleccionar fecha'}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>🔢 Cantidad cosechada</Text>
            <TextInput
              style={[styles.input, cantidadError && styles.inputError]}
              placeholder="Ej: 120"
              placeholderTextColor="#999"
              keyboardType="numeric"
              value={cantidadCosechada}
              onChangeText={(text) => {
                setCantidadCosechada(allowOnlyNumbers(text));
                setCantidadError(false);
              }}
            />
          </View>

          <View>
            <Text style={styles.label}>⚖️ Unidad</Text>
            <View style={styles.pickerInputContainer}>
              <View style={[styles.pickerInputWrapper, unidadError && styles.inputError]}>
                <Picker
                  selectedValue={unidad}
                  onValueChange={(value) => {
                    setUnidad(value);
                    setUnidadError(false);
                  }}
                  style={styles.pickerInput}
                >
                  <Picker.Item label="Seleccione unidad" value="" />
                  <Picker.Item label="Kilogramos (kg)" value="kg" />
                  <Picker.Item label="Toneladas (ton)" value="ton" />
                </Picker>
              </View>
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>📝 Observaciones</Text>
            <TextInput
              style={styles.textArea}
              multiline
              numberOfLines={4}
              placeholder="Opcional"
              placeholderTextColor="#999"
              value={observaciones}
              onChangeText={(text) => setObservaciones(allowAlphanumeric(text))}
            />
          </View>

          <View style={styles.formButtonsContainer}>
            <TouchableOpacity style={styles.cancelButton} onPress={cancelCropEdit}>
              <Text style={styles.buttonText}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={editCrop}>
              <Text style={styles.buttonText}>Guardar</Text>
            </TouchableOpacity>
          </View>
        </View>

        <Modal transparent visible={showDateModal} animationType="fade">
          <View style={styles.modalView}>
            <View style={styles.alertViewDate}>
              <Text style={styles.alertTitle}>Seleccionar fecha de cosecha</Text>

              <View style={styles.pickerContainer}>
                <View style={styles.pickerGroup}>
                  <Text style={styles.pickerLabel}>Día</Text>
                  <View style={styles.pickerBox}>
                    <Picker
                      selectedValue={selectedDay}
                      onValueChange={(value) => setSelectedDay(value)}
                      style={styles.pickerDate}
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
                      onValueChange={(value) => {
                        setSelectedMonth(value);
                        const maxDay = getDaysInMonth(value, selectedYear);
                        if (parseInt(selectedDay) > maxDay) {
                          setSelectedDay(maxDay.toString().padStart(2, '0'));
                        }
                      }}
                      style={styles.pickerDate}
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
                      onValueChange={(value) => {
                        setSelectedYear(value);
                        const maxDay = getDaysInMonth(selectedMonth, value);
                        if (parseInt(selectedDay) > maxDay) {
                          setSelectedDay(maxDay.toString().padStart(2, '0'));
                        }
                      }}
                      style={styles.pickerDate}
                    >
                      {Array.from({ length: 10 }, (_, i) => {
                        const year = (new Date().getFullYear() + i).toString();
                        return <Picker.Item key={year} label={year} value={year} />;
                      })}
                    </Picker>
                  </View>
                </View>
              </View>

              <TouchableOpacity
                style={styles.alertButtonDate}
                onPress={() => {
                  const localDate = new Date(
                    Number(selectedYear),
                    Number(selectedMonth) - 1,
                    Number(selectedDay)
                  );
                  const isoDate = localDate.toISOString();
                  setFechaCosecha(isoDate);
                  setFechaError(false);
                  setShowDateModal(false);
                }}
              >
                <Text style={styles.alertButtonTextDate}>Confirmar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.alertButtonDate, { marginTop: 10, backgroundColor: '#aaa' }]}
                onPress={() => setShowDateModal(false)}
              >
                <Text style={styles.alertButtonTextDate}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal animationType="fade" transparent visible={showAlertEdit}>
          <View style={styles.modalView}>
            <View style={styles.alertView}>
              <Text style={styles.alertMessage}>Cosecha modificada exitosamente</Text>
              <TouchableOpacity onPress={goToCropsScreen} style={styles.alertButton}>
                <Text style={styles.alertButtonText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal animationType="fade" transparent visible={showAlertCancel}>
          <View style={styles.modalView}>
            <View style={styles.alertView}>
              <Text style={styles.alertMessage}>¿Cancelar la modificación de esta cosecha?</Text>
              <View style={styles.alertButtonsContainer}>
                <TouchableOpacity onPress={goToCropsScreen} style={styles.alertButton}>
                  <Text style={styles.alertButtonText}>Sí</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowAlertCancel(false)} style={styles.alertButton}>
                  <Text style={styles.alertButtonText}>No</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>

        <Modal animationType="fade" transparent visible={showIncompleteModal}>
          <View style={styles.modalView}>
            <View style={styles.alertView}>
              <Text style={styles.alertMessage}>Completa todos los campos requeridos.</Text>
              <TouchableOpacity onPress={() => setShowIncompleteModal(false)} style={styles.alertButton}>
                <Text style={styles.alertButtonText}>Aceptar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        <Modal animationType="fade" transparent visible={showErrorModal}>
          <View style={styles.modalView}>
            <View style={styles.alertView}>
              <Text style={styles.alertMessage}>Error al modificar la cosecha. Intente nuevamente.</Text>
              <TouchableOpacity onPress={() => setShowErrorModal(false)} style={styles.alertButton}>
                <Text style={styles.alertButtonText}>Cerrar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </ScrollView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFCE3',
  },
  title: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 22,
    color: '#665996',
    textTransform: 'uppercase',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    padding: 20,
    elevation: 5,
  },
  inputGroup: {
    marginBottom: 15,
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
    elevation: 5,
  },
  textArea: {
    width: '100%',
    height: 100,
    padding: 10,
    backgroundColor: '#D9D9D9',
    borderRadius: 15,
    fontSize: 16,
    textAlignVertical: 'top',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5,
  },
  label: {
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 18,
    color: 'rgb(42, 125, 98)',
  },
  formButtonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  button: {
    width: '48%',
    height: 40,
    backgroundColor: '#A01BAC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  cancelButton: {
    width: '48%',
    height: 40,
    backgroundColor: '#aaa',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
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
    maxWidth: '80%',
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  alertButtonsContainer: {
    flexDirection: 'row',
  },
  alertButton: {
    backgroundColor: '#A01BAC',
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  alertButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
  pickerInputContainer: {
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5,
  },
  pickerInputWrapper: {
    backgroundColor: '#D9D9D9',
    borderRadius: 25,
    marginBottom: 20,
    ...Platform.select({
      ios: { height: 120, justifyContent: 'center', overflow: 'hidden' },
      android: { height: 50, justifyContent: 'center' },
    }),
  },
  pickerInput: {
    width: '100%',
    color: '#000',
    fontSize: 16,
    textAlign: 'center',
    ...Platform.select({ ios: { height: 220, textAlignVertical: 'center' }, android: { height: 60 } }),
  },
  inputError: {
    borderColor: 'red',
    borderWidth: 2,
  },
  alertViewDate: {
    backgroundColor: '#FFFCE3',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    width: '90%',
    minHeight: Platform.OS === 'ios' ? 550 : 250,
    maxHeight: Platform.OS === 'ios' ? 700 : undefined,
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  pickerContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginVertical: 10,
    gap: 12,
  },
  pickerGroup: {
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  pickerLabel: {
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    color: '#555',
  },
  pickerBox: {
    backgroundColor: '#fff',
    borderRadius: 15,
    width: '100%',
    justifyContent: 'center',
    overflow: 'hidden',
    alignItems: 'center',
    ...Platform.select({ ios: { height: 120 }, android: { height: 48 } }),
  },
  pickerDate: {
    height: Platform.OS === 'ios' ? 220 : 40,
    width: '100%',
    color: '#333',
    fontSize: Platform.OS === 'ios' ? 20 : 16,
    textAlign: 'center',
    textAlignVertical: 'center',
    ...Platform.select({ ios: { height: 220, textAlignVertical: 'center' }, android: { height: 60 } }),
  },
  alertButtonDate: {
    backgroundColor: '#A01BAC',
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  alertButtonTextDate: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default EditCropScreen;