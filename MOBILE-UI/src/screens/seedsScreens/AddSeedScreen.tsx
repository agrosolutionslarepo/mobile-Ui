import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, TextInput } from 'react-native';

const AddSeedScreen = ({ setActiveContent }: { setActiveContent: (content: string) => void }) => {
    const [showAlertAdd, setShowAlertAdd] = useState(false); // Estado para controlar si se muestra la alerta de agregar semilla
    const [showAlertCancel, setShowAlertCancel] = useState(false); // Estado para controlar si se muestra la alerta de agregar semilla

    const addSeed = () => {
        setShowAlertAdd(true);
    };

    const cancelSeedAdd = () => {
        setShowAlertCancel(true);
    };

    const goToSeedScreen = () => {
        setActiveContent('seeds');
    };


    return (
        <View style={styles.seedContainer}>
            <Text style={styles.seedsTitle}>Agregar semilla</Text>

            <View style={styles.formContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nombre Semilla"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Parcela"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Día de cosecha"
                />

                <TextInput
                    style={styles.input}
                    placeholder="Día de siembra"
                />

                <View style={styles.formButtonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={cancelSeedAdd}>
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.cancelButton} onPress={addSeed}>
                        <Text style={styles.buttonText}>Agregar</Text>
                    </TouchableOpacity>
                </View>

            </View>

            {/* Modal para la alerta de agregar semilla*/}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showAlertAdd}
                onRequestClose={() => {
                    setShowAlertAdd(false);
                }}
                >
                <View style={styles.modalView}>
                    <View style={styles.alertView}>
                        <Text style={styles.alertMessage}>Ingreso de semilla exitoso</Text>

                        <View style={styles.alertButtonsContainer}>
                            <TouchableOpacity
                                onPress={goToSeedScreen}
                                style={styles.alertButton}
                            >
                                <Text style={styles.alertButtonText}>Continuar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            {/* Modal para la alerta de cancelar el ingreso de una nueva semilla */}
            <Modal
                animationType="fade"
                transparent={true}
                visible={showAlertCancel}
                onRequestClose={() => {
                    setShowAlertAdd(false);
                }}
                >
                <View style={styles.modalView}>
                    <View style={styles.alertView}>
                        <Text style={styles.alertMessage}>¿Esta seguro que quiere cancelar<br />el ingreso de esta semilla?</Text>

                        <View style={styles.alertButtonsContainer}>
                            <TouchableOpacity
                                onPress={goToSeedScreen}
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
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFFCE3',
        width: '100%'
    },

    seedsTitle: {
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

        height: 35,
        padding: 10,

        marginLeft: '10%',
        marginRight: '10%',
        marginBottom: 20,

        backgroundColor: '#D9D9D9',
        borderRadius: 25,

        fontSize:20,
        fontWeight:'bold',

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
        backgroundColor: 'white',
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
})

export default AddSeedScreen;