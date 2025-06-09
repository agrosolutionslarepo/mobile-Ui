import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, TextInput, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

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
    const [showAlertCancel, setShowAlertCancel] = useState(false);

    const [nombreSemilla, setNombreSemilla] = useState(selectedSeed?.nombreSemilla || '');
    const [tipoSemilla, setTipoSemilla] = useState(selectedSeed?.tipoSemilla || '');
    const [cantidadSemilla, setCantidadSemilla] = useState(String(selectedSeed?.cantidadSemilla || ''));
    const [unidad, setUnidad] = useState(selectedSeed?.unidad || '');

    /*const editSeed = () => {
        setShowAlertEdit(true);
    };*/

    const cancelSeedEdit = () => {
        setShowAlertCancel(true);
    };

    const goToSeedsScreen = () => {
        setActiveContent('seeds');
    };

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

            await axios.put(`http://localhost:3000/semillas/updateSemilla/${selectedSeed._id}`, updatedSeed, {
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
                    <Picker
                        selectedValue={unidad}
                        onValueChange={(itemValue) => {
                            if (itemValue !== '') setUnidad(itemValue);
                        }}
                        style={styles.picker}
                    >
                        {unidad === '' && (
                            <Picker.Item label="Seleccionar unidad" value="" />
                        )}
                        <Picker.Item label="Toneladas (ton)" value="ton" />
                        <Picker.Item label="Kilogramos (kg)" value="kg" />
                    </Picker>
                </View>

                <View style={styles.formButtonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={cancelSeedEdit}>
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
                                onPress={goToSeedsScreen}
                                style={styles.alertButton}
                            >
                                <Text style={styles.alertButtonText}>Continuar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal para la alerta de cancelar la edición de una semilla */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showAlertCancel}
            >
                <View style={styles.modalView}>
                    <View style={styles.alertView}>
                        <Text style={styles.alertMessage}>¿Esta seguro que quiere cancelar<br />la modificación de esta semilla?</Text>

                        <View style={styles.alertButtonsContainer}>
                            <TouchableOpacity
                                onPress={goToSeedsScreen}
                                style={styles.alertButton}
                            >
                                <Text style={styles.alertButtonText}>Si</Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => setShowAlertCancel(false)}
                                style={styles.alertButton}
                            >
                                <Text style={styles.alertButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
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
        marginBottom:20,
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


    picker: {
        width: '80%',

        height: Platform.OS === 'ios' ? 180 : 40,
        padding: 0,

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
})

export default EditSeedScreen;