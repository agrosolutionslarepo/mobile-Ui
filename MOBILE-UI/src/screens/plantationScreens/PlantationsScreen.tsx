import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../config';

interface Cultivo {
    _id: string;
    fechaSiembra: string;
    fechaCosecha: string;
    cantidadSemilla: number;
    unidad: string;
    estado: boolean;
    empresa: string;
    semilla: {
        nombreSemilla: string;
        tipoSemilla: string;
    };
    parcela: {
        nombreParcela: string;
        tamaño: number;
        ubicacion: string;
    };
}

const PlantationsScreen = ({ setActiveContent }: { setActiveContent: (screen: string, data?: any) => void }) => {
    const [plantaciones, setPlantaciones] = useState<Cultivo[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedToDelete, setSelectedToDelete] = useState<string | null>(null);
    const [showAlertDelete, setShowDeleteModal] = useState(false);


    const fetchPlantaciones = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) return;

            const response = await axios.get(`${API_URL}/cultivos/getAllCultivos`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setPlantaciones(response.data);
        } catch (error) {
            console.error('Error al obtener plantaciones:', error);
        } finally {
            setLoading(false);
        }
    };

    const deletePlantacion = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token || !selectedToDelete) return;

            await axios.delete(`${API_URL}/cultivos/deleteCultivo/${selectedToDelete}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            setShowDeleteModal(false);
            setSelectedToDelete(null);
            fetchPlantaciones(); // Refrescar lista
        } catch (error) {
            console.error('Error al eliminar plantación:', error);
            Alert.alert('Error', 'No se pudo eliminar la plantación.');
        }
    };


    useEffect(() => {
        fetchPlantaciones();
    }, []);

    const goToAddPlantationScreen = () => {
        setActiveContent('addPlantation');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Plantaciones</Text>

            <TouchableOpacity style={styles.addButton} onPress={goToAddPlantationScreen}>
                <Image source={require('../../assets/img/add.png')} style={styles.addImage} resizeMode="contain" />
            </TouchableOpacity>

            <View style={styles.listContainer}>
                {loading ? (
                    <Text style={{ textAlign: 'center' }}>Cargando plantaciones...</Text>
                ) : (
                    plantaciones.map((cultivo) => (
                        <TouchableOpacity
                            key={cultivo._id}
                            style={styles.itemContainer}
                            onPress={() => setActiveContent('viewPlantation', cultivo)}
                        >
                            <Image source={require('../../assets/img/plantation.png')} style={styles.itemImage} resizeMode="contain" />

                            <View style={styles.textContainer}>
                                <Text style={styles.itemTitle}>{cultivo.semilla.nombreSemilla}</Text>
                                <Text style={styles.itemText}>Parcela: {cultivo.parcela.nombreParcela}</Text>
                                <Text style={styles.itemText}>Tipo: {cultivo.semilla.tipoSemilla}</Text>
                                <Text style={styles.itemText}>Siembra: {new Date(cultivo.fechaSiembra).toLocaleDateString()}</Text>
                            </View>

                            <TouchableOpacity onPress={() => setActiveContent('editPlantation', cultivo)}>
                                <Image source={require('../../assets/img/edit.png')} style={styles.editImage} resizeMode="contain" />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    setSelectedToDelete(cultivo._id);
                                    setShowDeleteModal(true);
                                }}
                            >
                                <Image source={require('../../assets/img/delete.png')} style={styles.deleteImage} resizeMode="contain" />
                            </TouchableOpacity>

                        </TouchableOpacity>
                    ))
                )}
            </View>

            <Modal animationType="fade" transparent={true} visible={showAlertDelete}>
                <View style={styles.modalView}>
                    <View style={styles.alertView}>
                        <Text style={styles.alertMessage}>¿Está seguro que quiere eliminar esta parcela?</Text>

                        <View style={styles.alertButtonsContainer}>
                            <TouchableOpacity onPress={deletePlantacion} style={styles.alertButton}>
                                <Text style={styles.alertButtonText}>Sí</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowDeleteModal(false)} style={styles.alertButton}>
                                <Text style={styles.alertButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#FFFCE3',
        alignItems: 'center'
    },
    title: {
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
        fontSize: 22,
        color: '#665996',
        textTransform: 'uppercase'
    },
    addButton: {
        marginBottom: 20,
        backgroundColor: '#D9D9D9',
        width: '90%',
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center'
    },
    addImage: {
        width: 32,
        height: 36
    },
    listContainer: {
        width: '100%',
    },
    itemContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: '5%',
        marginBottom: 20,
        padding: 20,
        backgroundColor: '#fff',
        borderRadius: 10,
        borderColor: '#96947B',
        borderWidth: 1,
        elevation: 5,
        shadowColor: '#96947B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.75,
        shadowRadius: 3.84
    },
    itemImage: {
        width: 64,
        height: 64,
        marginRight: 10
    },
    textContainer: {
        width: '50%'
    },
    itemTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: 'rgb(42, 125, 98)'
    },
    itemText: {
        fontSize: 14
    },
    editImage: {
        width: 32,
        height: 32,
        marginLeft: 10
    },
    deleteImage: {
        width: 32,
        height: 32,
        marginLeft: 10
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
        maxWidth: '80%'
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
});

export default PlantationsScreen;
