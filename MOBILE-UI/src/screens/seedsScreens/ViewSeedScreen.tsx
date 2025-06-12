import React from 'react';
import { ScrollView, View, StyleSheet, Text, TouchableOpacity } from 'react-native';

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
      <View style={styles.container}>
        <Text style={styles.title}>No se encontró la semilla</Text>
        <TouchableOpacity style={styles.button} onPress={goToSeedsScreen}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Semilla</Text>

      <View style={styles.box}>
        <Text style={styles.label}>📛 Nombre de la semilla</Text>
        <Text style={styles.value}>{selectedSeed.nombreSemilla}</Text>

        <Text style={styles.label}>🧬 Tipo de semilla</Text>
        <Text style={styles.value}>{selectedSeed.tipoSemilla}</Text>

        <Text style={styles.label}>🔢 Cantidad</Text>
        <Text style={styles.value}>{`${selectedSeed.cantidadSemilla} ${selectedSeed.unidad}`}</Text>

        <TouchableOpacity style={styles.button} onPress={goToSeedsScreen}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFCE3'
  },

  title: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom:20,
    textAlign: 'center',
    fontSize: 22,
    color: '#665996',
    textTransform: 'uppercase'
  },

  box: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 20,
    marginBottom: 20,
    elevation: 5
  },

  label: {
    marginLeft: '5%',
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 18,
    color: 'rgb(42, 125, 98)',
  },

  value: {
    width: '90%',
    marginLeft: '5%',
    marginBottom: 15,
    padding: 10,
    backgroundColor: '#D9D9D9',
    borderRadius: 25,
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
    elevation: 3,
  },

  button: {
    marginTop: 20,
    width: '50%',
    marginLeft: '25%',
    height: 40,
    backgroundColor: '#A01BAC',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    elevation: 5,
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default ViewSeedScreen;
