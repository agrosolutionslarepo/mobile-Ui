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
    Alert,
    Platform,
    TouchableWithoutFeedback,
    Keyboard,
    ActivityIndicator,
    KeyboardAvoidingView
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '../../config';
import { MaterialIcons } from '@expo/vector-icons';

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

    const [loading, setLoading] = useState(false);

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
        setLoading(true);
        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('Token no encontrado');

            await fetch(`${API_URL}/cultivos/updateCultivo/${selectedCultivo._id}`,
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
            Alert.alert('Error', 'No se pudo actualizar la plantación.');
            setTimeout(() => setLoading(false), 1000);
        } finally {
            setLoading(false);
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
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                <ScrollView contentContainerStyle={styles.container}>
                    <Text style={styles.title}>Editar Plantación</Text>

                    <View style={styles.form}>
                        <View style={styles.labelContainer}>
                            <MaterialIcons name="event" size={22} color="rgb(42, 125, 98)" />
                            <Text style={styles.label}>Fecha de siembra</Text>
                        </View>
                        <TouchableOpacity
                            style={styles.input}
                            onPress={() => { setIsSiembraPicker(true); setShowDateModal(true); }}
                        >
                            <Text style={{ textAlign: 'center', color: fechaSiembra ? '#000' : '#999' }}>
                                {fechaSiembra ? fechaSiembra.split('T')[0] : 'Seleccionar fecha'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.labelContainer}>
                            <MaterialIcons name="event" size={22} color="rgb(42, 125, 98)" />
                            <Text style={styles.label}>Fecha de cosecha</Text>
                        </View>
                        <TouchableOpacity
                            style={[styles.input]}
                            onPress={() => { setIsSiembraPicker(false); setShowDateModal(true); }}
                        >
                            <Text style={{ textAlign: 'center', color: fechaCosecha ? '#000' : '#999' }}>
                                {fechaCosecha ? fechaCosecha.split('T')[0] : 'Seleccionar fecha'}
                            </Text>
                        </TouchableOpacity>

                        <View style={styles.labelContainer}>
                            <MaterialIcons name="format-list-numbered" size={22} color="rgb(42, 125, 98)" />
                            <Text style={styles.label}>Cantidad de semilla</Text>
                        </View>
                        <TextInput
                            style={styles.input}
                            value={cantidadSemilla}
                            onChangeText={(text) => setCantidadSemilla(allowOnlyNumbers(text))}
                            keyboardType="numeric"
                        />

                        <View>
                            <View style={styles.labelContainer}>
                                <MaterialIcons name="scale" size={22} color="rgb(42, 125, 98)" />
                                <Text style={styles.label}>Unidad</Text>
                            </View>
                            <View style={styles.pickerInputContainer}>
                                <View style={styles.pickerInputWrapper}>
                                    <Picker
                                        selectedValue={unidad} onValueChange={setUnidad} style={styles.pickerInput}
                                    >
                                        <Picker.Item label="Seleccione unidad" value="" />
                                        <Picker.Item label="Kilogramos (kg)" value="kg" />
                                        <Picker.Item label="Toneladas (ton)" value="ton" />
                                    </Picker>
                                </View>
                            </View>
                        </View>


                        <View style={styles.buttonGroup}>
                            <TouchableOpacity
                                style={styles.cancelButton}
                                onPress={() => setShowCancelModal(true)}
                                disabled={loading}
                            >
                                <Text style={styles.buttonText}>Cancelar</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={loading}>
                                {loading ? (
                                    <ActivityIndicator color="#fff" />
                                ) : (
                                    <Text style={styles.buttonText}>Guardar</Text>
                                )}
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/*Modal de fecha*/}
                    <Modal transparent visible={showDateModal} animationType="fade">
                        <View style={styles.modalView}>
                            <View style={styles.alertViewDate}>
                                <Text style={styles.alertTitle}>
                                    Seleccionar fecha de {isSiembraPicker ? 'siembra' : 'cosecha'}
                                </Text>

                                <View style={styles.pickerContainer}>
                                    {/* DÍA */}
                                    <View style={styles.pickerGroup}>
                                        <Text style={styles.pickerLabel}>Día</Text>
                                        <View style={styles.pickerBox}>
                                            <Picker
                                                selectedValue={selectedDay}
                                                onValueChange={(value) => setSelectedDay(value)}
                                                style={styles.pickerDate}
                                            >
                                                {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => {
                                                    const day = (i + 1).toString().padStart(2, '0');
                                                    return <Picker.Item key={day} label={day} value={day} />;
                                                })}
                                            </Picker>
                                        </View>
                                    </View>

                                    {/* MES */}
                                    <View style={styles.pickerGroup}>
                                        <Text style={styles.pickerLabel}>Mes</Text>
                                        <View style={styles.pickerBox}>
                                            <Picker
                                                selectedValue={selectedMonth}
                                                onValueChange={(value) => {
                                                    setSelectedMonth(value);
                                                    const maxDay = getDaysInMonth(value, selectedYear);
                                                    if (parseInt(selectedDay) > maxDay) {
                                                        setSelectedDay(maxDay.toString().padStart(2, '0'));
                                                    }
                                                }}
                                                style={styles.pickerDate}
                                            >
                                                {Array.from({ length: 12 }, (_, i) => {
                                                    const month = (i + 1).toString().padStart(2, '0');
                                                    return <Picker.Item key={month} label={month} value={month} />;
                                                })}
                                            </Picker>
                                        </View>
                                    </View>

                                    {/* AÑO */}
                                    <View style={styles.pickerGroup}>
                                        <Text style={styles.pickerLabel}>Año</Text>
                                        <View style={styles.pickerBox}>
                                            <Picker
                                                selectedValue={selectedYear}
                                                onValueChange={(value) => {
                                                    setSelectedYear(value);
                                                    const maxDay = getDaysInMonth(selectedMonth, value);
                                                    if (parseInt(selectedDay) > maxDay) {
                                                        setSelectedDay(maxDay.toString().padStart(2, '0'));
                                                    }
                                                }}
                                                style={styles.pickerDate}
                                            >
                                                {Array.from({ length: 10 }, (_, i) => {
                                                    const year = (new Date().getFullYear() + i).toString(); // desde hoy a futuro
                                                    return <Picker.Item key={year} label={year} value={year} />;
                                                })}
                                            </Picker>
                                        </View>
                                    </View>
                                </View>

                                <TouchableOpacity
                                    style={styles.alertButtonDate}
                                    onPress={() => {
                                        const localDate = new Date(Number(selectedYear), Number(selectedMonth) - 1, Number(selectedDay));
                                        const dateISO = localDate.toISOString();

                                        if (isSiembraPicker) {
                                            setFechaSiembra(dateISO);
                                        } else {
                                            setFechaCosecha(dateISO);
                                        }
                                        setShowDateModal(false);
                                    }}

                                >
                                    <Text style={styles.alertButtonTextDate}>Confirmar</Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={[styles.alertButtonDate, { marginTop: 10, backgroundColor: '#aaa' }]}
                                    onPress={() => setShowDateModal(false)}
                                >
                                    <Text style={styles.alertButtonTextDate}>Cancelar</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>

                    {/* MODAL ÉXITO */}
                    <Modal visible={showSuccessModal} transparent animationType="fade">
                        <View style={styles.modalView}>
                            <View style={styles.modalBox}>
                                <Text style={styles.alertMessage}>Plantación actualizada correctamente</Text>
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
            </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
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
    labelContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 5,
    },
    label: {
        fontWeight: 'bold',
        marginLeft: 6,
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
        flexDirection: 'column', // antes: 'row'
        alignItems: 'center',
        width: '100%',
        marginVertical: 10,
        gap: 12,
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
    pickerInputContainer: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.75,
        shadowRadius: 3.84,
        elevation: 5,
    },
    pickerInputWrapper: {
        backgroundColor: '#D9D9D9',
        borderRadius: 25,
        marginBottom: 20,
        ...Platform.select({
            ios: {
                height: 120,
                justifyContent: 'center',
                overflow: 'hidden',
            },
            android: {
                height: 50,
                justifyContent: 'center',
            },
        }),
    },
    pickerInput: {
        width: '100%',
        color: '#000',
        fontSize: 16,
        textAlign: 'center',
        ...Platform.select({
            ios: {
                height: 220,
                textAlignVertical: 'center',
            },
            android: {
                height: 60,
            },
        }),
    },
    alertViewDate: {
        backgroundColor: '#FFFCE3',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        width: '90%',
        minHeight: Platform.OS === 'ios' ? 550 : 250,
        maxHeight: Platform.OS === 'ios' ? 700 : undefined,
    },
    alertTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    pickerGroup: {
        alignItems: 'center',
        marginBottom: 10,
        width: '100%',
    },
    pickerLabel: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 4,
        color: '#555',
    },
    pickerBox: {
        backgroundColor: '#fff',
        borderRadius: 15,
        width: '100%',
        height: 120,
        justifyContent: 'center',
        overflow: 'hidden',
        alignItems: 'center',
        ...Platform.select({
            ios: {
                height: 120,
            },
            android: {
                height: 48,
            },
        }),

    },
    pickerDate: {
        height: Platform.OS === 'ios' ? 220 : 40,
        width: '100%',
        color: '#333',
        fontSize: Platform.OS === 'ios' ? 20 : 16,
        textAlign: 'center',
        textAlignVertical: 'center',
        ...Platform.select({
            ios: {
                height: 220,
                textAlignVertical: 'center',
            },
            android: {
                height: 60,
            },
        }),
    },

    alertMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center'
    },

    alertButtonDate: {
        backgroundColor: '#A01BAC',
        borderRadius: 20,
        marginHorizontal: 10,
        paddingHorizontal: 20,
        paddingVertical: 10
    },

    alertButtonTextDate: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
});

export default EditPlantationScreen;

