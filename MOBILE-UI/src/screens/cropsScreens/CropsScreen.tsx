import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Image, Modal } from 'react-native';

const CropsScreen = ({ setActiveContent }: { setActiveContent: (content: string) => void }) => {
  const [showAlertDelete, setShowAlertDelete] = useState(false); // Estado para controlar si se muestra la alerta de eliminar cosecha

  const deleteSeed = () => {
    setShowAlertDelete(true);
  };

  const goToAddCropScreen = () => {
    setActiveContent('addCrop');
  };

  const goToViewCropScreen = () => {
    setActiveContent('viewCrop');
  };

  const goToEditCropScreen = () => {
    setActiveContent('editCrop');
  };


  return (
    <View style={styles.cropsContainer}>
      <Text style={styles.cropsTitle}>Inventario<br />Cosechas</Text>
      <TouchableOpacity style={styles.addSeedButton} onPress={goToAddCropScreen}>
        <Image source={require('../../assets/img/add.png')}
          style={styles.addSeedImage}
          resizeMode="contain" />
      </TouchableOpacity>

      <View style={styles.seedsListContainer}>
        {[...Array(10).keys()].map(index => (
          <TouchableOpacity style={styles.seedItemContainer} onPress={goToViewCropScreen}>
            <Image
              source={require('../../assets/img/crop.png')}
              style={styles.seedItemImage}
              resizeMode="contain"
            />

            <View style={styles.seedTextContainer}>
              <Text style={styles.seedName}>Cosecha</Text>
              <Text style={styles.seedText}>Parcela</Text>
            </View>


            <TouchableOpacity onPress={goToEditCropScreen}>
              <Image
                source={require('../../assets/img/edit.png')}
                style={styles.editImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity onPress={deleteSeed}>
              <Image
                source={require('../../assets/img/delete.png')}
                style={styles.deleteImage}
                resizeMode="contain"
              />
            </TouchableOpacity>

          </TouchableOpacity>
        ))}
      </View>

      {/* Modal para la alerta de eliminar cosecha*/}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showAlertDelete}
      >
        <View style={styles.modalView}>
          <View style={styles.alertView}>
            <Text style={styles.alertMessage}>¿Esta seguro que quiere<br />eliminar esta cosecha?</Text>

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
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({

  cropsContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFCE3'
  },

  cropsTitle: {
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

export default CropsScreen;