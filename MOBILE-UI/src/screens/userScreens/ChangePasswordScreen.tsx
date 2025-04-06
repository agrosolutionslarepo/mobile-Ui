import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Modal
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const ChangePasswordScreen = ({ setActiveContent }: { setActiveContent: (screen: string) => void }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [repeatPassword, setRepeatPassword] = useState('');
    const [showMismatchModal, setShowMismatchModal] = useState(false);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showEmptyFieldsModal, setShowEmptyFieldsModal] = useState(false);


    const handleSave = () => {
        if (!currentPassword.trim() || !newPassword.trim() || !repeatPassword.trim()) {
            setShowEmptyFieldsModal(true);
            return;
        }

        if (newPassword !== repeatPassword) {
            setShowMismatchModal(true);
            return;
        }

        // Aquí conectarías con el backend
        setShowSuccessModal(true);
    };


    return (
        <View style={styles.container}>
            <Text style={styles.title}>Cambiar Contraseña</Text>

            <View style={styles.infoContainer}>
                <View style={styles.inputGroup}>
                    <MaterialIcons name="lock" size={20} color="#666" style={styles.icon} />
                    <TextInput
                        placeholder="Contraseña actual"
                        placeholderTextColor="#888"
                        secureTextEntry
                        style={styles.input}
                        value={currentPassword}
                        onChangeText={setCurrentPassword}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <MaterialIcons name="lock-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput
                        placeholder="Nueva contraseña"
                        placeholderTextColor="#888"
                        secureTextEntry
                        style={styles.input}
                        value={newPassword}
                        onChangeText={setNewPassword}
                    />
                </View>

                <View style={styles.inputGroup}>
                    <MaterialIcons name="lock-outline" size={20} color="#666" style={styles.icon} />
                    <TextInput
                        placeholder="Repetir nueva contraseña"
                        placeholderTextColor="#888"
                        secureTextEntry
                        style={styles.input}
                        value={repeatPassword}
                        onChangeText={setRepeatPassword}
                    />
                </View>

                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveButtonText}>Guardar cambios</Text>
                </TouchableOpacity>

                <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setActiveContent('profile')}
                >
                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                </TouchableOpacity>
            </View>

            {/* Modal campos vacíos */}
            <Modal transparent visible={showEmptyFieldsModal} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Campos incompletos</Text>
                        <Text style={styles.modalMessage}>Por favor completá todos los campos.</Text>
                        <TouchableOpacity
                            onPress={() => setShowEmptyFieldsModal(false)}
                            style={styles.modalButton}
                        >
                            <Text style={styles.modalButtonText}>Volver</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>


            {/* Modal error */}
            <Modal transparent visible={showMismatchModal} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>Error</Text>
                        <Text style={styles.modalMessage}>Las nuevas contraseñas no coinciden.</Text>
                        <TouchableOpacity
                            onPress={() => setShowMismatchModal(false)}
                            style={styles.modalButton}
                        >
                            <Text style={styles.modalButtonText}>Volver</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal éxito */}
            <Modal transparent visible={showSuccessModal} animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.modalBox}>
                        <Text style={styles.modalTitle}>¡Listo!</Text>
                        <Text style={styles.modalMessage}>Contraseña actualizada correctamente.</Text>
                        <TouchableOpacity
                            onPress={() => {
                                setShowSuccessModal(false);
                                setActiveContent('profile');
                            }}
                            style={styles.modalButton}
                        >
                            <Text style={styles.modalButtonText}>Volver al perfil</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 60,
        backgroundColor: 'rgb(217, 217, 217)',
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
    inputGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#D9D9D9',
        borderRadius: 25,
        paddingHorizontal: 15,
        marginBottom: 20,
        height: 42,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.75,
        shadowRadius: 3.84,
        elevation: 5,
    },
    icon: {
        marginRight: 10,
    },
    input: {
        flex: 1,
        fontSize: 16,
        color: '#000',
    },
    saveButton: {
        backgroundColor: '#A01BAC',
        paddingVertical: 10,
        borderRadius: 25,
        alignItems: 'center',
        marginTop: 10,
        elevation: 5,
    },
    saveButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 18,
    },
    cancelButton: {
        marginTop: 15,
        alignItems: 'center',
    },
    cancelButtonText: {
        color: '#A01BAC',
        fontWeight: 'bold',
        fontSize: 16,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalBox: {
        backgroundColor: '#FFFCE3',
        padding: 20,
        borderRadius: 15,
        width: '80%',
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
    },
    modalButton: {
        backgroundColor: '#A01BAC',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 25,
        marginTop: 20,
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default ChangePasswordScreen;