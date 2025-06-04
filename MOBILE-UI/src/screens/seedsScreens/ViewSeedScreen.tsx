import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';

interface Props {
  setActiveContent: (screen: string) => void;
  selectedSeed: {
    nombreSemilla: string;
    tipoSemilla: string;
    cantidadSemilla: number;
    unidad: string;
  } | null;
}

const ViewSeedScreen: React.FC<Props> = ({ setActiveContent, selectedSeed }) => {
  const goToSeedsScreen = () => {
    setActiveContent('seeds');
  };

  if (!selectedSeed) {
    return (
      <View style={styles.seedContainer}>
        <Text style={styles.seedTitle}>No se encontró la semilla</Text>
        <TouchableOpacity style={styles.button} onPress={goToSeedsScreen}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.seedContainer}>
      <Text style={styles.seedTitle}>Semilla</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre de la semilla</Text>
        <Text style={styles.seedText}>{selectedSeed.nombreSemilla}</Text>

        <Text style={styles.label}>Tipo de semilla</Text>
        <Text style={styles.seedText}>{selectedSeed.tipoSemilla}</Text>

        <Text style={styles.label}>Cantidad</Text>
        <Text style={styles.seedText}>{selectedSeed.cantidadSemilla} {selectedSeed.unidad}</Text>

        <TouchableOpacity style={styles.button} onPress={goToSeedsScreen}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  seedContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFCE3'
  },

  seedTitle: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom:20,
    textAlign: 'center',
    fontSize: 22,
    color: '#665996',
    textTransform: 'uppercase'
  },

  formContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',

    backgroundColor: '#fff',
    borderRadius: 15,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5
  },

  label: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: '10%',
    marginBottom: 5,
    color: 'rgb(42, 125, 98)',
  },

  seedText: {
    width: '80%',
    height: 40,
    padding: 10,
    marginLeft: '10%',
    marginRight: '10%',
    marginBottom: 30,
    backgroundColor: '#D9D9D9',
    borderRadius: 25,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5,
  },

  button: {
    color: '#F5F5F5',
    marginTop: 20,
    fontSize: 20,
    width: '50%',
    marginLeft: '25%',
    height: 35,
    backgroundColor: '#A01BAC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ViewSeedScreen;
