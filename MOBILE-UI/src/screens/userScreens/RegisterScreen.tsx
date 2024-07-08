import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image, Modal } from 'react-native';

const RegisterScreen = ({ setActiveContent }: { setActiveContent: (content: string) => void }) => {
    const [name, setName] = useState('');
    const [lastname, setLastname] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mail, setMail] = useState('');
    const [showAlertEmpty, setShowAlertEmpty] = useState(false); // Estado para controlar si se muestra la alerta de falta de campos
    const [showAlertSuccess, setShowAlertSuccess] = useState(false); // Estado para controlar si se muestra la alerta de registro de cuenta exitoso
    const [showAlertFail, setShowAlertFail] = useState(false); // Estado para controlar si se muestra la alerta de registro de cuenta fallido

    const handleRegister = () => {
        if (name !== "" && lastname!=="" && username !== '' && password !== '' && mail !== '' && username !== 'error') {
            setShowAlertSuccess(true); // Mostrar alerta de registro de cuenta  exitoso
        } else if (username == 'error') {
            setShowAlertFail(true); // Mostrar alerta de registro de cuenta fallido
        } else {
            setShowAlertEmpty(true); // Mostrar alerta de falta de campos
        }
    };

    const goToLoginScreen = () => {
        setActiveContent('login')
    }

    const goToHomeScreen = () => {
        setActiveContent('home')
    }

    return (
        <ImageBackground
            source={require('../../assets/img/backgroundLogIn.png')}
            style={styles.background}
        >
            <View style={styles.container}>

                <Image
                    source={require('../../assets/img/logoNew.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />

                <Text style={styles.textForm}>Nombre</Text>
                <TextInput
                    style={styles.input}
                    placeholder=""
                    value={name}
                    onChangeText={setName}
                />

                <Text style={styles.textForm}>Apellido</Text>
                <TextInput
                    style={styles.input}
                    placeholder=""
                    value={lastname}
                    onChangeText={setLastname}
                />

                <Text style={styles.textForm}>Usuario</Text>
                <TextInput
                    style={styles.input}
                    placeholder=""
                    value={username}
                    onChangeText={setUsername}
                />

                <Text style={styles.textForm}>Contraseña</Text>
                <TextInput
                    style={styles.input}
                    placeholder=""
                    secureTextEntry={true}
                    value={password}
                    onChangeText={setPassword}
                />

                <Text style={styles.textForm}>E-Mail</Text>
                <TextInput
                    style={styles.input}
                    placeholder=""
                    value={mail}
                    onChangeText={setMail}
                />

                <TouchableOpacity style={styles.button} onPress={handleRegister}>
                    <Text style={styles.buttonText}>Crear cuenta</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.backButton} onPress={goToLoginScreen}>

                    <Image
                        source={require('../../assets/img/arrowLeft.png')}
                        style={styles.backImage}
                        resizeMode="contain"
                    />

                    <Text style={styles.backButtonText}>Volver</Text>
                </TouchableOpacity>

                {/* Modal para la alerta de falta de campo*/}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showAlertEmpty}
                    onRequestClose={() => {
                        setShowAlertEmpty(false);
                    }}
                >
                    <View style={styles.modalView}>
                        <View style={styles.alertView}>
                            <Text style={styles.alertTitle}>Campos incompletos</Text>
                            <Text style={styles.alertMessage}>Por favor, complete todos los campos.</Text>
                            <TouchableOpacity
                                onPress={() => setShowAlertEmpty(false)}
                                style={styles.alertButton}
                            >
                                <Text style={styles.alertButtonText}>Volver</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Modal para la alerta de registro de cuenta exitoso*/}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showAlertSuccess}
                    onRequestClose={() => {
                        setShowAlertSuccess(false);
                    }}
                >
                    <View style={styles.modalView}>
                        <View style={styles.alertView}>
                            <Text style={styles.alertTitle}>Cuenta creada con exito</Text>
                            <TouchableOpacity
                                onPress={goToHomeScreen}
                                style={styles.alertButton}
                            >
                                <Text style={styles.alertButtonText}>Continuar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Modal para la alerta de registro de cuenta fallido */}
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={showAlertFail}
                    onRequestClose={() => {
                        setShowAlertFail(false);
                    }}
                >
                    <View style={styles.modalView}>
                        <View style={styles.alertView}>
                            <Text style={styles.alertTitle}>Oh no! Algo salio mal!</Text>
                            <Text style={styles.alertMessage}>Compruebe la información de los campos e intentelo nuevamente.</Text>
                            <TouchableOpacity
                                onPress={() => setShowAlertFail(false)}
                                style={styles.alertButton}
                            >
                                <Text style={styles.alertButtonText}>Volver</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({

    background: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },

    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },

    logo: {
        width: 250,
        height: 150,
        marginBottom: 15
    },

    textForm: {
        width: '80%',
        textAlign: 'left',
        fontSize: 20,
        color: '#D9D9D9',
        fontWeight: 'bold',
        marginLeft: 15
    },

    input: {
        width: '80%',
        height: 35,
        padding: 10,
        marginBottom: 20,
        backgroundColor: '#D9D9D9',
        borderRadius: 25,

        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.75,
        shadowRadius: 3.84,
        elevation: 5,
    },

    button: {
        color: '#F5F5F5',
        marginTop: 20,
        fontSize: 20,
        width: '50%',
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

    backButton: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },

    backImage: {
        width: 16,
        height: 16,
        marginRight: 8
    },

    backButtonText: {
        color: '#FF8BFA',
        fontSize: 20,
        fontWeight: 'bold'
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

    alertButton: {
        backgroundColor: '#A01BAC',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 20,
    },

    alertButtonText: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },

});

export default RegisterScreen;
