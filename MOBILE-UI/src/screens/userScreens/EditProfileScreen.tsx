import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Modal,
} from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';

const getDaysInMonth = (month: string, year: string): number => {
  const m = parseInt(month, 10);
  const y = parseInt(year, 10);
  return new Date(y, m, 0).getDate();
};

const EditProfileScreen = ({ setActiveContent }: { setActiveContent: (screen: string) => void }) => {
  const [userData, setUserData] = useState<any>(null);
  const [nombre, setNombre] = useState('');
  const [apellido, setApellido] = useState('');
  const [nombreUsuario, setNombreUsuario] = useState('');
  const [email, setEmail] = useState('');
  const [birthdate, setBirthdate] = useState('');
  const [selectedDay, setSelectedDay] = useState('01');
  const [selectedMonth, setSelectedMonth] = useState('01');
  const [selectedYear, setSelectedYear] = useState('2000');
  const [showDateModal, setShowDateModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [password, setPassword] = useState('');

  useEffect(() => {
    const getUserFromToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (token) {
          const base64Url = token.split('.')[1];
          const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
          const jsonPayload = decodeURIComponent(
            atob(base64)
              .split('')
              .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
              .join('')
          );
          const decoded = JSON.parse(jsonPayload);
          setUserData(decoded);
          setNombre(decoded.nombre);
          setApellido(decoded.apellido);
          setNombreUsuario(decoded.nombreUsuario);
          setEmail(decoded.email);
          if (decoded.fechaNacimiento) {
            setBirthdate(decoded.fechaNacimiento);
            const [y, m, d] = decoded.fechaNacimiento.split('-');
            setSelectedYear(y);
            setSelectedMonth(m);
            setSelectedDay(d);
          }
        }
      } catch (error) {
        console.error('Error al cargar datos del usuario:', error);
      }
    };

    getUserFromToken();
  }, []);

  const handleSave = () => {
    setShowPasswordModal(true);
  };

  const handleConfirmPassword = () => {
    setShowPasswordModal(false);
    setActiveContent('view-profile');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Editar Perfil</Text>

      <View style={styles.infoContainer}>
        <View style={styles.inputGroup}>
          <MaterialIcons name="person" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={nombre}
            onChangeText={setNombre}
            placeholder="Nombre"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputGroup}>
          <MaterialIcons name="person-outline" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={apellido}
            onChangeText={setApellido}
            placeholder="Apellido"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputGroup}>
          <MaterialIcons name="account-circle" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={nombreUsuario}
            onChangeText={setNombreUsuario}
            placeholder="Usuario"
            placeholderTextColor="#888"
          />
        </View>

        <View style={styles.inputGroup}>
          <MaterialIcons name="email" size={20} color="#666" style={styles.icon} />
          <TextInput
            style={styles.input}
            value={email}
            onChangeText={setEmail}
            placeholder="Email"
            placeholderTextColor="#888"
          />
        </View>

        <TouchableOpacity
          style={[styles.inputGroup, { justifyContent: 'flex-start' }]}
          onPress={() => setShowDateModal(true)}
        >
          <MaterialIcons name="calendar-today" size={20} color="#666" style={styles.icon} />
          <Text style={{ color: birthdate ? '#000' : '#888' }}>
            {birthdate || 'Seleccionar fecha'}
          </Text>
        </TouchableOpacity>

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

      <Modal
        transparent
        visible={showDateModal}
        animationType="fade"
        onRequestClose={() => setShowDateModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Seleccioná tu fecha de nacimiento</Text>
            <View style={styles.pickerContainer}>
              <View style={styles.pickerGroup}>
                <Text style={styles.pickerLabel}>Día</Text>
                <View style={styles.pickerBox}>
                  <Picker
                    selectedValue={selectedDay}
                    style={styles.picker}
                    onValueChange={(itemValue) => setSelectedDay(itemValue)}
                  >
                    {Array.from({ length: getDaysInMonth(selectedMonth, selectedYear) }, (_, i) => {
                      const day = (i + 1).toString().padStart(2, '0');
                      return <Picker.Item key={day} label={day} value={day} />;
                    })}
                  </Picker>
                </View>
              </View>
              <View style={styles.pickerGroup}>
                <Text style={styles.pickerLabel}>Mes</Text>
                <View style={styles.pickerBox}>
                  <Picker
                    selectedValue={selectedMonth}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                      setSelectedMonth(itemValue);
                      const maxDay = getDaysInMonth(itemValue, selectedYear);
                      if (parseInt(selectedDay, 10) > maxDay) {
                        setSelectedDay(maxDay.toString().padStart(2, '0'));
                      }
                    }}
                  >
                    {Array.from({ length: 12 }, (_, i) => {
                      const month = (i + 1).toString().padStart(2, '0');
                      return <Picker.Item key={month} label={month} value={month} />;
                    })}
                  </Picker>
                </View>
              </View>
              <View style={styles.pickerGroup}>
                <Text style={styles.pickerLabel}>Año</Text>
                <View style={styles.pickerBox}>
                  <Picker
                    selectedValue={selectedYear}
                    style={styles.picker}
                    onValueChange={(itemValue) => {
                      setSelectedYear(itemValue);
                      const maxDay = getDaysInMonth(selectedMonth, itemValue);
                      if (parseInt(selectedDay, 10) > maxDay) {
                        setSelectedDay(maxDay.toString().padStart(2, '0'));
                      }
                    }}
                  >
                    {Array.from({ length: 100 }, (_, i) => {
                      const year = (new Date().getFullYear() - i).toString();
                      return <Picker.Item key={year} label={year} value={year} />;
                    })}
                  </Picker>
                </View>
              </View>
            </View>
            <TouchableOpacity
              onPress={() => {
                const formattedDate = `${selectedYear}-${selectedMonth}-${selectedDay}`;
                setBirthdate(formattedDate);
                setShowDateModal(false);
              }}
              style={styles.modalButton}
            >
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowDateModal(false)}
              style={[styles.modalButton, { backgroundColor: '#aaa', marginTop: 10 }]}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal
        transparent
        visible={showPasswordModal}
        animationType="fade"
        onRequestClose={() => setShowPasswordModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalTitle}>Confirmá tu contraseña</Text>
            <TextInput
              placeholder="Contraseña"
              placeholderTextColor="#888"
              secureTextEntry
              style={styles.passwordInput}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={handleConfirmPassword} style={styles.modalButton}>
              <Text style={styles.modalButtonText}>Confirmar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => setShowPasswordModal(false)}
              style={[styles.modalButton, { backgroundColor: '#aaa', marginTop: 10 }]}
            >
              <Text style={styles.modalButtonText}>Cancelar</Text>
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
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
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
  label: {
    marginLeft: 5,
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 6,
    color: '#555',
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
  modalButton: {
    backgroundColor: '#A01BAC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    marginTop: 10,
  },
  modalButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  passwordInput: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 10,
    marginTop: 10,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#ccc',
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
  picker: {
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
});

export default EditProfileScreen;


