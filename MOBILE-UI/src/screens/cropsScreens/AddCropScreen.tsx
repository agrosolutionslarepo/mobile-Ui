import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, TextInput, ScrollView, TouchableWithoutFeedback, Keyboard, Platform, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '../../config';

interface Cultivo {
    _id: string;
    semilla: {
        nombreSemilla: string;
    };
    parcela: {
        nombreParcela: string;
    };
}

const AddCropScreen = ({ setActiveContent }: { setActiveContent: (screen: string) => void }) => {
    const [cantidadCosechada, setCantidadCosechada] = useState('');
    const [unidad, setUnidad] = useState('');
    const [observaciones, setObservaciones] = useState('');
    const [cultivo, setCultivo] = useState('');
    const [cultivosDisponibles, setCultivosDisponibles] = useState<Cultivo[]>([]);

    const [showAlertAdd, setShowAlertAdd] = useState(false);
    const [showAlertCancel, setShowAlertCancel] = useState(false);
    const [showIncompleteModal, setShowIncompleteModal] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);

    const [cantidadError, setCantidadError] = useState(false);
    const [unidadError, setUnidadError] = useState(false);
    const [cultivoError, setCultivoError] = useState(false);

    const [loading, setLoading] = useState(false);


    const allowOnlyNumbers = (value: string) => value.replace(/[^0-9]/g, '');
    const allowAlphanumeric = (value: string) => value.replace(/[^a-zA-Z0-9\s]/g, '');

    const goToCropsScreen = () => setActiveContent('crops');
    const cancelCropAdd = () => setShowAlertCancel(true);

    const fetchCultivos = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) return;

            const response = await axios.get(`${API_URL}/cultivos/getAllCultivos`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCultivosDisponibles(response.data);
        } catch (error) {
            console.error('Error al cargar cultivos:', error);
        }
    };

    useEffect(() => {
        fetchCultivos();
    }, []);

    const addCrop = async () => {
        setLoading(true);
        const isCantidadEmpty = !cantidadCosechada;
        const isUnidadEmpty = !unidad;
        const isCultivoEmpty = !cultivo;

        setCantidadError(isCantidadEmpty);
        setUnidadError(isUnidadEmpty);
        setCultivoError(isCultivoEmpty);

        if (isCantidadEmpty || isUnidadEmpty || isCultivoEmpty) {
            setShowIncompleteModal(true);
            setTimeout(() => setLoading(false), 1000);
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('Token no encontrado');

            await axios.post(
                `${API_URL}/cosechas/createCosecha`,
                {
                    cantidadCosechada: parseFloat(cantidadCosechada),
                    unidad,
                    observaciones,
                    cultivo,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setShowAlertAdd(true);
        } catch (error) {
            console.error('Error al crear la cosecha:', error);
            setShowErrorModal(true);
            setTimeout(() => setLoading(false), 1000);
        } finally {
            setLoading(false);
        }
    };

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.title}>Agregar cosecha</Text>
                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <View style={styles.labelContainer}>
                                <MaterialIcons name="format-list-numbered" size={22} color="rgb(42, 125, 98)" />
                                <Text style={styles.label}>Cantidad cosechada</Text>
                            </View>
                            <TextInput
                                style={[styles.input, cantidadError && styles.inputError]}
                                placeholder="Ej: 120"
                                placeholderTextColor="#999"
                                value={cantidadCosechada}
                                keyboardType="numeric"
                                onChangeText={(text) => {
                                    setCantidadCosechada(allowOnlyNumbers(text));
                                    setCantidadError(false);
                                }}
                            />
                        </View>
                        

                        <View style={styles.inputGroup}>
                            <View style={styles.labelContainer}>
                                <MaterialIcons name="edit" size={22} color="rgb(42, 125, 98)" />
                                <Text style={styles.label}>Observaciones</Text>
                            </View>
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

                        <View>
                            <View style={styles.labelContainer}>
                                <MaterialIcons name="scale" size={22} color="rgb(42, 125, 98)" />
                                <Text style={styles.label}>Unidad</Text>
                            </View>
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

                        <View>
                            <View style={styles.labelContainer}>
                                <MaterialIcons name="grass" size={22} color="rgb(42, 125, 98)" />
                                <Text style={styles.label}>Seleccionar cultivo</Text>
                            </View>
                            <View style={styles.pickerInputContainer}>
                                <View style={[styles.pickerInputWrapper, cultivoError && styles.inputError]}>
                                    <Picker
                                        selectedValue={cultivo}
                                        onValueChange={(value) => {
                                            setCultivo(value);
                                            setCultivoError(false);
                                        }}
                                        style={styles.pickerInput}
                                    >
                                        <Picker.Item label="Seleccione un cultivo" value="" />
                                        {cultivosDisponibles.map((item) => (
                                            <Picker.Item
                                                key={item._id}
                                                label={`${item.semilla.nombreSemilla} - ${item.parcela.nombreParcela}`}
                                                value={item._id}
                                            />
                                        ))}
                                    </Picker>
                                </View>
                            </View>
                        </View>

                        <View style={styles.formButtonsContainer}>
                            <TouchableOpacity style={styles.cancelButton} onPress={cancelCropAdd} disabled={loading}>
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={addCrop} disabled={loading}>
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Agregar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    <Modal animationType="fade" transparent visible={showAlertAdd}>
                        <View style={styles.modalView}>
                            <View style={styles.alertView}>
                                <Text style={styles.alertMessage}>Cosecha creada exitosamente</Text>
                                <TouchableOpacity onPress={goToCropsScreen} style={styles.alertButton}>
                                    <Text style={styles.alertButtonText}>Continuar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    <Modal animationType="fade" transparent visible={showAlertCancel}>
                        <View style={styles.modalView}>
                            <View style={styles.alertView}>
                                <Text style={styles.alertMessage}>¿Cancelar ingreso de cosecha?</Text>
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
                                <Text style={styles.alertMessage}>Error al crear la cosecha. Intente nuevamente.</Text>
                                <TouchableOpacity onPress={() => setShowErrorModal(false)} style={styles.alertButton}>
                                    <Text style={styles.alertButtonText}>Cerrar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </ScrollView>
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        marginLeft: 6, // Espaciado entre ícono y texto
        fontSize: 16,
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
            ios: {
                height: 120,
                justifyContent: 'center',
                overflow: 'hidden',
            },
            android: {
                height: 50,
                justifyContent: 'center',
            },
        }),
    },
    pickerInput: {
        width: '100%',
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
        ...Platform.select({
            ios: {
                height: 220,
                textAlignVertical: 'center',
            },
            android: {
                height: 60,
            },
        }),
    },
    inputError: {
        borderColor: 'red',
        borderWidth: 2,
    },
});

export default AddCropScreen;