// EditPlantationScreen.tsx
import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Modal,
    ScrollView,
    StyleSheet,
    Alert
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const EditPlantationScreen = ({ setActiveContent, selectedCultivo }) => {
    const [fechaSiembra, setFechaSiembra] = useState('');
    const [fechaCosecha, setFechaCosecha] = useState('');
    const [cantidadSemilla, setCantidadSemilla] = useState('');
    const [unidad, setUnidad] = useState('');

    const [selectedDay, setSelectedDay] = useState('01');
    const [selectedMonth, setSelectedMonth] = useState('01');
    const [selectedYear, setSelectedYear] = useState('2025');
    const [showDateModal, setShowDateModal] = useState(false);
    const [isSiembraPicker, setIsSiembraPicker] = useState(true);

    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [showCancelModal, setShowCancelModal] = useState(false);

    useEffect(() => {
        if (selectedCultivo) {
            setFechaSiembra(selectedCultivo.fechaSiembra);
            setFechaCosecha(selectedCultivo.fechaCosecha);
            setCantidadSemilla(String(selectedCultivo.cantidadSemilla));
            setUnidad(selectedCultivo.unidad);
        }
    }, [selectedCultivo]);

    const getDaysInMonth = (month: string, year: string): number => {
        const m = parseInt(month, 10);
        const y = parseInt(year, 10);
        return new Date(y, m, 0).getDate();
    };

    const allowOnlyNumbers = (value: string) => value.replace(/[^0-9]/g, '');

    const handleSave = async () => {
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('Token no encontrado');

            await fetch(`http://localhost:3000/cultivos/updateCultivo/${selectedCultivo._id}`,
                {
                    method: 'PUT',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({
                        fechaSiembra,
                        fechaCosecha,
                        cantidadSemilla: parseFloat(cantidadSemilla),
                        unidad
                    })
                });

            setShowSuccessModal(true);
        } catch (error) {
            Alert.alert('Error', 'No se pudo actualizar la plantaci\u00f3n.');
        }
    };

    const handleConfirmDate = () => {
        const localDate = new Date(Number(selectedYear), Number(selectedMonth) - 1, Number(selectedDay));
        const isoDate = localDate.toISOString();

        if (isSiembraPicker) {
            setFechaSiembra(isoDate);
        } else {
            setFechaCosecha(isoDate);
        }

        setShowDateModal(false);
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Editar Plantación</Text>

            <View style={styles.form}>
                <Text style={styles.label}>🌱 Fecha de siembra</Text>
                <TouchableOpacity
                    style={styles.input}
                    onPress={() => { setIsSiembraPicker(true); setShowDateModal(true); }}
                >
                    <Text style={{ textAlign: 'center', color: fechaSiembra ? '#000' : '#999' }}>
                        {fechaSiembra ? fechaSiembra.split('T')[0] : 'Seleccionar fecha'}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.label}>🌾 Fecha de cosecha</Text>
                <TouchableOpacity
                    style={[styles.input]}
                    onPress={() => { setIsSiembraPicker(false); setShowDateModal(true); }}
                >
                    <Text style={{ textAlign: 'center', color: fechaCosecha ? '#000' : '#999' }}>
                        {fechaCosecha ? fechaCosecha.split('T')[0] : 'Seleccionar fecha'}
                    </Text>
                </TouchableOpacity>

                <Text style={styles.label}>🔢 Cantidad de semilla</Text>
                <TextInput
                    style={styles.input}
                    value={cantidadSemilla}
                    onChangeText={(text) => setCantidadSemilla(allowOnlyNumbers(text))}
                    keyboardType="numeric"
                />

                <Text style={styles.label}>⚖️ Unidad</Text>
                <View>
                    <Picker selectedValue={unidad} onValueChange={setUnidad} style={styles.picker}>
                        <Picker.Item label="Seleccione unidad" value="" />
                        <Picker.Item label="Kilogramos (kg)" value="kg" />
                        <Picker.Item label="Toneladas (ton)" value="ton" />
                    </Picker>
                </View>


                <View style={styles.buttonGroup}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => setShowCancelModal(true)}>
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.buttonText}>Guardar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* MODAL FECHA */}
            <Modal visible={showDateModal} transparent animationType="fade">
                <View style={styles.modalView}>
                    <View style={styles.modalBox}>
                        <Text style={styles.label}>Seleccionar fecha de {isSiembraPicker ? 'siembra' : 'cosecha'}</Text>
                        <View style={styles.pickerRow}>
                            <Picker selectedValue={selectedDay} onValueChange={setSelectedDay} style={styles.datePicker}>
                                {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => {
                                    const day = String(i + 1).padStart(2, '0');
                                    return <Picker.Item key={day} label={day} value={day} />;
                                })}
                            </Picker>
                            <Picker selectedValue={selectedMonth} onValueChange={setSelectedMonth} style={styles.datePicker}>
                                {Array.from({ length: 12 }, (_, i) => {
                                    const month = String(i + 1).padStart(2, '0');
                                    return <Picker.Item key={month} label={month} value={month} />;
                                })}
                            </Picker>
                            <Picker selectedValue={selectedYear} onValueChange={setSelectedYear} style={styles.datePicker}>
                                {Array.from({ length: 10 }, (_, i) => {
                                    const year = String(new Date().getFullYear() + i);
                                    return <Picker.Item key={year} label={year} value={year} />;
                                })}
                            </Picker>
                        </View>
                        <TouchableOpacity style={styles.saveButton} onPress={handleConfirmDate}>
                            <Text style={styles.buttonText}>Confirmar</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setShowDateModal(false)}>
                            <Text style={styles.buttonText}>Cancelar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* MODAL ÉXITO */}
            <Modal visible={showSuccessModal} transparent animationType="fade">
                <View style={styles.modalView}>
                    <View style={styles.modalBox}>
                        <Text style={styles.label}>✅ Plantación actualizada correctamente</Text>
                        <TouchableOpacity style={styles.saveButton} onPress={() => setActiveContent('plantations')}>
                            <Text style={styles.buttonText}>Continuar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* MODAL CANCELAR */}
            <Modal visible={showCancelModal} transparent animationType="fade">
                <View style={styles.modalOverlay}>
                    <View style={styles.confirmBox}>
                        <Text style={styles.confirmText}>¿Está seguro que quiere cancelar la edición?</Text>
                        <View style={styles.confirmButtons}>
                            <TouchableOpacity style={styles.confirmButton} onPress={() => setActiveContent('plantations')}>
                                <Text style={styles.confirmButtonText}>Sí</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.confirmButton} onPress={() => setShowCancelModal(false)}>
                                <Text style={styles.confirmButtonText}>No</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>


        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
        backgroundColor: '#FFFCE3'
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        marginBottom: 20, color: '#665996'
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: 15,
        padding: 20,
        elevation: 5
    },
    label: {
        marginBottom: 5,
        fontWeight: 'bold',
        fontSize: 18,
        color: 'rgb(42, 125, 98)'
    },
    input: {
        backgroundColor: '#D9D9D9',
        borderRadius: 25,
        padding: 10,
        marginBottom: 15,
        textAlign: 'center',
        fontWeight: 'bold',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.75,
        shadowRadius: 3.84,
    },
    inputText: {
        fontWeight: 'bold'
    },
    pickerContainer: {
        backgroundColor: '#D9D9D9',
        borderRadius: 25,
        overflow: 'hidden',
        marginBottom: 20
    },
    picker: {
        width: '100%',

        height: 40,
        padding: 0,
        marginBottom: 20,

        backgroundColor: '#D9D9D9',
        borderRadius: 25,

        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        borderWidth: 0,

        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.75,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10
    },
    saveButton: {
        backgroundColor: '#A01BAC',
        padding: 10,
        borderRadius: 25,
        alignItems: 'center',
        width: '48%'
    },
    cancelButton: {
        backgroundColor: '#aaa',
        padding: 10,
        borderRadius: 25,
        alignItems: 'center',
        width: '48%'
    },
    buttonText: {
        color: '#fff', fontWeight: 'bold'
    },
    modalView: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    modalBox: {
        backgroundColor: '#FFFCE3',
        padding: 20,
        borderRadius: 15,
        width: '85%',
        alignItems: 'center'
    },
    pickerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 10,
        width: '100%'
    },
    datePicker: {
        backgroundColor: '#fff',
        borderRadius: 15,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.15,
        shadowRadius: 2,
        width: 85,
        height: 40,
        justifyContent: 'center',
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'center',
        alignItems: 'center'
    },
    confirmBox: {
        backgroundColor: '#FFFCE3',
        padding: 25,
        borderRadius: 12,
        alignItems: 'center',
        width: '80%'
    },
    confirmText: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
        fontWeight: '500'
    },
    confirmButtons: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%'
    },
    confirmButton: {
        backgroundColor: '#A01BAC',
        paddingHorizontal: 25,
        paddingVertical: 10,
        borderRadius: 25,
        marginHorizontal: 10
    },
    confirmButtonText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 16
    },

});

export default EditPlantationScreen;

