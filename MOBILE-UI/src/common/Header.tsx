// Header.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Text,
  Animated,
  TouchableWithoutFeedback,
  ScrollView
} from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../config';

interface HeaderProps {
  onMenuClick: (menuItem: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [leftMenuVisible, setLeftMenuVisible] = useState(false);
  const [rightMenuVisible, setRightMenuVisible] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [userData, setUserData] = useState<any>(null);

  const leftMenuPosition = useState(new Animated.Value(-1000))[0];
  const rightMenuPosition = useState(new Animated.Value(1000))[0];

  const toggleLeftMenu = () => {
    setLeftMenuVisible(!leftMenuVisible);
    Animated.timing(leftMenuPosition, {
      toValue: leftMenuVisible ? -1000 : 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  const toggleRightMenu = () => {
    setRightMenuVisible(!rightMenuVisible);
    Animated.timing(rightMenuPosition, {
      toValue: rightMenuVisible ? 1000 : 0,
      duration: 300,
      useNativeDriver: true
    }).start();
  };

  const closeModal = () => {
    setLeftMenuVisible(false);
    setRightMenuVisible(false);
  };

  useEffect(() => {
    const fetchUserFromApi = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;

        const response = await axios.get(
          `${API_URL}/usuarios/getUsuarioAutenticado`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }
        );

        if (response.status === 200) {
          setUserData(response.data);
        } else {
          console.error('No se pudo obtener el usuario');
        }
      } catch (error: any) {
        console.error('Error al consultar el usuario:', error?.response?.data || error.message);
      }
    };

    fetchUserFromApi();
  }, []);

  const menuItems = [
    { label: 'Home', key: 'home' },
    { label: 'Parcelas', key: 'plots' },
    { label: 'Semillas', key: 'seeds' },
    { label: 'Cosechas', key: 'crops' },
    { label: 'Perfil', key: 'profile' }
  ];

  const empresaLimitada = userData?.empresa === '6840da01ba52fec6d68de6bc'; // empresa ficticia
  const visibleItems = empresaLimitada
    ? menuItems.filter(item => item.key === 'home' || item.key === 'profile')
    : menuItems;

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={toggleLeftMenu} style={styles.menuContainer}>
        <Image source={require('../assets/img/menu_izquierdo.png')} style={styles.menuIcon} />
      </TouchableOpacity>

      <Image source={require('../assets/img/logo.png')} style={styles.logo} resizeMode="contain" />

      <TouchableOpacity onPress={toggleRightMenu} style={styles.menuContainer}>
        <Image source={require('../assets/img/menu_derecho.png')} style={styles.menuIcon} />
      </TouchableOpacity>

      <Modal visible={leftMenuVisible} transparent={true}>
        <TouchableOpacity onPress={closeModal} style={styles.modalContainer}>
          <Animated.View style={[styles.modalContentLeft, { transform: [{ translateX: leftMenuPosition }] }]}>
            <View style={styles.userContainer}>
              <Image source={require('../assets/img/user.png')} style={styles.userImage} resizeMode="contain" />
              <Text style={styles.userName}>{userData?.nombreUsuario || 'Usuario'}</Text>
            </View>

            {visibleItems.map((item) => (
              <View key={item.key} style={styles.menuButtonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    closeModal();
                    onMenuClick(item.key);
                  }}
                  style={styles.menuButton}
                >
                  <Text style={styles.menuButtonText}>{item.label}</Text>
                </TouchableOpacity>
              </View>
            ))}

            {userData?.administrador && !empresaLimitada && (
              <View style={styles.menuButtonContainer}>
                <TouchableOpacity
                  onPress={() => {
                    closeModal();
                    onMenuClick('company');
                  }}
                  style={styles.menuButton}
                >
                  <Text style={styles.menuButtonText}>Empresa</Text>
                </TouchableOpacity>
              </View>
            )}

            <View style={styles.menuButtonLogOutContainer}>
              <TouchableOpacity
                onPress={() => setShowLogoutConfirm(true)}
                style={styles.menuButtonLogOut}
              >
                <Text style={styles.menuButtonLogOutText}>Log out</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </TouchableOpacity>
      </Modal>

      <TouchableWithoutFeedback onPress={closeModal}>
        <Modal visible={rightMenuVisible} transparent={true}>
          <View style={styles.modalContainer}>
            <Animated.View style={[styles.modalContentRight, { transform: [{ translateX: rightMenuPosition }] }]}>
              <View style={styles.notificationContainerTitle}>
                <Text style={styles.notificationTitle}>Notificaciones</Text>
              </View>
              <ScrollView>
                {[...Array(10).keys()].map((index) => (
                  <View key={index} style={styles.notificationContainer}>
                    <TouchableOpacity onPress={() => console.log('Opción seleccionada')} style={styles.notificationButton}>
                      <Image source={require('../assets/img/notificacion.png')} style={styles.notificationLogo} resizeMode="contain" />
                      <Text style={styles.notificationText}>Alerta climática</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </Animated.View>
          </View>
        </Modal>
      </TouchableWithoutFeedback>

      <Modal
        transparent
        visible={showLogoutConfirm}
        animationType="fade"
        onRequestClose={() => setShowLogoutConfirm(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.alertView}>
            <Text style={styles.alertTitle}>¿Cerrar sesión, {userData?.nombreUsuario || 'Usuario'}?</Text>
            <Text style={styles.alertMessage}>Vas a salir de tu cuenta actual.</Text>
            <View style={{ flexDirection: 'row', gap: 20, marginTop: 20 }}>
              <TouchableOpacity
                onPress={() => setShowLogoutConfirm(false)}
                style={[styles.alertButton, { backgroundColor: '#aaa' }]}
              >
                <Text style={styles.alertButtonText}>Cancelar</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={async () => {
                  try {
                    await AsyncStorage.removeItem('userToken');
                    await AsyncStorage.removeItem('userData');
                    await AsyncStorage.removeItem('decodedToken');
                    console.log('🗑️ Sesión cerrada');
                    setShowLogoutConfirm(false);
                    closeModal();
                    onMenuClick('login');
                  } catch (error) {
                    console.error('Error al cerrar sesión:', error);
                  }
                }}
                style={styles.alertButton}
              >
                <Text style={styles.alertButtonText}>Cerrar sesión</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  userContainer: {
    backgroundColor: '#D9D9D9',
    alignItems: 'center',
    paddingTop: 25,
    paddingBottom: 25
  },
  userImage: {
    width: 41,
    height: 42
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10
  },
  menuButtonContainer: {},
  menuButton: {
    marginTop: 15,
    marginBottom: 15,
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 30,
    marginRight: 30,
    alignItems: 'center',
    borderColor: '#96947B',
    borderWidth: 1,
    borderRadius: 25,
    shadowColor: '#96947B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5
  },
  menuButtonText: {
    fontSize: 20,
    fontWeight: 'bold'
  },
  menuButtonLogOutContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20
  },
  menuButtonLogOut: {
    backgroundColor: '#A01BAC',
    marginTop: 15,
    marginBottom: 15,
    paddingTop: 5,
    paddingBottom: 5,
    marginLeft: 30,
    marginRight: 30,
    alignItems: 'center',
    borderColor: '#A01BAC',
    borderWidth: 1,
    borderRadius: 25,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5
  },
  menuButtonLogOutText: {
    color: '#F5F5F5',
    fontSize: 20,
    fontWeight: 'bold'
  },
  notificationContainerTitle: {
    backgroundColor: '#D9D9D9',
    padding: 20,
    alignItems: 'center',
    marginBottom: 20
  },
  notificationTitle: {
    fontWeight: 'bold',
    fontSize: 20
  },
  notificationContainer: {
    borderColor: '#96947B',
    borderWidth: 1,
    marginTop: 20,
    borderRadius: 10,
    marginLeft: 20,
    marginRight: 20,
    shadowColor: '#96947B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5
  },
  notificationButton: {
    backgroundColor: 'none',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    flexDirection: 'row'
  },
  notificationText: {
    color: 'black',
    fontSize: 20,
    marginLeft: 40,
    fontWeight: 'bold'
  },
  notificationLogo: {
    width: 32,
    height: 50,
    marginLeft: 20
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#CFCAE3',
    borderBottomWidth: 1,
    borderBottomColor: '#CFCAE3'
  },
  menuContainer: {
    width: 50,
    height: 53,
    justifyContent: 'center',
    alignItems: 'center'
  },
  menuIcon: {
    width: 50,
    height: 49
  },
  logo: {
    width: 143,
    height: 65
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
  modalContentLeft: {
    backgroundColor: '#FFFCE3',
    width: '80%',
    height: '100%'
  },
  modalContentRight: {
    backgroundColor: '#FFFCE3',
    width: '80%',
    marginLeft: '20%',
    height: '100%',
    paddingBottom: 20
  },
  menuItem: {
    paddingVertical: 10
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#eeeeee',
    borderRadius: 5,
    alignSelf: 'flex-end'
  },
  closeButtonText: {
    fontWeight: 'bold'
  },
  alertView: {
    backgroundColor: '#FFFCE3',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 40,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5
  },
  alertTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
    color: '#000'
  },
  alertMessage: {
    fontSize: 16,
    textAlign: 'center',
    color: '#333'
  },
  alertButton: {
    backgroundColor: '#A01BAC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20
  },
  alertButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center'
  }
});

export default Header;

