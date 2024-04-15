import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity} from 'react-native';

const ViewCropScreen = ({ setActiveContent }: { setActiveContent: (content: string) => void }) => {

    const goToCropsScreen = () => {
        setActiveContent('crops');
    };


    return (
        <View style={styles.cropContainer}>
            <Text style={styles.cropTitle}>Cosecha</Text>

            <View style={styles.formContainer}>

                <Text style={styles.plotText}>Nombre de cosecha</Text>

                <Text style={styles.plotText}>Parcela</Text>

                <Text style={styles.plotText}>Semilla</Text>

                <Text style={styles.plotText}>Día de cosecha</Text>

                <TouchableOpacity style={styles.button} onPress={goToCropsScreen}>
                    <Text style={styles.buttonText}>Volver</Text>
                </TouchableOpacity>

            </View>
        </View>
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

export default ViewCropScreen;