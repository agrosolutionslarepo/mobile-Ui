import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MaterialIcons } from '@expo/vector-icons';
import axios from 'axios';

const ViewProfileScreen = ({ setActiveContent }: { setActiveContent: (screen: string) => void }) => {
    const [userData, setUserData] = useState<any>(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [showPasswordModal, setShowPasswordModal] = useState(false);
    const [password, setPassword] = useState('');

    useEffect(() => {
        const fetchUserFromApi = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) return;

                const response = await axios.get(
                    'http://localhost:3000/usuarios/getUsuarioAutenticado',
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );

                if (response.status === 200) {
                    const data = response.data;
                    setUserData(data);
                } else {
                    console.error('No se pudo obtener los datos del usuario');
                }
            } catch (error: any) {
                console.error('Error al consultar el usuario:', error?.response?.data || error.message);
            }
        };

        fetchUserFromApi();
    }, []);

    const handleConfirmDelete = async () => {
        setShowConfirmModal(false);
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) return;

            const response = await axios.put(
                'http://localhost:3000/usuarios/deleteUsuario',
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (response.status === 200) {
                await AsyncStorage.removeItem('userToken');
                setActiveContent('login');
            } else {
                console.error('No se pudo eliminar el usuario');
            }
        } catch (error: any) {
            console.error('Error al eliminar usuario:', error?.response?.data || error.message);
        }
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Mi Perfil</Text>

            {userData && (
                <View style={styles.infoContainer}>
                    {/* Datos del usuario */}
                    <View style={styles.infoRow}>
                        <MaterialIcons name="person" size={20} color="#666" style={styles.icon} />
                        <Text style={styles.label}>Nombre:</Text>
                        <Text style={styles.value}>{userData.nombre}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="person-outline" size={20} color="#666" style={styles.icon} />
                        <Text style={styles.label}>Apellido:</Text>
                        <Text style={styles.value}>{userData.apellido}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="account-circle" size={20} color="#666" style={styles.icon} />
                        <Text style={styles.label}>Usuario:</Text>
                        <Text style={styles.value}>{userData.nombreUsuario}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="email" size={20} color="#666" style={styles.icon} />
                        <Text style={styles.label}>Email:</Text>
                        <Text style={styles.value}>{userData.email}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <MaterialIcons name="calendar-today" size={20} color="#666" style={styles.icon} />
                        <Text style={styles.label}>Nacimiento:</Text>
                        <Text style={styles.value}>{new Date(userData.fechaNacimiento).toLocaleDateString()}</Text>
                    </View>

                    {/* Botones */}
                    <TouchableOpacity style={styles.editButton} onPress={() => setActiveContent('editProfile')}>
                        <Text style={styles.editButtonText}>Editar perfil</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.deleteButton} onPress={() => setShowConfirmModal(true)}>
                        <Text style={styles.deleteButtonText}>Eliminar usuario</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.changePasswordButton}
                        onPress={() => setActiveContent('changePassword')}
                    >
                        <Text style={styles.changePasswordButtonText}>Cambiar contraseña</Text>
                    </TouchableOpacity>

                </View>
            )}

            {/* Modal Confirmación */}
            <Modal transparent={true} visible={showConfirmModal} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>¿Estás seguro?</Text>
                        <Text style={styles.modalMessage}>Esta acción eliminará tu cuenta permanentemente.</Text>
                        <View style={{ flexDirection: 'row', gap: 20, justifyContent: 'space-evenly', marginTop: 20 }}>
                            <TouchableOpacity onPress={() => setShowConfirmModal(false)} style={[styles.modalButton, { backgroundColor: '#aaa' }]}>
                                <Text style={styles.modalButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleConfirmDelete} style={styles.modalButton}>
                                <Text style={styles.modalButtonText}>Sí, eliminar</Text>
                            </TouchableOpacity>

                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    // ... estilos anteriores
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        backgroundColor: 'rgb(217, 217, 217)'
    },
    title: {
        fontSize: 28,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 30,
    },
    infoContainer: {
        backgroundColor: '#FFFCE3',
        borderRadius: 15,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    icon: {
        marginRight: 10,
    },
    label: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333',
        width: 100,
    },
    value: {
        fontSize: 16,
        color: '#666',
        flex: 1,
    },
    editButton: {
        marginTop: 20,
        backgroundColor: '#A01BAC',
        paddingVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 5,
    },
    editButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    deleteButton: {
        marginTop: 10,
        backgroundColor: '#DC3545',
        paddingVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 5,
    },
    deleteButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBox: {
        backgroundColor: '#FFFCE3',
        padding: 20,
        borderRadius: 15,
        width: '80%',
        alignItems: 'center'
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center'
    },
    modalButton: {
        backgroundColor: '#A01BAC',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 10
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
    passwordInput: {
        width: '100%',
        backgroundColor: '#fff',
        borderRadius: 10,
        padding: 10,
        marginTop: 10,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#ccc'
    },
    changePasswordButton: {
        marginTop: 10,
        backgroundColor: '#720E85',
        paddingVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 5,
    },
    changePasswordButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },

});

export default ViewProfileScreen;
