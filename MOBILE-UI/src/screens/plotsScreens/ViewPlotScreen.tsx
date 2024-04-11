import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity} from 'react-native';

const ViewPlotScreen = ({ setActiveContent }: { setActiveContent: (content: string) => void }) => {

    const goToPlotsScreen = () => {
        setActiveContent('plots');
    };


    return (
        <View style={styles.plotContainer}>
            <Text style={styles.plotTitle}>Parcela</Text>

            <View style={styles.formContainer}>

                <Text style={styles.plotText}>Nombre de parcela</Text>

                <Text style={styles.plotText}>Tamaño</Text>

                <Text style={styles.plotText}>Ubicación</Text>

                <Text style={styles.plotText}>Abono</Text>

                <TouchableOpacity style={styles.button} onPress={goToPlotsScreen}>
                    <Text style={styles.buttonText}>Volver</Text>
                </TouchableOpacity>

            </View>
        </View>
    );
}

const styles = StyleSheet.create({

    plotContainer: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        backgroundColor: '#FFFCE3',
        width: '100%'
    },

    plotTitle: {
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

    plotText: {
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

export default ViewPlotScreen;