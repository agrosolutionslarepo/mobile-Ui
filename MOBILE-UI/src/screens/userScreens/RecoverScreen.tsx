import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground, Image } from 'react-native';

const RecoverScreen = ({ setActiveContent }: { setActiveContent: (content: string) => void }) => {
    const [mail, setMail] = useState('');

    const handleRecover = () => {
        if (mail !== '') {
            setActiveContent('home');
        } else {
            console.log('Por favor, complete ambos campos');
        }
    };

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

                <Text style={styles.recoverText}>¡Recupera tu contraseña!</Text>

                <Text style={styles.textForm}>E-Mail</Text>
                <TextInput
                    style={styles.input}
                    placeholder=""
                    value={mail}
                    onChangeText={setMail}
                />

                <TouchableOpacity style={styles.button} onPress={handleRecover}>
                    <Text style={styles.buttonText}>Enviar</Text>
                </TouchableOpacity>

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

});

export default RecoverScreen;