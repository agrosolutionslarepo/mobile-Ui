import React, { useState } from 'react';
import {
    View,
    StyleSheet,
    Text,
    TouchableOpacity,
    Modal,
    TextInput,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ScrollView,
    ActivityIndicator
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
    setActiveContent: (content: string) => void;
    selectedSeed: {
        _id: string;
        nombreSemilla: string;
        tipoSemilla: string;
        cantidadSemilla: number;
        unidad: string;
    } | null;
}

const EditSeedScreen: React.FC<Props> = ({ setActiveContent, selectedSeed }) => {
    const [showAlertEdit, setShowAlertEdit] = useState(false);
    //const [showAlertCancel, setShowAlertCancel] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    const [nombreSemilla, setNombreSemilla] = useState(selectedSeed?.nombreSemilla || '');
    const [tipoSemilla, setTipoSemilla] = useState(selectedSeed?.tipoSemilla || '');
    const [cantidadSemilla, setCantidadSemilla] = useState(String(selectedSeed?.cantidadSemilla || ''));
    const [unidad, setUnidad] = useState(selectedSeed?.unidad || '');

    const [loading, setLoading] = useState(false);

    /*const editSeed = () => {
        setShowAlertEdit(true);
    };*/

    const editSeed = async () => {
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token || !selectedSeed) return;

            const updatedSeed = {
                nombreSemilla,
                tipoSemilla,
                cantidadSemilla: parseFloat(cantidadSemilla),
                unidad,
            };

            await axios.put(`${API_URL}/semillas/updateSemilla/${selectedSeed._id}`, updatedSeed, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setShowAlertEdit(true);
        } catch (error) {
            console.error('Error al editar la semilla:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <ScrollView contentContainerStyle={styles.container}>
                <Text style={styles.title}>Modificar semilla</Text>

                <View style={styles.formContainer}>
                    <View style={styles.inputGroup}>
                        <View style={styles.labelContainer}>
                            <MaterialIcons name="local-florist" size={22} color="rgb(42, 125, 98)" />
                            <Text style={styles.label}>Nombre Semilla</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#666"
                            value={nombreSemilla}
                            editable={false}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelContainer}>
                            <MaterialIcons name="category" size={22} color="rgb(42, 125, 98)" />
                            <Text style={styles.label}>Tipo de Semilla</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#666"
                            value={tipoSemilla}
                            editable={false}
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelContainer}>
                            <MaterialIcons name="format-list-numbered" size={22} color="rgb(42, 125, 98)" />
                            <Text style={styles.label}>Cantidad</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            placeholderTextColor="#666"
                            value={cantidadSemilla}
                            onChangeText={setCantidadSemilla}
                            keyboardType="numeric"
                        />
                    </View>

                    <View style={styles.inputGroup}>
                        <View style={styles.labelContainer}>
                            <MaterialIcons name="scale" size={22} color="rgb(42, 125, 98)" />
                            <Text style={styles.label}>Unidad</Text>
                        </View>
                        <View style={styles.pickerInputContainer}>
                            <View style={styles.pickerInputWrapper}>
                                <Picker
                                    selectedValue={unidad}
                                    onValueChange={(itemValue) => {
                                        if (itemValue !== '') setUnidad(itemValue);
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

                    <View style={styles.formButtonsContainer}>
                        <TouchableOpacity
                            style={styles.cancelButton}
                            onPress={() => setShowCancelModal(true)}
                            disabled={loading}
                        >
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button} onPress={editSeed} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Guardar</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                </View>

                {/* Modal para la alerta de modificación de semilla exitoso*/}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showAlertEdit}
                >
                    <View style={styles.modalView}>
                        <View style={styles.alertView}>
                            <Text style={styles.alertMessage}>Modificación de semilla exitoso</Text>

                            <View style={styles.alertButtonsContainer}>
                                <TouchableOpacity
                                    onPress={() => setActiveContent('seeds')}
                                    style={styles.alertButton}
                                >
                                    <Text style={styles.alertButtonText}>Continuar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* MODAL CANCELAR */}
                <Modal visible={showCancelModal} transparent animationType="fade">
                    <View style={styles.modalOverlay}>
                        <View style={styles.confirmBox}>
                            <Text style={styles.confirmText}>¿Está seguro que quiere cancelar la edición?</Text>
                            <View style={styles.confirmButtons}>
                                <TouchableOpacity style={styles.confirmButton} onPress={() => setActiveContent('seeds')}>
                                    <Text style={styles.confirmButtonText}>Sí</Text>
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.confirmButton} onPress={() => setShowCancelModal(false)}>
                                    <Text style={styles.confirmButtonText}>No</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </ScrollView>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({

    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        backgroundColor: '#FFFCE3'
    },

    title: {
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
        elevation: 5
    },

    inputGroup: {
        marginBottom: 15
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
        marginHorizontal: 10,
        paddingHorizontal: 20,
        paddingVertical: 10
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

    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },

    confirmBox: {
        backgroundColor: '#FFFCE3',
        padding: 25,
        borderRadius: 12,
        alignItems: 'center',
        width: '80%'
    },

    confirmText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
        fontWeight: '500'
    },

    confirmButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },

    confirmButton: {
        backgroundColor: '#A01BAC',
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 25,
        marginHorizontal: 10
    },

    confirmButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },
})

export default EditSeedScreen;