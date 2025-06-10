import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView } from 'react-native';

interface Props {
  setActiveContent: (screen: string) => void;
  selectedCrop: any; // ideally typed
}

const ViewCropScreen: React.FC<Props> = ({ setActiveContent, selectedCrop }) => {
  const goBack = () => setActiveContent('crops');

  if (!selectedCrop) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No se encontró la cosecha</Text>
        <TouchableOpacity style={styles.button} onPress={goBack}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const { fechaCosecha, cantidadCosechada, unidad, observaciones, cultivo } = selectedCrop;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cosecha</Text>

      <View style={styles.box}>
        <Text style={styles.label}>🌱 Semilla</Text>
        <Text style={styles.value}>{cultivo?.semilla?.nombreSemilla || 'N/D'}</Text>

        <Text style={styles.label}>🌿 Parcela</Text>
        <Text style={styles.value}>{cultivo?.parcela?.nombreParcela || 'N/D'}</Text>

        <Text style={styles.label}>📅 Fecha de cosecha</Text>
        <Text style={styles.value}>{fechaCosecha.split('T')[0]}</Text>

        <Text style={styles.label}>🔢 Cantidad cosechada</Text>
        <Text style={styles.value}>{`${cantidadCosechada} ${unidad}`}</Text>

        {observaciones ? (
          <>
            <Text style={styles.label}>📝 Observaciones</Text>
            <Text style={styles.value}>{observaciones}</Text>
          </>
        ) : null}

        <TouchableOpacity style={styles.button} onPress={goBack}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCE3',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#665996',
    textAlign: 'center',
    marginVertical: 20,
    textTransform: 'uppercase',
  },
  box: {
    backgroundColor: '#fff',
    borderRadius: 15,
    paddingVertical: 20,
    marginBottom: 20,
    elevation: 5,
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

export default ViewCropScreen;