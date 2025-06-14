import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Alert, ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import * as Clipboard from 'expo-clipboard';
import { MaterialIcons, Feather } from '@expo/vector-icons';
import { API_URL } from '../../config';

const CompanyScreen = ({ setActiveContent }: { setActiveContent: (screen: string) => void }) => {
    const [inviteCodes, setInviteCodes] = useState<any[]>([]);
    const [activeCode, setActiveCode] = useState<string | null>(null);
    const [nombreEmpresa, setNombreEmpresa] = useState('');
    const [loading, setLoading] = useState(false);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [selectedCode, setSelectedCode] = useState<string | null>(null);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [statusMessage, setStatusMessage] = useState('');
    const [showCopiedModal, setShowCopiedModal] = useState(false);
    const [usuariosEmpresa, setUsuariosEmpresa] = useState<any[]>([]);
    const [showDeleteUserModal, setShowDeleteUserModal] = useState(false);
    const [usuarioAEliminar, setUsuarioAEliminar] = useState<string | null>(null);
    const [showResultModal, setShowResultModal] = useState(false);
    const [resultMessage, setResultMessage] = useState('');
    const [isErrorResult, setIsErrorResult] = useState(false);
    const [showActiveCodeModal, setShowActiveCodeModal] = useState(false);





    useEffect(() => {
        const fetchActiveCode = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                const res = await axios.get(`${API_URL}/inviteCodes/getActiveInviteCode`, {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setActiveCode(res.data.codigo || null);
                setInviteCodes(res.data.codigo ? [{ codigo: res.data.codigo, estado: true }] : []);
            } catch (err) {
                console.error('Error al obtener código activo:', err);
            }
        };

        fetchActiveCode();
        fetchNombreEmpresa();
        fetchUsuariosEmpresa();
    }, []);

    const fetchNombreEmpresa = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const res = await axios.get(`${API_URL}/empresas/getNombreEmpresa`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setNombreEmpresa(res.data.nombreEmpresa);
        } catch (err) {
            console.error('Error al obtener nombre de empresa:', err);
        }
    };

    const createInviteCode = async () => {
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            const res = await axios.post(`${API_URL}/inviteCodes/createInviteCode`, {}, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInviteCodes([{ codigo: res.data.codigo, estado: true }]);
            setActiveCode(res.data.codigo);
            setShowCreateModal(false);
            Alert.alert('Código generado', `Código: ${res.data.codigo}`);
        } catch (err) {
            console.error('Error creando código:', err);
            setShowCreateModal(false);
            setShowErrorModal(true);
        } finally {
            setLoading(false);
        }
    };

    const checkInviteCode = async (code: string) => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const res = await axios.post(`${API_URL}/inviteCodes/checkInviteCode`, { code }, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setStatusMessage(`Código ${code} está ${res.data.valid ? 'ACTIVO' : 'DESACTIVADO'}`);
            setShowStatusModal(true);
        } catch (err) {
            setStatusMessage('Código inválido o expirado');
            setShowStatusModal(true);
        }
    };

    const confirmDeleteCode = (code: string) => {
        setSelectedCode(code);
        setShowDeleteModal(true);
    };

    const deleteInviteCode = async () => {
        if (!selectedCode) return;
        try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.delete(`${API_URL}/inviteCodes/deleteInviteCode`, {
                headers: { Authorization: `Bearer ${token}` },
                data: { code: selectedCode }
            });
            setInviteCodes([]);
            setActiveCode(null);
            setShowDeleteModal(false);
            setSelectedCode(null);
            Alert.alert('Código eliminado', `Código: ${selectedCode}`);
        } catch (err) {
            console.error('Error al eliminar código:', err);
        }
    };

    const handleCopyCode = async (code: string) => {
        await Clipboard.setStringAsync(code);
        setShowCopiedModal(true);
    };

    const fetchUsuariosEmpresa = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            const res = await axios.get(`${API_URL}/usuarios/getUsuariosMismaEmpresa`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setUsuariosEmpresa(res.data); // ← asumiendo que es un array
        } catch (err) {
            console.error('Error al obtener usuarios de la empresa:', err);
        }
    };

    const eliminarUsuario = async () => {
        if (!usuarioAEliminar) return;

        try {
            const token = await AsyncStorage.getItem('userToken');
            await axios.put(
                `${API_URL}/usuarios/deleteUsuarioDeMiEmpresa/${usuarioAEliminar}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            setShowDeleteUserModal(false);
            setUsuarioAEliminar(null);
            fetchUsuariosEmpresa();
            setResultMessage('✅ Usuario eliminado correctamente');
            setIsErrorResult(false);
            setShowResultModal(true);
        } catch (error) {
            console.error('Error al eliminar usuario:', error);
            setResultMessage('❌ No se pudo eliminar el usuario');
            setIsErrorResult(true);
            setShowResultModal(true);
        }
    };

    const handleGenerateCodePress = async () => {
        if (!activeCode) {
            setShowCreateModal(true);
            return;
        }

        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('userToken');
            const res = await axios.post(
                `${API_URL}/inviteCodes/checkInviteCode`,
                { code: activeCode },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.valid) {
                setShowActiveCodeModal(true);
            } else {
                setShowCreateModal(true);
            }
        } catch (err) {
            console.error('Error verificando código activo:', err);
            setShowActiveCodeModal(true);
        } finally {
            setLoading(false);
        }
    };



    return (
        <ScrollView style={styles.container}>

            <View style={styles.infoContainer}>
                <Text style={styles.title}>Empresa</Text>
                <View style={styles.empresaContainer}>
                    <MaterialIcons name="business" size={22} color="#665996" style={{ marginRight: 8 }} />
                    <Text style={styles.empresaNombre}>{nombreEmpresa}</Text>
                </View>
                <TouchableOpacity style={styles.editButton} onPress={() => setActiveContent('editCompany')}>
                    <Text style={styles.editButtonText}>Editar nombre de empresa</Text>
                </TouchableOpacity>

            </View>


            <View style={styles.infoContainer}>
                <Text style={styles.title}>código de invitación</Text>
                {inviteCodes.length === 0 ? (
                    <Text style={[{ textAlign: 'center' }]}>No hay códigos generados aún</Text>
                ) : (
                    inviteCodes.map((item, index) => (
                        <View style={styles.codeContainer} key={index}>
                            <Text style={styles.label}>{item.codigo}</Text>
                            <View style={styles.iconGroup}>
                                <TouchableOpacity onPress={() => checkInviteCode(item.codigo)}>
                                    <MaterialIcons name="check-circle-outline" size={24} color={item.estado ? 'green' : 'orange'} />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => handleCopyCode(item.codigo)}>
                                    <Feather name="copy" size={24} color="#007bff" />
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => confirmDeleteCode(item.codigo)}>
                                    <MaterialIcons name="delete-outline" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                        </View>
                    ))
                )}
                <TouchableOpacity
                    style={styles.editButton}
                    onPress={handleGenerateCodePress}
                >
                    <Text style={styles.editButtonText}>Generar código de invitación</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.infoContainer}>
                <Text style={styles.title}>Usuarios de la empresa</Text>
                {usuariosEmpresa.length === 0 ? (
                    <Text style={{ textAlign: 'center' }}>No hay usuarios registrados aún</Text>
                ) : (
                    usuariosEmpresa.map((usuario, index) => (
                        <View key={index} style={styles.userItem}>
                            <View style={styles.userInfo}>
                                <MaterialIcons name="person" size={20} color="#665996" style={{ marginRight: 8 }} />
                                <Text style={styles.userText}>{usuario.nombreUsuario}</Text>
                            </View>
                            <TouchableOpacity onPress={() => {
                                setUsuarioAEliminar(usuario._id);
                                setShowDeleteUserModal(true);
                            }}>
                                <MaterialIcons name="delete-outline" size={24} color="red" />
                            </TouchableOpacity>


                        </View>

                    ))
                )}
            </View>


            {/* Modal Crear Código */}
            <Modal visible={showCreateModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalMessage}>¿Deseás generar un nuevo código de invitación?</Text>

                        <TouchableOpacity style={styles.modalButton} onPress={createInviteCode}>
                            <Text style={styles.modalButtonText}>Confirmar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#ccc' }]} onPress={() => setShowCreateModal(false)}>
                            <Text style={[styles.modalButtonText, { color: '#333' }]}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Código Activo */}
            <Modal visible={showActiveCodeModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Código activo</Text>
                        <Text style={styles.modalMessage}>
                            Ya hay un código activo. Para generar otro, primero borrá el anterior.
                        </Text>

                        <TouchableOpacity style={styles.modalButton} onPress={() => setShowActiveCodeModal(false)}>
                            <Text style={styles.modalButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Confirmar Eliminación */}
            <Modal visible={showDeleteModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Eliminar código</Text>
                        <Text style={styles.modalMessage}>¿Estás seguro de eliminar el código {selectedCode}?</Text>

                        <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#DC3545' }]} onPress={deleteInviteCode}>
                            <Text style={styles.modalButtonText}>Eliminar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.modalButton, { backgroundColor: '#ccc' }]} onPress={() => setShowDeleteModal(false)}>
                            <Text style={[styles.modalButtonText, { color: '#333' }]}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal de error al crear codigo */}
            <Modal visible={showErrorModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Error</Text>
                        <Text style={styles.modalMessage}>No se pudo generar el código de invitación. Intentá nuevamente.</Text>

                        <TouchableOpacity style={styles.modalButton} onPress={() => setShowErrorModal(false)}>
                            <Text style={styles.modalButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/*Modal status de codigo*/}
            <Modal visible={showStatusModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Estado del código</Text>
                        <Text style={styles.modalMessage}>{statusMessage}</Text>

                        <TouchableOpacity style={styles.modalButton} onPress={() => setShowStatusModal(false)}>
                            <Text style={styles.modalButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/*Modal para copiar el codigo*/}
            <Modal visible={showCopiedModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>¡Copiado!</Text>
                        <Text style={styles.modalMessage}>El código fue copiado al portapapeles</Text>

                        <TouchableOpacity style={styles.modalButton} onPress={() => setShowCopiedModal(false)}>
                            <Text style={styles.modalButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Confirmar Eliminación de Usuario */}
            <Modal visible={showDeleteUserModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Eliminar usuario</Text>
                        <Text style={styles.modalMessage}>¿Estás seguro de que querés eliminar este usuario?</Text>

                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: '#DC3545' }]}
                            onPress={eliminarUsuario}
                        >
                            <Text style={styles.modalButtonText}>Eliminar</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.modalButton, { backgroundColor: '#ccc' }]}
                            onPress={() => {
                                setShowDeleteUserModal(false);
                                setUsuarioAEliminar(null);
                            }}
                        >
                            <Text style={[styles.modalButtonText, { color: '#333' }]}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal Resultado de Eliminación */}
            <Modal visible={showResultModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={[styles.modalTitle, { color: isErrorResult ? '#dc3545' : '#28a745' }]}>
                            {isErrorResult ? 'Error' : 'Éxito'}
                        </Text>
                        <Text style={styles.modalMessage}>{resultMessage}</Text>

                        <TouchableOpacity style={styles.modalButton} onPress={() => setShowResultModal(false)}>
                            <Text style={styles.modalButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        backgroundColor: '#FFFCE3'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 20,
        alignSelf: 'center',
        color: '#665996',
        textTransform: 'uppercase'
    },
    empresaContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 15,
        marginBottom: 25,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 5,
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#eee',
    },

    empresaNombre: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        textAlign: 'center',
    },

    activeCodeCard: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f0f0f0',
        padding: 12,
        borderRadius: 10,
        marginBottom: 20,
        gap: 10,
        alignSelf: 'center'
    },
    activeCodeText: {
        fontSize: 16,
        color: '#333'
    },
    infoContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 20,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.2,
        shadowRadius: 2,
        elevation: 5
    },
    codeContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 15
    },
    userItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },

    userText: {
        fontSize: 16,
        color: '#333',
    },

    label: {
        fontWeight: 'bold',
        fontSize: 16,
        color: '#333'
    },
    iconGroup: {
        flexDirection: 'row',
        gap: 15
    },
    editButton: {
        marginTop: 20,
        backgroundColor: '#A01BAC',
        paddingVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
        elevation: 5
    },
    editButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
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
});

export default CompanyScreen;
