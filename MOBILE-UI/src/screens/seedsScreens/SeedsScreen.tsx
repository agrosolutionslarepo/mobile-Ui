import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Semilla {
  _id: string;
  nombreSemilla: string;
  tipoSemilla: string;
  cantidadSemilla: number;
  unidad: string;
}

const SeedsScreen = ({ setActiveContent }: { setActiveContent: (content: string, data?: any) => void }) => {
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [semillas, setSemillas] = useState<Semilla[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSemillas = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token) return;

        const response = await axios.get('http://localhost:3000/semillas/getAllSemillas', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSemillas(response.data);
      } catch (error) {
        console.error('Error al obtener semillas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSemillas();
  }, []);

  /*const deleteSeed = () => {
    setShowAlertDelete(true);
  };*/

  const goToAddSeedScreen = () => {
    setActiveContent('addSeed');
  };

  const goToViewSeedScreen = (semilla: Semilla) => {
    setActiveContent('viewSeed', semilla);
  };

  const goToEditSeedScreen = (semilla: Semilla) => {
    setActiveContent('editSeed', semilla);
  };

  return (
    <View style={styles.seedsContainer}>
      <Text style={styles.seedsTitle}>Inventario{'\n'}semillas</Text>

      <TouchableOpacity style={styles.addSeedButton} onPress={goToAddSeedScreen}>
        <Image
          source={require('../../assets/img/add.png')}
          style={styles.addSeedImage}
          resizeMode="contain"
        />
      </TouchableOpacity>

      <View style={styles.seedsListContainer}>
        {loading ? (
          <Text>Cargando semillas...</Text>
        ) : (
          semillas.map((semilla) => (
            <TouchableOpacity key={semilla._id} style={styles.seedItemContainer} onPress={() => setActiveContent('viewSeed', semilla)}>
              <Image
                source={require('../../assets/img/seed.png')}
                style={styles.seedItemImage}
                resizeMode="contain"
              />

              <View style={styles.seedTextContainer}>
                <Text style={styles.seedName}>
                  {typeof semilla.nombreSemilla === 'string'
                    ? semilla.nombreSemilla.charAt(0).toUpperCase() + semilla.nombreSemilla.slice(1)
                    : 'Nombre de Semilla'}
                </Text>
                <Text style={styles.seedText}>
                  {`${semilla.cantidadSemilla} ${semilla.unidad}`}
                </Text>
              </View>

              <TouchableOpacity onPress={() => goToEditSeedScreen(semilla)}>
                <Image
                  source={require('../../assets/img/edit.png')}
                  style={styles.editImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              
              {/*
              <TouchableOpacity onPress={deleteSeed}>
                <Image
                  source={require('../../assets/img/delete.png')}
                  style={styles.deleteImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>*/}
            </TouchableOpacity>
          ))
        )}
      </View>

      {/*<Modal animationType="fade" transparent visible={showAlertDelete}>
        <View style={styles.modalView}>
          <View style={styles.alertView}>
            <Text style={styles.alertMessage}>
              ¿Esta seguro que quiere{'\n'}eliminar esta semilla?
            </Text>

            <View style={styles.alertButtonsContainer}>
              <TouchableOpacity
                onPress={() => setShowAlertDelete(false)}
                style={styles.alertButton}
              >
                <Text style={styles.alertButtonText}>Si</Text>
              </TouchableOpacity>

               
              <TouchableOpacity
                onPress={() => setShowAlertDelete(false)}
                style={styles.alertButton}
              >
                <Text style={styles.alertButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>*/}
    </View>
  );
};

const styles = StyleSheet.create({

  seedsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFCE3'
  },

  seedsTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center'
  },

  addSeedButton: {
    marginTop: 10,
    marginBottom: 20,

    backgroundColor: '#D9D9D9',
    width: '90%',
    height: 50,

    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',

    borderRadius: 25

  },

  addSeedImage: {
    width: 32,
    height: 36
  },

  seedsListContainer: {
    width: '100%',
  },

  seedItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    width: '90%',

    marginLeft: '5%',
    marginRight: '5%',

    marginBottom: 20,

    paddingTop: 20,
    paddingBottom: 20,

    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#96947B',

    shadowColor: '#96947B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5
  },

  seedItemImage: {
    width: 64,
    height: 64,
    marginRight: 10
  },

  seedTextContainer: {
    width: '50%'
  },

  seedName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000'
  },

  seedText: {

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
    marginLeft: 10,
    paddingLeft: 20,
    paddingRight: 20
  },

  alertButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
})

export default SeedsScreen;