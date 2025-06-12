import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

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
                <View style={styles.labelContainer}>
                    <MaterialIcons name="event" size={22} color="rgb(42, 125, 98)" />
                    <Text style={styles.label}>Fecha de siembra</Text>
                </View>
                <Text style={styles.value}>{fechaSiembra.split('T')[0]}</Text>

                <View style={styles.labelContainer}>
                    <MaterialIcons name="event" size={22} color="rgb(42, 125, 98)" />
                    <Text style={styles.label}>Fecha estimada de cosecha</Text>
                </View>
                <Text style={styles.value}>{fechaCosecha.split('T')[0]}</Text>

                <View style={styles.labelContainer}>
                    <MaterialIcons name="format-list-numbered" size={22} color="rgb(42, 125, 98)" />
                    <Text style={styles.label}>Cantidad sembrada</Text>
                </View>
                <Text style={styles.value}>{cantidadSemilla} {unidad}</Text>

                <View style={styles.labelContainer}>
                    <MaterialIcons name="settings" size={22} color="rgb(42, 125, 98)" />
                    <Text style={styles.label}>Estado</Text>
                </View>
                <Text style={styles.value}>{estado ? 'Activo' : 'Inactivo'}</Text>
            </View>

            <Text style={styles.title}>Semilla</Text>
            <View style={styles.box}>
                <View style={styles.labelContainer}>
                    <MaterialIcons name="local-florist" size={22} color="rgb(42, 125, 98)" />
                    <Text style={styles.label}>Nombre</Text>
                </View>
                <Text style={styles.value}>{semilla.nombreSemilla}</Text>

                <View style={styles.labelContainer}>
                    <MaterialIcons name="category" size={22} color="rgb(42, 125, 98)" />
                    <Text style={styles.label}>Tipo</Text>
                </View>
                <Text style={styles.value}>{semilla.tipoSemilla}</Text>
            </View>

            <Text style={styles.title}>Parcela asociada</Text>
            <View style={styles.box}>
                <View style={styles.labelContainer}>
                    <MaterialIcons name="drive-file-rename-outline" size={22} color="rgb(42, 125, 98)" />
                    <Text style={styles.label}>Nombre</Text>
                </View>
                <Text style={styles.value}>{parcela.nombreParcela}</Text>

                <View style={styles.labelContainer}>
                    <MaterialIcons name="square-foot" size={22} color="rgb(42, 125, 98)" />
                    <Text style={styles.label}>Tamaño</Text>
                </View>
                <Text style={styles.value}>{parcela.tamaño} ha</Text>

                <View style={styles.labelContainer}>
                    <MaterialIcons name="location-on" size={22} color="rgb(42, 125, 98)" />
                    <Text style={styles.label}>Ubicación</Text>
                </View>
                <Text style={styles.value}>{parcela.ubicacion}</Text>

                <View style={styles.labelContainer}>
                    <MaterialIcons name="device-thermostat" size={22} color="rgb(42, 125, 98)" />
                    <Text style={styles.label}>GDD</Text>
                </View>
                <Text style={styles.value}>{parcela.gdd}</Text>

                <View style={styles.labelContainer}>
                    <MaterialIcons name="public" size={22} color="rgb(42, 125, 98)" />
                    <Text style={styles.label}>Coordenadas</Text>
                </View>
                <Text style={styles.value}>Lat: {parcela.latitud}, Lon: {parcela.longitud}</Text>

                <View style={styles.labelContainer}>
                    <MaterialIcons name="settings" size={22} color="rgb(42, 125, 98)" />
                    <Text style={styles.label}>Estado</Text>
                </View>
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
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
        marginLeft: '5%',
    },
    label: {
        fontWeight: 'bold',
        marginLeft: 6,
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
