import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../../config';

interface Props {
  setActiveContent: (screen: string) => void;
  selectedCrop: any; // ideally typed
}

const ViewCropScreen: React.FC<Props> = ({ setActiveContent, selectedCrop }) => {
  const [crop, setCrop] = useState<any | null>(selectedCrop);
  const [loading, setLoading] = useState(true);

  const goBack = () => setActiveContent('crops');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        if (!token || !selectedCrop?._id) {
          setLoading(false);
          return;
        }

        const cosechaRes = await axios.get(
          `${API_URL}/cosechas/getCosechaById/${selectedCrop._id}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const cosecha = cosechaRes.data;

        const [semillaRes, parcelaRes] = await Promise.all([
          axios.get(`${API_URL}/semillas/getSemillaById/${cosecha.cultivo.semilla}`,
            { headers: { Authorization: `Bearer ${token}` } }),
          axios.get(`${API_URL}/parcelas/getParcelaById/${cosecha.cultivo.parcela}`,
            { headers: { Authorization: `Bearer ${token}` } }),
        ]);

        setCrop({
          ...cosecha,
          cultivo: {
            ...cosecha.cultivo,
            semilla: semillaRes.data,
            parcela: parcelaRes.data,
          },
        });
      } catch (error) {
        console.error('Error al obtener datos de la cosecha:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedCrop]);

  if (loading) {
    return (
      <View style={[styles.container, { justifyContent: 'center' }]}>
        <ActivityIndicator size="large" color="#665996" />
      </View>
    );
  }

  if (!crop) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>No se encontró la cosecha</Text>
        <TouchableOpacity style={styles.button} onPress={goBack}>
          <Text style={styles.buttonText}>Volver</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const {
    fechaCosecha,
    cantidadCosechada,
    unidad,
    observaciones,
    cultivo,
    estado,
  } = crop;

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Cosecha</Text>

      <View style={styles.box}>
        <Text style={styles.label}>📅 Fecha de cosecha</Text>
        <Text style={styles.value}>{fechaCosecha.split('T')[0]}</Text>

        <Text style={styles.label}>🔢 Cantidad cosechada</Text>
        <Text style={styles.value}>{`${cantidadCosechada} ${unidad}`}</Text>

        <Text style={styles.label}>⚙️ Estado</Text>
        <Text style={styles.value}>{estado ? 'Activo' : 'Inactivo'}</Text>

        {observaciones ? (
          <>
            <Text style={styles.label}>📝 Observaciones</Text>
            <Text style={styles.value}>{observaciones}</Text>
          </>
        ) : null}
      </View>

      <Text style={styles.title}>Cultivo asociado</Text>

      <View style={styles.box}>
        <Text style={styles.label}>🌱 Semilla</Text>
        <Text style={styles.value}>{cultivo?.semilla?.nombreSemilla || 'N/D'}</Text>

        <Text style={styles.label}>🌿 Parcela</Text>
        <Text style={styles.value}>{cultivo?.parcela?.nombreParcela || 'N/D'}</Text>

        <Text style={styles.label}>📅 Fecha de siembra</Text>
        <Text style={styles.value}>{cultivo?.fechaSiembra?.split('T')[0] || 'N/D'}</Text>

        <Text style={styles.label}>🌾 Fecha estimada de cosecha</Text>
        <Text style={styles.value}>{cultivo?.fechaCosecha?.split('T')[0] || 'N/D'}</Text>

        <Text style={styles.label}>🌱 Cantidad sembrada</Text>
        <Text style={styles.value}>{cultivo?.cantidadSemilla ? `${cultivo.cantidadSemilla} ${cultivo.unidad}` : 'N/D'}</Text>

        <Text style={styles.label}>⚙️ Estado del cultivo</Text>
        <Text style={styles.value}>{cultivo?.estado ? 'Activo' : 'Inactivo'}</Text>

        {cultivo?.gdd && (
          <>
            <Text style={styles.label}>🌡️ GDD</Text>
            <Text style={styles.value}>{cultivo.gdd}</Text>
          </>
        )}

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