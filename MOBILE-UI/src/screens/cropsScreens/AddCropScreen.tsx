import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';

const AddCropScreen = ({ setActiveContent }: { setActiveContent: (content: string) => void }) => {
    const [showAlertAdd, setShowAlertAdd] = useState(false); // Estado para controlar si se muestra la alerta de agregar cosecha
    const [showAlertCancel, setShowAlertCancel] = useState(false); // Estado para controlar si se muestra la alerta de agregar cosecha

    const addCrop = () => {
        setShowAlertAdd(true);
    };

    const cancelCropAdd = () => {
        setShowAlertCancel(true);
    };

    const goToCropsScreen = () => {
        setActiveContent('crops');
    };


    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
            <View style={styles.cropContainer}>
                <Text style={styles.cropTitle}>Agregar cosecha</Text>

                <View style={styles.formContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Nombre de cosecha"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Parcela"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Semilla"
                    />

                    <TextInput
                        style={styles.input}
                        placeholder="Día de la coseha"
                    />

                    <View style={styles.formButtonsContainer}>
                        <TouchableOpacity style={styles.button} onPress={cancelCropAdd}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.cancelButton} onPress={addCrop}>
                            <Text style={styles.buttonText}>Agregar</Text>
                        </TouchableOpacity>
                    </View>

                </View>

                {/* Modal para la alerta de agregar cosecha exitoso*/}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showAlertAdd}
                >
                    <View style={styles.modalView}>
                        <View style={styles.alertView}>
                            <Text style={styles.alertMessage}>Ingreso de cosecha exitoso</Text>

                            <View style={styles.alertButtonsContainer}>
                                <TouchableOpacity
                                    onPress={goToCropsScreen}
                                    style={styles.alertButton}
                                >
                                    <Text style={styles.alertButtonText}>Continuar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

                {/* Modal para la alerta de cancelar el ingreso de una nueva cosecha */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showAlertCancel}
                >
                    <View style={styles.modalView}>
                        <View style={styles.alertView}>
                            <Text style={styles.alertMessage}>¿Esta seguro que quiere cancelar<br />el ingreso de esta cosecha?</Text>

                            <View style={styles.alertButtonsContainer}>
                                <TouchableOpacity
                                    onPress={goToCropsScreen}
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
        </TouchableWithoutFeedback>
    );
}

const styles = StyleSheet.create({

    cropContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFFCE3',
        width: '100%'
    },

    cropTitle: {
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

export default AddCropScreen;