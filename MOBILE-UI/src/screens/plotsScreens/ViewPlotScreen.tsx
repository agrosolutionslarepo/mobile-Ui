import React from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Dimensions, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { LineChart, BarChart } from 'react-native-chart-kit';



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

  const screenWidth = Dimensions.get('window').width - 40;
  const [loadingClima, setLoadingClima] = useState(true);

  const [clima, setClima] = useState<null | {
    obs: {
      temp: number;
      humidity: number;
      precip_mm: number;
      station: string;
      source: string;
    };
    hourly: {
      time: string[];
      temperature_2m: number[];
    };
    daily: {
      time: string[];
      et0_fao_evapotranspiration: number[];
      gdd_base10: number[];
    };
  }>(null);


  useEffect(() => {
    const fetchClima = async () => {
      if (selectedPlot?.latitud !== undefined && selectedPlot?.longitud !== undefined) {
        try {
          setLoadingClima(true); // Inicia loader

          const token = await AsyncStorage.getItem('userToken');
          if (!token) return;

          const response = await axios.get(
            `http://localhost:3000/clima/current?lat=${selectedPlot.latitud}&lon=${selectedPlot.longitud}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          setClima({
            obs: response.data.obs,
            hourly: response.data.agro.hourly,
            daily: response.data.agro.daily
          });

        } catch (error) {
          console.error('Error al obtener datos climáticos:', error);
        } finally {
          setLoadingClima(false); // Finaliza loader
        }
      }
    };

    fetchClima();
  }, [selectedPlot]);




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
        <Text style={styles.label}>📛 Nombre de parcela</Text>
        <Text style={styles.plotText}>{selectedPlot.nombreParcela}</Text>

        <Text style={styles.label}>📐 Tamaño (ha)</Text>
        <Text style={styles.plotText}>{selectedPlot.tamaño}</Text>

        {selectedPlot.ubicacion && (
          <>
            <Text style={styles.label}>📍 Ubicación</Text>
            <Text style={styles.plotText}>{selectedPlot.ubicacion}</Text>
          </>
        )}

        {selectedPlot.gdd !== undefined && (
          <>
            <Text style={styles.label}>🌡️ GDD</Text>
            <Text style={styles.plotText}>{selectedPlot.gdd}</Text>
          </>
        )}

        {(selectedPlot.latitud !== undefined && selectedPlot.longitud !== undefined) && (
          <>
            <Text style={styles.label}>🌐 Coordenadas</Text>
            <Text style={styles.plotText}>
              Lat: {selectedPlot.latitud}, Lon: {selectedPlot.longitud}
            </Text>
          </>
        )}

        <Text style={styles.label}>⚙️ Estado</Text>
        <Text style={styles.plotText}>{selectedPlot.estado ? 'Activa' : 'Inactiva'}</Text>

      </View>

      {loadingClima ? (
        <View style={{ marginTop: 30, marginBottom:30, alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#665996" />
          <Text style={{ marginTop: 10, fontSize: 16, color: '#665996' }}>Cargando clima...</Text>
        </View>
      ) : clima && (
        <View>
          <Text style={styles.plotTitle}>{clima.obs.station}</Text>
          <View style={styles.formContainer}>
            <Text style={styles.label}>Clima actual</Text>
            <Text style={styles.plotText}>🌡️ Temp: {clima.obs.temp} °C</Text>
            <Text style={styles.plotText}>💧 Humedad: {clima.obs.humidity} %</Text>
            <Text style={styles.plotText}>🌧️ Precipitación: {clima.obs.precip_mm} mm</Text>

            <Text style={[styles.label, { marginTop: 20 }]}>🌤️ Temperaturas (próximas 12 hs)</Text>
            <View style={[styles.chartContainer]} >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart
                  data={{
                    labels: clima.hourly.time.slice(0, 12).map((t, i) => i % 2 === 0 ? t.split('T')[1] : ''),
                    datasets: [{ data: clima.hourly.temperature_2m.slice(0, 12) }]
                  }}
                  width={screenWidth * 1.5}
                  height={220}
                  yAxisSuffix="°C"
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#e6f7f5',
                    backgroundGradientTo: '#c3edea',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(0, 128, 128, ${opacity})`,
                    labelColor: () => '#333',
                    propsForDots: {
                      r: '4',
                      strokeWidth: '2',
                      stroke: '#fff'
                    },
                    propsForBackgroundLines: {
                      stroke: '#ddd',
                    },
                    style: {
                      borderRadius: 16,
                    },
                  }}
                  bezier
                  style={{
                    marginVertical: 8,
                    borderRadius: 16,
                    alignSelf: 'center'
                  }}
                />
              </ScrollView>
              <Text style={{ textAlign: 'center', fontSize: 12, fontStyle: 'italic', color: '#666', marginBottom: 10 }}>
                📌 Desliza hacia los lados para ver más ➡️
              </Text>
              <Text style={{ textAlign: 'center', fontSize: 14, marginBottom: 20 }}>
                Este gráfico muestra la evolución estimada de la temperatura a 2 metros del suelo durante las próximas 12 horas. Es útil para prever heladas o máximas térmicas.
              </Text>
            </View>



            <Text style={[styles.label, { marginTop: 20 }]}>📊 ET0 (últimos 7 días)</Text>
            <View style={[styles.chartContainer]} >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={{
                    labels: clima.daily.time.map(date => date.slice(5)), // MM-DD
                    datasets: [{ data: clima.daily.et0_fao_evapotranspiration }],
                  }}
                  width={screenWidth * 1.5}
                  height={220}
                  yAxisSuffix=" mm"
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#e6f7f5',
                    backgroundGradientTo: '#e6f7f5',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(46, 139, 87, ${opacity})`,
                    labelColor: () => '#333',
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 10,
                    alignSelf: 'center',
                  }}
                />
              </ScrollView>
              <Text style={{ textAlign: 'center', fontSize: 12, fontStyle: 'italic', color: '#666', marginBottom: 10 }}>
                📌 Desliza hacia los lados para ver más ➡️
              </Text>
              <Text style={{ textAlign: 'center', fontSize: 14, marginBottom: 20 }}>
                ET0 representa la evapotranspiración potencial: cuánta agua se pierde del suelo y las plantas por evaporación y transpiración. Ayuda a decidir el riego.
              </Text>
            </View>

            <Text style={[styles.label, { marginTop: 20 }]}>📊 GDD (últimos 7 días)</Text>
            <View style={[styles.chartContainer]} >
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <BarChart
                  data={{
                    labels: clima.daily.time.map(date => date.slice(5)), // MM-DD
                    datasets: [{ data: clima.daily.gdd_base10 }],
                  }}
                  width={screenWidth * 1.5}
                  height={220}
                  yAxisSuffix=" °C"
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#e6f7f5',
                    backgroundGradientTo: '#e6f7f5',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(147, 112, 219, ${opacity})`,
                    labelColor: () => '#333',
                  }}
                  style={{
                    marginVertical: 8,
                    borderRadius: 10,
                    alignSelf: 'center',
                  }}
                />
              </ScrollView>
              <Text style={{ textAlign: 'center', fontSize: 12, fontStyle: 'italic', color: '#666', marginBottom: 10 }}>
                📌 Desliza hacia los lados para ver más ➡️
              </Text>
              <Text style={{ textAlign: 'center', fontSize: 14, marginBottom: 20 }}>
                GDD (Grados Día de Desarrollo) mide la acumulación de calor útil para el crecimiento de los cultivos. Permite estimar etapas fenológicas clave.
              </Text>
            </View>


            <Text style={[styles.label, { marginTop: 20 }]}>📅 Datos agrícolas (7 días)</Text>
            <View style={{ gap: 10 }}>
              {clima.daily.time.map((dia, i) => (
                <View
                  key={i}
                  style={{
                    backgroundColor: '#D9D9D9',
                    borderRadius: 15,
                    padding: 10,
                    elevation: 3,
                    shadowColor: '#000',
                    shadowOffset: { width: 0, height: 1 },
                    shadowOpacity: 0.3,
                    shadowRadius: 1,
                    width: '90%',
                    marginLeft: '5%'
                  }}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>{dia}</Text>
                  <View style={[styles.rowContainer]}>
                    <Text>ET0: {clima.daily.et0_fao_evapotranspiration[i]} mm</Text>
                    <Text>GDD: {clima.daily.gdd_base10[i]}</Text>
                  </View>      
                </View>
              ))}
            </View>
            <Text style={{ textAlign: 'center', fontSize: 14, marginVertical: 20, width: '90%',marginLeft: '5%' }}>
              Estos valores diarios muestran cómo se comportaron la evapotranspiración (ET0) y los grados día de desarrollo (GDD). Son útiles para evaluar si las condiciones climáticas han favorecido el crecimiento de los cultivos o si se requería riego adicional.
            </Text>


            <TouchableOpacity style={styles.button} onPress={goToPlotsScreen}>
              <Text style={styles.buttonText}>Volver</Text>
            </TouchableOpacity>
          </View>

        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  plotContainer: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFCE3'
  },
  plotTitle: {
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 20,
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
    paddingTop: 20,
    paddingBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 5
  },
  label: {
    marginLeft: '5%',
    marginBottom: 5,
    fontWeight: 'bold',
    fontSize: 20,
    color: 'rgb(42, 125, 98)',
  },
  plotText: {
    width: '90%',
    height: 40,
    padding: 10,
    marginLeft: '5%',
    marginRight: '5%',
    marginBottom: 20,
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
  chartContainer: {
    width: '90%',
    marginLeft: '5%',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginTop: 5
  }
});

export default ViewPlotScreen;