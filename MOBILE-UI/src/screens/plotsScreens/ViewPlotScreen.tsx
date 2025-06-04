import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity} from 'react-native';

interface Props {
  setActiveContent: (screen: string, data?: any) => void;
  selectedPlot: {
    _id: string;
    nombreParcela: string;
    tamaño: number;
    ubicacion?: string;
    estado?: boolean;
    gdd?: number;
    latitud?: number;
    longitud?: number;
  } | null;
}

const ViewPlotScreen: React.FC<Props> = ({ setActiveContent, selectedPlot }) => {
  const goToPlotsScreen = () => {
    setActiveContent('plots');
  };


  if (!selectedPlot) {
    return (
      <View style={styles.plotContainer}>
        <Text style={styles.plotTitle}>No se encontró la parcela</Text>
        <TouchableOpacity style={styles.button} onPress={goToPlotsScreen}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.plotContainer}>
      <Text style={styles.plotTitle}>Parcela</Text>

      <View style={styles.formContainer}>
        <Text style={styles.label}>Nombre de parcela</Text>
        <Text style={styles.plotText}>{selectedPlot.nombreParcela}</Text>

        <Text style={styles.label}>Tamaño</Text>
        <Text style={styles.plotText}>{selectedPlot.tamaño}</Text>

        {selectedPlot.ubicacion && (
          <>
            <Text style={styles.label}>Ubicación</Text>
            <Text style={styles.plotText}>{selectedPlot.ubicacion}</Text>
          </>
        )}

        {selectedPlot.gdd !== undefined && (
          <>
            <Text style={styles.label}>GDD</Text>
            <Text style={styles.plotText}>{selectedPlot.gdd}</Text>
          </>
        )}

        {(selectedPlot.latitud !== undefined && selectedPlot.longitud !== undefined) && (
          <>
            <Text style={styles.label}>Coordenadas</Text>
            <Text style={styles.plotText}>
              Lat: {selectedPlot.latitud}, Lon: {selectedPlot.longitud}
            </Text>
          </>
        )}

        <Text style={styles.label}>Estado</Text>
        <Text style={styles.plotText}>{selectedPlot.estado ? 'Activa' : 'Inactiva'}</Text>

        <TouchableOpacity style={styles.button} onPress={goToPlotsScreen}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  plotContainer: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    backgroundColor: '#FFFCE3',
    width: '100%',
  },
  plotTitle: {
    color: '#000000',
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 20,
    textAlign: 'center',
  },
  formContainer: {
    flex: 1,
    alignContent: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginLeft: '10%',
    marginBottom: 5,
    color: '#555',
    fontWeight: 'bold',
  },
  plotText: {
    width: '80%',
    height: 40,
    padding: 10,
    marginLeft: '10%',
    marginRight: '10%',
    marginBottom: 20,
    backgroundColor: '#D9D9D9',
    borderRadius: 25,
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5,
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

export default ViewPlotScreen;