import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, TextInput, Platform, TouchableWithoutFeedback, Keyboard } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';

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

    /*const editSeed = () => {
        setShowAlertEdit(true);
    };*/

    const editSeed = async () => {
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
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.seedContainer}>
                <Text style={styles.seedTitle}>Modificar semilla</Text>

                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#666"
                        placeholder="Nombre Semilla"
                        value={nombreSemilla}
                        onChangeText={setNombreSemilla}
                        editable={false} // ❌ Deshabilitado
                    />
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#666"
                        placeholder="Tipo de Semilla"
                        value={tipoSemilla}
                        onChangeText={setTipoSemilla}
                        editable={false} // ❌ Deshabilitado
                    />
                    <TextInput
                        style={styles.input}
                        placeholderTextColor="#666"
                        placeholder="Cantidad"
                        value={cantidadSemilla}
                        onChangeText={setCantidadSemilla}
                        keyboardType="numeric"
                    />

                    <View>
                        <View style={styles.pickerInputContainer}>
                            <View style={styles.pickerInputWrapper}>
                                <Picker
                                    selectedValue={unidad}
                                    onValueChange={(itemValue) => {
                                        if (itemValue !== '') setUnidad(itemValue);
                                    }}
                                    style={styles.pickerInput}
                                >
                                    {unidad === '' && (
                                        <Picker.Item label="Seleccionar unidad" value="" />
                                    )}
                                    <Picker.Item label="Kilogramos (kg)" value="kg" />
                                    <Picker.Item label="Toneladas (ton)" value="ton" />
                                </Picker>
                            </View>
                        </View>
                    </View>


                    <View style={styles.formButtonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={() => setShowCancelModal(true)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelButton} onPress={editSeed}>
                            <Text style={styles.buttonText}>Guardar</Text>
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
            </View>
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({

    seedContainer: {
        flex: 1,
        paddingHorizontal: 20,
        backgroundColor: '#FFFCE3'
    },

    seedTitle: {
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 22,
        color: '#665996',
        textTransform: 'uppercase'
    },

    formContainer: {
        flex: 1,
        alignContent: 'center',
        justifyContent: 'center',
        width: '100%',

        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5
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

        fontSize: 20,
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
        width: '80%',
        marginLeft: '10%',
        marginRight: '10%'
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