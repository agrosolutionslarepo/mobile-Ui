import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

const HomeScreen = ({ setActiveContent }: { setActiveContent: (content: string) => void }) => {

  const [company, setCompany] = useState('');
  const [invitationCode, setInvitationCode] = useState('');
  const [showAlertEmpty, setShowAlertEmpty] = useState(false); // Estado para controlar si se muestra la alerta de falta de campos
  const [showAlertSuccess, setShowAlertSuccess] = useState(false); // Estado para controlar si se muestra la alerta de ingreso de compania exitoso
  const [showAlertFail, setShowAlertFail] = useState(false); // Estado para controlar si se muestra la alerta de ingreso de compania fallido
  const [showAlertAddCompany, setShowAlertAddCompany] = useState(true); // Estado para controlar si se muestra la alerta de ingreso de compania
  const [showAlertAddCompanyName, setShowAlertAddCompanyName] = useState(false); // Estado para controlar si se muestra la alerta de ingreso de compania con nombre
  const [showAlertAddCompanyCode, setShowAlertAddCompanyCode] = useState(false); // Estado para controlar si se muestra la alerta de ingreso de compania con código

  const handleCompany = () => {
    if (company !== '' && company !== 'error' || invitationCode !== '' && invitationCode !== 'error') {
      setShowAlertSuccess(true);
    } else if (company === 'error' || invitationCode === 'error') {
      setShowAlertFail(true);
    } else {
      setShowAlertEmpty(true);
    }
  };

  const goToShowAlertAddCompanyName = () => {
    setShowAlertAddCompanyName(true);
    setShowAlertAddCompany(false); // Close the previous modal
  };

  const goToShowAlertAddCompanyCode = () => {
    setShowAlertAddCompanyCode(true);
    setShowAlertAddCompany(false); // Close the previous modal
  };

  const closeAlerts = () => {
    setShowAlertSuccess(false);
    setShowAlertAddCompany(false);
    setShowAlertAddCompanyName(false);
    setShowAlertAddCompanyCode(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Home screen</Text>

      {/* Modal para crear empresa o agregar código de invitación */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showAlertAddCompany}
        onRequestClose={() => {
          setShowAlertAddCompany(false);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.alertView}>
            <TouchableOpacity
              onPress={goToShowAlertAddCompanyName}
              style={styles.alertButton}
            >
              <Text style={styles.alertButtonText}>Crear tu Empresa</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={goToShowAlertAddCompanyCode}
              style={styles.alertButton}
            >
              <Text style={styles.alertButtonText}>Código de invitación</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para crear empresa */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showAlertAddCompanyName}
        onRequestClose={() => {
          setShowAlertAddCompanyName(false);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.alertView}>
            <Text style={styles.alertTitle}>Nombre de Empresa</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={company}
              onChangeText={setCompany}
            />

            <TouchableOpacity
              onPress={handleCompany}
              style={styles.alertButton}
            >
              <Text style={styles.alertButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para agregar código de invitación */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={showAlertAddCompanyCode}
        onRequestClose={() => {
          setShowAlertAddCompanyCode(false);
        }}
      >
        <View style={styles.modalView}>
          <View style={styles.alertView}>
            <Text style={styles.alertTitle}>Código de invitación</Text>
            <TextInput
              style={styles.input}
              placeholder=""
              value={invitationCode}
              onChangeText={setInvitationCode}
            />

            <TouchableOpacity
              style={styles.alertButton}
              onPress={handleCompany}
            >
              <Text style={styles.alertButtonText}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Modal para la alerta de falta de campos*/}
      <Modal
          animationType="fade"
          transparent={true}
          visible={showAlertEmpty}
          onRequestClose={() => {
            setShowAlertEmpty(false);
          }}
        >
          <View style={styles.modalView}>
            <View style={styles.alertView}>
              <Text style={styles.alertTitle}>Campos incompletos</Text>
              <Text style={styles.alertMessage}>Por favor, complete todos los campos.</Text>
              <TouchableOpacity
                onPress={() => setShowAlertEmpty(false)}
                style={styles.alertButton}
              >
                <Text style={styles.alertButtonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal para la alerta de ingreso de empresa exitoso*/}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showAlertSuccess}
          onRequestClose={() => {
            setShowAlertSuccess(false);
          }}
        >
          <View style={styles.modalView}>
            <View style={styles.alertView}>
              <Text style={styles.alertTitle}>Ingreso de empresa exitoso</Text>
              <TouchableOpacity
                style={styles.alertButton}
                onPress={closeAlerts}
              >
                <Text style={styles.alertButtonText}>Continuar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Modal para la alerta de ingreso de empresa fallido*/}
        <Modal
          animationType="fade"
          transparent={true}
          visible={showAlertFail}
          onRequestClose={() => {
            setShowAlertFail(false);
          }}
        >
          <View style={styles.modalView}>
            <View style={styles.alertView}>
              <Text style={styles.alertTitle}>Oh no! Algo salio mal!</Text>
              <Text style={styles.alertMessage}>Intentelo nuevamente.</Text>
              <TouchableOpacity
                onPress={() => setShowAlertFail(false)}
                style={styles.alertButton}
              >
                <Text style={styles.alertButtonText}>Volver</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
    </View>
  );
}

const styles = StyleSheet.create({

  textForm: {
    width: '80%',
    textAlign: 'left',
    fontSize: 20,
    color: '#D9D9D9',
    fontWeight: 'bold',
    marginLeft: 15
  },

  input: {
    width: '80%',
    height: 35,
    padding: 10,
    marginBottom: 20,
    backgroundColor: '#D9D9D9',
    borderRadius: 25,

    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5,
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
    width: '80%'
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

  alertButton: {
    backgroundColor: '#A01BAC',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginTop: 20,
    marginBottom: 20
  },

  alertButtonText: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold',
  },

});

export default HomeScreen;
