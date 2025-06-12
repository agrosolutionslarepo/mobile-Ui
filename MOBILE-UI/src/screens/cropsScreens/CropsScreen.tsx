import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal, Alert, ScrollView } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API_URL } from '../../config';

interface Cosecha {
  _id: string;
  fechaCosecha: string;
  cantidadCosechada: number;
  unidad: string;
  cultivo: {
    semilla?: { nombreSemilla: string };
    parcela?: { nombreParcela: string };
  };
}

const CropsScreen = ({ setActiveContent }: { setActiveContent: (content: string, data?: any) => void }) => {
  const [cosechas, setCosechas] = useState<Cosecha[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedToDelete, setSelectedToDelete] = useState<string | null>(null);
  const [showAlertDelete, setShowAlertDelete] = useState(false);

  const fetchCosechas = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return;

      const response = await axios.get(`${API_URL}/cosechas/getAllCosechas`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setCosechas(response.data);
    } catch (error) {
      console.error('Error al obtener cosechas:', error);
    } finally {
      setLoading(false);
    }
  };

  const deleteCosecha = async () => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token || !selectedToDelete) return;

      await axios.delete(`${API_URL}/cosechas/deleteCosecha/${selectedToDelete}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setShowAlertDelete(false);
      setSelectedToDelete(null);
      fetchCosechas();
    } catch (error) {
      console.error('Error al eliminar cosecha:', error);
      Alert.alert('Error', 'No se pudo eliminar la cosecha.');
    }
  };

  useEffect(() => {
    fetchCosechas();
  }, []);

  const goToAddCropScreen = () => {
    setActiveContent('addCrop');
  };

  const goToViewCropScreen = (cosecha: Cosecha) => {
    setActiveContent('viewCrop', cosecha);
  };

  const goToEditCropScreen = (cosecha: Cosecha) => {
    setActiveContent('editCrop', cosecha);
  };

  const getCropImage = () => require('../../assets/img/crop.png');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cosechas</Text>

      <TouchableOpacity style={styles.addButton} onPress={goToAddCropScreen}>
        <Image source={require('../../assets/img/add.png')} style={styles.addImage} resizeMode="contain" />
      </TouchableOpacity>

      <ScrollView style={styles.listContainer}>
        {loading ? (
          <Text style={{ textAlign: 'center' }}>Cargando cosechas...</Text>
        ) : (
          cosechas.map((cosecha) => (
            <TouchableOpacity
              key={cosecha._id}
              style={styles.itemContainer}
              onPress={() => goToViewCropScreen(cosecha)}
            >
              <Image source={getCropImage()} style={styles.itemImage} resizeMode="contain" />

              <View style={styles.textContainer}>
                <Text style={styles.itemTitle}>{cosecha.cultivo?.semilla?.nombreSemilla || 'Cosecha'}</Text>
                <Text style={styles.itemText}>Parcela: {cosecha.cultivo?.parcela?.nombreParcela || 'N/D'}</Text>
                <Text style={styles.itemText}>{new Date(cosecha.fechaCosecha).toLocaleDateString()}</Text>
                <Text style={styles.itemText}>{`${cosecha.cantidadCosechada} ${cosecha.unidad}`}</Text>
              </View>

              <TouchableOpacity onPress={() => goToEditCropScreen(cosecha)}>
                <Image source={require('../../assets/img/edit.png')} style={styles.editImage} resizeMode="contain" />
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => {
                  setSelectedToDelete(cosecha._id);
                  setShowAlertDelete(true);
                }}
              >
                <Image source={require('../../assets/img/delete.png')} style={styles.deleteImage} resizeMode="contain" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>

      <Modal animationType="fade" transparent={true} visible={showAlertDelete}>
        <View style={styles.modalView}>
          <View style={styles.alertView}>
            <Text style={styles.alertMessage}>¿Está seguro que quiere eliminar esta cosecha?</Text>
            <View style={styles.alertButtonsContainer}>
              <TouchableOpacity onPress={deleteCosecha} style={styles.alertButton}>
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
  container: {
    flex: 1,
    backgroundColor: '#FFFCE3',
    alignItems: 'center',
  },
  title: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
    fontSize: 22,
    color: '#665996',
    textTransform: 'uppercase',
  },
  addButton: {
    marginBottom: 20,
    backgroundColor: '#D9D9D9',
    width: '90%',
    height: 50,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addImage: {
    width: 32,
    height: 36,
  },
  listContainer: {
    width: '100%',
  },
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: '5%',
    marginBottom: 20,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderColor: '#96947B',
    borderWidth: 1,
    elevation: 5,
    shadowColor: '#96947B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
  },
  itemImage: {
    width: 64,
    height: 64,
    marginRight: 10,
  },
  textContainer: {
    width: '50%',
  },
  itemTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'rgb(42, 125, 98)',
  },
  itemText: {
    fontSize: 14,
  },
  editImage: {
    width: 32,
    height: 32,
    marginLeft: 10,
  },
  deleteImage: {
    width: 32,
    height: 32,
    marginLeft: 10,
  },
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
    maxWidth: '80%',
  },
  alertMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  alertButtonsContainer: {
    flexDirection: 'row',
  },
  alertButton: {
    backgroundColor: '#A01BAC',
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  alertButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CropsScreen;