import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ImageBackground,
    Image,
    Modal,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';
import axios from 'axios';
import { MaterialIcons } from '@expo/vector-icons';
import { API_URL } from '../../config';

const RecoverScreen = ({ setActiveContent }: { setActiveContent: (content: string) => void }) => {
    const [mail, setMail] = useState('');
    const [emailError, setEmailError] = useState(false);
    const [showAlertEmpty, setShowAlertEmpty] = useState(false); // Estado para controlar si se muestra la alerta de falta de campos
    const [showAlertSuccess, setShowAlertSuccess] = useState(false); // Estado para controlar si se muestra la alerta de envio de recuperación exitoso
    const [showAlertFail, setShowAlertFail] = useState(false); // Estado para controlar si se muestra la alerta de envio de recuperación fallido
    const [loading, setLoading] = useState(false);

    const handleRecover = async () => {
        const isEmpty = !mail.trim();
        setEmailError(isEmpty);

        if (isEmpty) {
            setShowAlertEmpty(true);
            return;
        }

        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/usuarios/solicitarReset`, {
                email: mail
            });

            if (response.status === 200 || response.status === 201) {
                setShowAlertSuccess(true);
            } else {
                setShowAlertFail(true);
            }
        } catch (error) {
            console.error('Error al solicitar recuperación:', error);
            setShowAlertFail(true);
        } finally {
            setLoading(false);
        }
    };

    const goToLoginScreen = () => {
        setActiveContent('login')
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
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

                        <Text style={styles.recoverText}>¡Recupera tu contraseña!</Text>


                        <Text style={styles.textForm}>E-Mail</Text>
                        <View style={[styles.inputWithIcon, emailError && styles.inputError]}>
                            <MaterialIcons name="email" size={20} color="#666" style={styles.icon} />
                            <TextInput
                                style={styles.input}
                                placeholder="ejemplo@correo.com"
                                placeholderTextColor="#888"
                                value={mail}
                                onChangeText={text => {
                                    setMail(text);
                                    setEmailError(false);
                                }}
                            />
                        </View>

                        <TouchableOpacity style={styles.button} onPress={handleRecover} disabled={loading}>
                            {loading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Enviar</Text>
                            )}
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
                                    <Text style={styles.alertTitle}>Campo incompleto</Text>
                                    <Text style={styles.alertMessage}>Por favor, complete el campo.</Text>
                                    <TouchableOpacity
                                        onPress={() => setShowAlertEmpty(false)}
                                        style={styles.alertButton}
                                    >
                                        <Text style={styles.alertButtonText}>Volver</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        {/* Modal para la alerta de envio de mail de recuperación exitoso*/}
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
                                    <Text style={styles.alertTitle}>¡Listo!</Text>
                                    <Text style={styles.alertMessage}>Te enviamos un correo con un código válido por 1 hora.</Text>
                                    <TouchableOpacity
                                        onPress={() => {
                                            setShowAlertSuccess(false);
                                            setActiveContent('confirmReset');
                                        }}
                                        style={styles.alertButton}
                                    >
                                        <Text style={styles.alertButtonText}>Aceptar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Modal>

                        {/* Modal para la alerta de que el mail no existe */}
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
                                    <Text style={styles.alertMessage}>{`El mail no existe.\nIntentelo nuevamente.`}</Text>
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
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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

    recoverText: {
        fontSize: 30,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#F9F9F9'
    },

    textForm: {
        width: '80%',
        textAlign: 'left',
        fontSize: 20,
        color: '#D9D9D9',
        fontWeight: 'bold',
        marginLeft: 15
    },

    inputWithIcon: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '80%',
        height: 42,
        backgroundColor: '#D9D9D9',
        borderRadius: 25,
        paddingHorizontal: 14,
        marginBottom: 20,
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.75,
        shadowRadius: 3.84,
        elevation: 5,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
        paddingVertical: 0,
        backgroundColor: 'transparent',
        width: '100%'
    },
    icon: {
        marginRight: 10,
    },

    inputError: {
        borderWidth: 2,
        borderColor: 'red',
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

});

export default RecoverScreen;