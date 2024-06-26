import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, TextInput } from 'react-native';

const ViewSeedScreen = ({ setActiveContent }: { setActiveContent: (content: string) => void }) => {

    const goToSeedsScreen = () => {
        setActiveContent('seeds');
    };


    return (
        <View style={styles.seedContainer}>
            <Text style={styles.seedTitle}>Semilla</Text>

            <View style={styles.formContainer}>

                <Text style={styles.seedText}>Nombre Semilla</Text>

                <Text style={styles.seedText}>Parcela</Text>

                <Text style={styles.seedText}>Día de cosecha</Text>

                <Text style={styles.seedText}>Día de siembra</Text>

                <TouchableOpacity style={styles.button} onPress={goToSeedsScreen}>
                    <Text style={styles.buttonText}>Volver</Text>
                </TouchableOpacity>

            </View>
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

    seedTitle: {
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

    seedText: {
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

    button: {
        color: '#F5F5F5',
        marginTop: 20,
        fontSize: 20,
        width: '50%',
        marginLeft:'25%',
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
})

export default ViewSeedScreen;