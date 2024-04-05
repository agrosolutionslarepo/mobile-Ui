import React, { useState } from 'react';
import { View, Image, StyleSheet, TouchableOpacity, Modal, Text, Animated, TouchableWithoutFeedback, ScrollView } from 'react-native';


interface HeaderProps {
  onMenuClick: (menuItem: string) => void;
}

const Header: React.FC<HeaderProps> = ({ onMenuClick }) => {
  const [leftMenuVisible, setLeftMenuVisible] = useState(false);
  const [rightMenuVisible, setRightMenuVisible] = useState(false);

  const leftMenuPosition = useState(new Animated.Value(-1000))[0];
  const rightMenuPosition = useState(new Animated.Value(1000))[0];

  const toggleLeftMenu = () => {
    setLeftMenuVisible(!leftMenuVisible);
    Animated.timing(
      leftMenuPosition,
      {
        toValue: leftMenuVisible ? -1000 : 0,
        duration: 300,
        useNativeDriver: true
      }
    ).start();
  };

  const toggleRightMenu = () => {
    setRightMenuVisible(!rightMenuVisible);
    Animated.timing(
      rightMenuPosition,
      {
        toValue: rightMenuVisible ? 1000 : 0,
        duration: 300,
        useNativeDriver: true
      }
    ).start();
  };

  const closeModal = () => {
    setLeftMenuVisible(false);
    setRightMenuVisible(false);
  };

  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={toggleLeftMenu} style={styles.menuContainer}>
        <Image
          source={require('../assets/img/menu_izquierdo.png')}
          style={styles.menuIcon}
        />
      </TouchableOpacity>
      <Image
        source={require('../assets/img/logo.png')}
        style={styles.logo}
        resizeMode="contain"
      />
      <TouchableOpacity onPress={toggleRightMenu} style={styles.menuContainer}>
        <Image
          source={require('../assets/img/menu_derecho.png')}
          style={styles.menuIcon}
        />
      </TouchableOpacity>

      <Modal
        visible={leftMenuVisible}
        transparent={true}
      >
        <TouchableOpacity onPress={closeModal} style={styles.modalContainer}>
          <Animated.View style={[styles.modalContentLeft, { transform: [{ translateX: leftMenuPosition }] }]}>

            <View style={styles.userContainer}>
              <Image
                source={require('../assets/img/user.png')}
                style={styles.userImage}
                resizeMode="contain"
              />
              <Text style={styles.userName}>Juan Perez</Text>
            </View>


            <View style={styles.menuButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  closeModal();
                  onMenuClick('home');
                }}
                style={styles.menuButton}
              >
                <Text style={styles.menuButtonText}>Home</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  closeModal();
                  onMenuClick('plots');
                }}
                style={styles.menuButton}
              >
                <Text style={styles.menuButtonText}>Parcelas</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  closeModal();
                  onMenuClick('calendar');
                }}
                style={styles.menuButton}
              >
                <Text style={styles.menuButtonText}>Calendario</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  closeModal();
                  onMenuClick('seeds');
                }}
                style={styles.menuButton}
              >
                <Text style={styles.menuButtonText}>Semillas</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuButtonContainer}>
              <TouchableOpacity
                onPress={() => {
                  closeModal();
                  onMenuClick('crops');
                }}
                style={styles.menuButton}
              >
                <Text style={styles.menuButtonText}>Cosechas</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.menuButtonLogOutContainer}>
              <TouchableOpacity
                onPress={() => {
                  closeModal();
                  onMenuClick('login');
                }}
                style={styles.menuButtonLogOut}
              >
                <Text style={styles.menuButtonLogOutText}>Log out</Text>
              </TouchableOpacity>
            </View>

          </Animated.View>
        </TouchableOpacity>
      </Modal>

      <TouchableWithoutFeedback onPress={closeModal}>
        <Modal
          visible={rightMenuVisible}
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <Animated.View style={[styles.modalContentRight, { transform: [{ translateX: rightMenuPosition }] }]}>
              <View style={styles.notificationContainerTitle}>
                <Text style={styles.notificationTitle}>Notificaciones</Text>
              </View>

              <ScrollView>
                {[...Array(10).keys()].map(index => (
                  <View key={index} style={styles.notificationContainer}>
                    <TouchableOpacity
                      onPress={() => console.log("Opción seleccionada")}
                      style={styles.notificationButton}
                    >
                      <Image
                        source={require('../assets/img/notificacion.png')}
                        style={styles.notificationLogo}
                        resizeMode="contain"
                      />
                      <Text style={styles.notificationText}>Alerta climatica</Text>
                    </TouchableOpacity>
                  </View>
                ))}
              </ScrollView>
            </Animated.View>
          </View>
        </Modal>
      </TouchableWithoutFeedback>
    </View>
  );
};

const styles = StyleSheet.create({

  userContainer:{
    backgroundColor: '#D9D9D9',
    alignItems:'center',

    paddingTop: 25,
    paddingBottom: 25
  },

  userImage:{
    width: 41,
    height: 42
  },

  userName:{
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10
  },

  menuButtonContainer: {

  },

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
    elevation: 5,
  },

  menuButtonText: {
    fontSize: 20,
    fontWeight: 'bold'
  },

  menuButtonLogOutContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom: 20,
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
    elevation: 5,
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
    margin: 0,
    marginBottom: 20
  },

  notificationTitle: {
    fontWeight: 'bold',
    fontSize: 20,
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
    elevation: 5,
  },

  notificationButton: {
    backgroundColor: 'none',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginVertical: 10,
    flexDirection: 'row',
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
    borderBottomColor: '#CFCAE3',
  },

  menuContainer: {
    width: 50,
    height: 53,
    justifyContent: 'center',
    alignItems: 'center',
  },

  menuIcon: {
    width: 50,
    height: 49,
  },

  logo: {
    width: 143,
    height: 65,
  },

  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
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
    paddingVertical: 10,
  },

  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#eeeeee',
    borderRadius: 5,
    alignSelf: 'flex-end',
  },

  closeButtonText: {
    fontWeight: 'bold',
  },
});

export default Header;
