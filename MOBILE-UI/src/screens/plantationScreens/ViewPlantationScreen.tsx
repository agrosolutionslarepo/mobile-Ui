import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';

interface Props {
    setActiveContent: (screen: string) => void;
    selectedPlantation: any; // Puedes tiparlo mejor si lo deseas
}

const ViewPlantationScreen: React.FC<Props> = ({ setActiveContent, selectedPlantation }) => {
    const goBack = () => setActiveContent('plantations');

    if (!selectedPlantation) {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>No se encontró el cultivo</Text>
                <TouchableOpacity style={styles.button} onPress={goBack}>
                    <Text style={styles.buttonText}>Volver</Text>
                </TouchableOpacity>
            </View>
        );
    }

    const { fechaSiembra, fechaCosecha, cantidadSemilla, unidad, estado, semilla, parcela } = selectedPlantation;

    return (
        <ScrollView style={styles.container}>
            <Text style={styles.title}>Cultivo</Text>

            <View style={styles.box}>
                <Text style={styles.label}>📅 Fecha de siembra</Text>
                <Text style={styles.value}>{fechaSiembra.split('T')[0]}</Text>

                <Text style={styles.label}>🌾 Fecha estimada de cosecha</Text>
                <Text style={styles.value}>{fechaCosecha.split('T')[0]}</Text>

                <Text style={styles.label}>🌱 Cantidad sembrada</Text>
                <Text style={styles.value}>{cantidadSemilla} {unidad}</Text>

                <Text style={styles.label}>⚙️ Estado</Text>
                <Text style={styles.value}>{estado ? 'Activo' : 'Inactivo'}</Text>
            </View>

            <Text style={styles.title}>Semilla</Text>
            <View style={styles.box}>
                <Text style={styles.label}>📛 Nombre</Text>
                <Text style={styles.value}>{semilla.nombreSemilla}</Text>

                <Text style={styles.label}>🧬 Tipo</Text>
                <Text style={styles.value}>{semilla.tipoSemilla}</Text>
            </View>

            <Text style={styles.title}>Parcela asociada</Text>
            <View style={styles.box}>
                <Text style={styles.label}>📛 Nombre</Text>
                <Text style={styles.value}>{parcela.nombreParcela}</Text>

                <Text style={styles.label}>📐 Tamaño</Text>
                <Text style={styles.value}>{parcela.tamaño} ha</Text>

                <Text style={styles.label}>📍 Ubicación</Text>
                <Text style={styles.value}>{parcela.ubicacion}</Text>

                <Text style={styles.label}>🌡️ GDD</Text>
                <Text style={styles.value}>{parcela.gdd}</Text>

                <Text style={styles.label}>🌐 Coordenadas</Text>
                <Text style={styles.value}>Lat: {parcela.latitud}, Lon: {parcela.longitud}</Text>

                <Text style={styles.label}>⚙️ Estado</Text>
                <Text style={styles.value}>{parcela.estado ? 'Activa' : 'Inactiva'}</Text>

                <TouchableOpacity style={styles.button} onPress={goBack}>
                    <Text style={styles.buttonText}>Volver</Text>
                </TouchableOpacity>

            </View>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFCE3',
        paddingHorizontal: 20
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#665996',
        textAlign: 'center',
        marginVertical: 20,
        textTransform: 'uppercase'
    },
    box: {
        backgroundColor: '#fff',
        borderRadius: 15,
        paddingVertical: 20,
        marginBottom: 20,
        elevation: 5
    },
    label: {
        marginLeft: '5%',
        marginBottom: 5,
        fontWeight: 'bold',
        fontSize: 18,
        color: 'rgb(42, 125, 98)',
    },
    value: {
        width: '90%',
        marginLeft: '5%',
        marginBottom: 15,
        padding: 10,
        backgroundColor: '#D9D9D9',
        borderRadius: 25,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        elevation: 3,
    },
    button: {
        marginTop: 20,
        width: '50%',
        marginLeft: '25%',
        height: 40,
        backgroundColor: '#A01BAC',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        elevation: 5,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    }
});

export default ViewPlantationScreen;
