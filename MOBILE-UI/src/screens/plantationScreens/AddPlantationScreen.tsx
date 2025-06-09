import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Modal, TextInput, Alert, ScrollView } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { API_URL } from '../../config';


const AddPlantationScreen = ({ setActiveContent }) => {
    const [fechaSiembra, setFechaSiembra] = useState('');
    const [fechaCosecha, setFechaCosecha] = useState('');
    const [cantidadSemilla, setCantidadSemilla] = useState('');
    const [unidad, setUnidad] = useState('');
    const [semilla, setSemilla] = useState('');
    const [parcela, setParcela] = useState('');
    const [semillasDisponibles, setSemillasDisponibles] = useState<any[]>([]);
    const [parcelasDisponibles, setParcelasDisponibles] = useState<any[]>([]);
    const [fechaSiembraError, setFechaSiembraError] = useState(false);
    const [fechaCosechaError, setFechaCosechaError] = useState(false);
    const [cantidadError, setCantidadError] = useState(false);
    const [unidadError, setUnidadError] = useState(false);
    const [semillaError, setSemillaError] = useState(false);
    const [parcelaError, setParcelaError] = useState(false);
    const [showInvalidDatesModal, setShowInvalidDatesModal] = useState(false);
    const [showInvalidQuantityModal, setShowInvalidQuantityModal] = useState(false);


    // Fecha seleccionada (siembra o cosecha)
    const [showDateModal, setShowDateModal] = useState(false);
    const [isSiembraPicker, setIsSiembraPicker] = useState(true);

    const [selectedDay, setSelectedDay] = useState('01');
    const [selectedMonth, setSelectedMonth] = useState('01');
    const [selectedYear, setSelectedYear] = useState('2025');

    const [showAlertAdd, setShowAlertAdd] = useState(false);
    const [showAlertCancel, setShowAlertCancel] = useState(false);
    const [showErrorModal, setShowErrorModal] = useState(false);
    const [showIncompleteModal, setShowIncompleteModal] = useState(false);

    const allowOnlyNumbers = (value: string) => value.replace(/[^0-9]/g, '');
    const allowAlphanumeric = (value: string) => value.replace(/[^a-zA-Z0-9\s]/g, '');

    const goToPlantationsScreen = () => setActiveContent('plantations');

    const addPlantation = async () => {
        const isFechaSiembraEmpty = !fechaSiembra;
        const isFechaCosechaEmpty = !fechaCosecha;
        const isCantidadEmpty = !cantidadSemilla;
        const isUnidadEmpty = !unidad;
        const isSemillaEmpty = !semilla;
        const isParcelaEmpty = !parcela;

        const siembraDate = new Date(fechaSiembra);
        const cosechaDate = new Date(fechaCosecha);

        setFechaSiembraError(isFechaSiembraEmpty);
        setFechaCosechaError(isFechaCosechaEmpty);
        setCantidadError(isCantidadEmpty);
        setUnidadError(isUnidadEmpty);
        setSemillaError(isSemillaEmpty);
        setParcelaError(isParcelaEmpty);

        // Validar si falta algún campo
        if (
            isFechaSiembraEmpty || isFechaCosechaEmpty || isCantidadEmpty ||
            isUnidadEmpty || isSemillaEmpty || isParcelaEmpty
        ) {
            setShowIncompleteModal(true);
            return;
        }

        // Validar que cantidad sea > 0
        if (parseFloat(cantidadSemilla) <= 0) {
            setShowInvalidQuantityModal(true);
            return;
        }

        // Validar que siembra sea anterior a cosecha
        if (siembraDate >= cosechaDate) {
            setShowInvalidDatesModal(true);
            return;
        }

        try {
            const token = await AsyncStorage.getItem('userToken');
            if (!token) throw new Error('Token no encontrado');

            await axios.post(
                `${API_URL}/cultivos/createCultivo`,
                {
                    fechaSiembra,
                    fechaCosecha,
                    cantidadSemilla: parseFloat(cantidadSemilla),
                    unidad,
                    semilla,
                    parcela,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            setShowAlertAdd(true);
        } catch (error) {
            console.error('Error al crear cultivo:', error);
            setShowErrorModal(true);
        }
    };


    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = await AsyncStorage.getItem('userToken');
                if (!token) return;

                const [semillasRes, parcelasRes] = await Promise.all([
                    axios.get(`${API_URL}/semillas/getAllSemillas`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                    axios.get(`${API_URL}/parcelas/getAllParcelas`, {
                        headers: { Authorization: `Bearer ${token}` },
                    }),
                ]);

                setSemillasDisponibles(semillasRes.data);
                setParcelasDisponibles(parcelasRes.data);
            } catch (error) {
                console.error('Error al cargar semillas o parcelas:', error);
            }
        };

        fetchData();
    }, []);

    const getDaysInMonth = (month: string, year: string): number => {
        const m = parseInt(month, 10);
        const y = parseInt(year, 10);
        return new Date(y, m, 0).getDate();
    };


    return (
        <ScrollView contentContainerStyle={styles.container}>
            <Text style={styles.title}>Agregar plantación</Text>

            <View style={styles.formContainer}>
                <View style={styles.inputGroup}>
                    <Text style={styles.label}>🌱 Fecha de siembra</Text>
                    <TouchableOpacity
                        style={[styles.input, fechaSiembraError && styles.inputError]}
                        onPress={() => {
                            setIsSiembraPicker(true);
                            setShowDateModal(true);
                        }}
                    >
                        <Text style={{ textAlign: 'center', color: fechaSiembra ? '#000' : '#999' }}>
                            {fechaSiembra || 'Seleccione fecha'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>🌾 Fecha de cosecha</Text>
                    <TouchableOpacity
                        style={[styles.input, fechaCosechaError && styles.inputError]}
                        onPress={() => {
                            setIsSiembraPicker(false);
                            setShowDateModal(true);
                        }}
                    >
                        <Text style={{ textAlign: 'center', color: fechaCosecha ? '#000' : '#999' }}>
                            {fechaCosecha || 'Seleccione fecha'}
                        </Text>
                    </TouchableOpacity>
                </View>


                <View style={styles.inputGroup}>
                    <Text style={styles.label}>🔢 Cantidad de semilla</Text>
                    <TextInput
                        style={[styles.input, cantidadError && styles.inputError]}
                        placeholder="Ej: 50"
                        placeholderTextColor="#999"
                        value={cantidadSemilla}
                        onChangeText={(text) => {
                            setCantidadSemilla(allowOnlyNumbers(text));
                            setCantidadError(false);
                        }}
                    />

                </View>

                <View>
                    <Text style={styles.label}>⚖️ Unidad</Text>
                    <View>
                        <Picker
                            selectedValue={unidad}
                            onValueChange={(value) => {
                                setUnidad(value);
                                setUnidadError(false);
                            }}
                            style={[styles.picker, unidadError && styles.inputError]}
                        >
                            <Picker.Item label="Seleccione unidad" value="" />
                            <Picker.Item label="Kilogramos (kg)" value="kg" />
                            <Picker.Item label="Toneladas (ton)" value="ton" />
                        </Picker>
                    </View>
                </View>


                <View>
                    <Text style={styles.label}>🌽 Seleccionar semilla</Text>
                    <View>
                        <Picker
                            selectedValue={semilla}
                            onValueChange={(itemValue) => {
                                setSemilla(itemValue);
                                setSemillaError(false);
                            }}
                            style={[styles.picker, semillaError && styles.inputError]}
                        >
                            <Picker.Item label="Seleccione una semilla" value="" />
                            {semillasDisponibles.map((item) => (
                                <Picker.Item key={item._id} label={item.nombreSemilla} value={item._id} />
                            ))}
                        </Picker>
                    </View>
                </View>

                <View>
                    <Text style={styles.label}>🧱 Seleccionar parcela</Text>
                    <View>
                        <Picker
                            selectedValue={parcela}
                            onValueChange={(itemValue) => {
                                setParcela(itemValue);
                                setParcelaError(false);
                            }}
                            style={[styles.picker, parcelaError && styles.inputError]}
                        >
                            <Picker.Item label="Seleccione una parcela" value="" />
                            {parcelasDisponibles.map((item) => (
                                <Picker.Item key={item._id} label={item.nombreParcela} value={item._id} />
                            ))}
                        </Picker>
                    </View>
                </View>



                <View style={styles.formButtonsContainer}>
                    <TouchableOpacity style={styles.button} onPress={() => setShowAlertCancel(true)}>
                        <Text style={styles.buttonText}>Cancelar</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.cancelButton} onPress={addPlantation}>
                        <Text style={styles.buttonText}>Agregar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            {/* MODALES */}
            <Modal animationType="fade" transparent={true} visible={showAlertAdd}>
                <View style={styles.modalView}>
                    <View style={styles.alertView}>
                        <Text style={styles.alertMessage}>Plantación creada exitosamente</Text>
                        <TouchableOpacity onPress={goToPlantationsScreen} style={styles.alertButton}>
                            <Text style={styles.alertButtonText}>Continuar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal animationType="fade" transparent={true} visible={showAlertCancel}>
                <View style={styles.modalView}>
                    <View style={styles.alertView}>
                        <Text style={styles.alertMessage}>¿Cancelar ingreso de plantación?</Text>
                        <View style={styles.alertButtonsContainer}>
                            <TouchableOpacity onPress={goToPlantationsScreen} style={styles.alertButton}><Text style={styles.alertButtonText}>Sí</Text></TouchableOpacity>
                            <TouchableOpacity onPress={() => setShowAlertCancel(false)} style={styles.alertButton}><Text style={styles.alertButtonText}>No</Text></TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>

            <Modal animationType="fade" transparent={true} visible={showIncompleteModal}>
                <View style={styles.modalView}>
                    <View style={styles.alertView}>
                        <Text style={styles.alertMessage}>Completa todos los campos antes de continuar.</Text>
                        <TouchableOpacity onPress={() => setShowIncompleteModal(false)} style={styles.alertButton}>
                            <Text style={styles.alertButtonText}>Aceptar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            <Modal animationType="fade" transparent={true} visible={showErrorModal}>
                <View style={styles.modalView}>
                    <View style={styles.alertView}>
                        <Text style={styles.alertMessage}>Error al crear la plantación. Intente nuevamente.</Text>
                        <TouchableOpacity onPress={() => setShowErrorModal(false)} style={styles.alertButton}>
                            <Text style={styles.alertButtonText}>Cerrar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/*Modal de fecha*/}
            <Modal transparent visible={showDateModal} animationType="fade">
                <View style={styles.modalView}>
                    <View style={styles.alertView}>
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
                                    setFechaSiembraError(false);
                                } else {
                                    setFechaCosecha(dateISO);
                                    setFechaCosechaError(false);
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

            {/* Modal: fechas inválidas */}
            <Modal animationType="fade" transparent={true} visible={showInvalidDatesModal}>
                <View style={styles.modalView}>
                    <View style={styles.alertView}>
                        <Text style={styles.alertMessage}>
                            La fecha de siembra debe ser anterior a la fecha de cosecha.
                        </Text>
                        <TouchableOpacity onPress={() => setShowInvalidDatesModal(false)} style={styles.alertButton}>
                            <Text style={styles.alertButtonText}>Aceptar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

            {/* Modal: cantidad inválida */}
            <Modal animationType="fade" transparent={true} visible={showInvalidQuantityModal}>
                <View style={styles.modalView}>
                    <View style={styles.alertView}>
                        <Text style={styles.alertMessage}>
                            La cantidad de semilla debe ser mayor a cero.
                        </Text>
                        <TouchableOpacity onPress={() => setShowInvalidQuantityModal(false)} style={styles.alertButton}>
                            <Text style={styles.alertButtonText}>Aceptar</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        paddingHorizontal: 20,
        backgroundColor: '#FFFCE3'
    },
    title: {
        fontWeight: 'bold',
        marginTop: 20,
        marginBottom: 20,
        textAlign: 'center',
        fontSize: 22,
        color: '#665996',
        textTransform: 'uppercase'
    },
    formContainer: {
        backgroundColor: '#fff',
        borderRadius: 15,
        marginBottom: 20,
        padding: 20,
        elevation: 5
    },
    inputGroup: {
        marginBottom: 15
    },
    input: {
        width: '100%',
        height: 40,
        padding: 10,
        backgroundColor: '#D9D9D9',
        borderRadius: 25,
        fontSize: 16,
        fontWeight: 'bold',
        textAlign: 'center',
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.75,
        shadowRadius: 3.84,
        elevation: 5
    },
    label: {
        marginBottom: 5,
        fontWeight: 'bold',
        fontSize: 18,
        color: 'rgb(42, 125, 98)'
    },
    formButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20
    },
    button: {
        width: '48%',
        height: 40,
        backgroundColor: '#A01BAC',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25
    },
    cancelButton: {
        width: '48%',
        height: 40,
        backgroundColor: '#A01BAC',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold'
    },
    modalView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)'
    },
    alertView: {
        backgroundColor: '#FFFCE3',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
        maxWidth: '80%'
    },
    alertMessage: {
        fontSize: 16,
        marginBottom: 20,
        textAlign: 'center'
    },
    alertButtonsContainer: {
        flexDirection: 'row'
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
        fontWeight: 'bold'
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
    inputError: {
        borderColor: 'red',
        borderWidth: 2,
    },
    pickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        maxWidth: '100%',
        marginVertical: 10,
        gap: 12,
    },
    pickerBox: {
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
    pickerDate: {
        height: 40,
        borderRadius: 10,
        width: '100%',
        color: '#333',
        fontSize: 14,
    },
    pickerGroup: {
        alignItems: 'center',
        marginHorizontal: 4,
        flex: 1,
    },
    pickerLabel: {
        fontSize: 13,
        fontWeight: '600',
        marginBottom: 4,
        color: '#555',
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
    alertTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },




});

export default AddPlantationScreen;
