import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Parcela {
  _id: string;
  nombreParcela: string;
  tamaño: number;
  ubicacion?: string;
  estado?: boolean;
  gdd?: number;
  latitud?: number;
  longitud?: number;
}

const PlotsScreen = ({ setActiveContent }: { setActiveContent: (content: string, data?: any) => void }) => {
  const [showAlertDelete, setShowAlertDelete] = useState(false);
  const [parcelas, setParcelas] = useState<Parcela[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParcelaId, setSelectedParcelaId] = useState<string | null>(null);

  const fetchParcelas = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await axios.get('http://localhost:3000/parcelas/getAllParcelas', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setParcelas(response.data);
    } catch (error) {
      console.error('Error al obtener parcelas:', error);
    } finally {
      setLoading(false);
    }
  };

  const confirmDeleteParcela = async () => {
    if (!selectedParcelaId) return;

    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) throw new Error('Token no encontrado');

      await axios.delete(`http://localhost:3000/parcelas/deleteParcela/${selectedParcelaId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowAlertDelete(false);
      setSelectedParcelaId(null);
      fetchParcelas();
    } catch (error) {
      console.error('Error al eliminar parcela:', error);
      Alert.alert('Error', 'No se pudo eliminar la parcela. Intente nuevamente.');
    }
  };

  const askDeleteParcela = (id: string) => {
    setSelectedParcelaId(id);
    setShowAlertDelete(true);
  };

  const goToAddPlotScreen = () => {
    setActiveContent('addPlot');
  };

  useEffect(() => {
    fetchParcelas();
  }, []);

  return (
    <View style={styles.plotsContainer}>
      <Text style={styles.plotsTitle}>Parcelas</Text>
      <TouchableOpacity style={styles.addplotButton} onPress={goToAddPlotScreen}>
        <Image source={require('../../assets/img/add.png')} style={styles.addplotImage} resizeMode="contain" />
      </TouchableOpacity>

      <View style={styles.plotsListContainer}>
        {loading ? (
          <Text style={{ textAlign: 'center' }}>Cargando parcelas...</Text>
        ) : (
          parcelas.map((parcela) => (
            <TouchableOpacity
              key={parcela._id}
              style={styles.plotItemContainer}
              onPress={() => setActiveContent('viewPlot', parcela)}
            >
              <Image source={require('../../assets/img/plot.png')} style={styles.plotItemImage} resizeMode="contain" />

              <View style={styles.plotTextContainer}>
                <Text style={styles.plotName}>{parcela.nombreParcela}</Text>
                <Text style={styles.plotText}>{parcela.tamaño}</Text>
              </View>

              <TouchableOpacity onPress={() => setActiveContent('editPlot', parcela)}>
                <Image source={require('../../assets/img/edit.png')} style={styles.editImage} resizeMode="contain" />
              </TouchableOpacity>

              <TouchableOpacity onPress={() => askDeleteParcela(parcela._id)}>
                <Image source={require('../../assets/img/delete.png')} style={styles.deleteImage} resizeMode="contain" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </View>

      <Modal animationType="fade" transparent={true} visible={showAlertDelete}>
        <View style={styles.modalView}>
          <View style={styles.alertView}>
            <Text style={styles.alertMessage}>¿Está seguro que quiere eliminar esta parcela?</Text>

            <View style={styles.alertButtonsContainer}>
              <TouchableOpacity onPress={confirmDeleteParcela} style={styles.alertButton}>
                <Text style={styles.alertButtonText}>Sí</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setShowAlertDelete(false)} style={styles.alertButton}>
                <Text style={styles.alertButtonText}>No</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({

  plotsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFCE3'
  },

  plotsTitle: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    textAlign: 'center',
    fontSize: 22,
    color: '#665996',
    textTransform: 'uppercase'
  },

  addplotButton: {
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

  addplotImage: {
    width: 32,
    height: 36
  },

  plotsListContainer: {
    width: '100%',
  },

  plotItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',

    width: '90%',

    marginLeft: '5%',
    marginRight: '5%',

    marginBottom: 20,

    paddingTop: 20,
    paddingBottom: 20,

    backgroundColor: '#fff',

    borderWidth: 1,
    borderRadius: 10,
    borderColor: '#96947B',

    shadowColor: '#96947B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5
  },

  plotItemImage: {
    width: 64,
    height: 64,
    marginRight: 10
  },

  plotTextContainer: {
    width: '50%'
  },

  plotName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(42, 125, 98)'
  },

  plotText: {

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
    maxWidth: '80%'
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
    marginHorizontal: 10,
    paddingHorizontal: 20,
    paddingVertical: 10
  },

  alertButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
})

export default PlotsScreen;