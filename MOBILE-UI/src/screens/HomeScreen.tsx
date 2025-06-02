import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// 🔁 Mapeo centralizado de semilla
const SEMILLAS = {
  ZCUSX: {
    nombre: 'Maíz',
    imagen: require('../assets/img/maiz.png'),
  },
  ZSUSX: {
    nombre: 'Soja',
    imagen: require('../assets/img/soja.png'),
  },
  KEUSX: {
    nombre: 'Trigo',
    imagen: require('../assets/img/trigo.png'),
  },
};

const HomeScreen = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCotizaciones = async () => {
      try {
        setLoading(true);

        const token = await AsyncStorage.getItem('userToken');
        if (!token) throw new Error('Token no encontrado');

        const symbols = Object.keys(SEMILLAS); // ['ZCUSX', 'ZSUSX', 'KEUSX']
        const apiBase = 'http://localhost:3000/grain'; // 🔁 Reemplazá con tu IP local

        const responses = await Promise.all(
          symbols.map(async (symbol) => {
            const res = await axios.get(`${apiBase}/${symbol}/latest`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            return res.data;
          })
        );

        setCotizaciones(responses);
      } catch (error) {
        console.error('Error al obtener cotizaciones:', error);
        setCotizaciones([]);
      } finally {
        setLoading(false);
      }
    };

    fetchCotizaciones();
  }, []);

  const renderItem = ({ item }) => {
    const semilla = SEMILLAS[item.symbol] || {};
    return (
      <View style={styles.card}>
        <View style={styles.row}>
          <Image
            source={semilla.imagen || require('../assets/img/seed.png')}
            style={styles.image}
          />
          <View>
            <Text style={styles.symbol}>{semilla.nombre || item.symbol}</Text>
            <Text style={styles.price}>Precio: U$S {item.price}</Text>
            <Text style={styles.date}>
              Fecha: {new Date(item.ts).toLocaleString()}
            </Text>
          </View>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#665996" />
        <Text style={styles.loadingText}>Cargando cotizaciones...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cotizaciones de Semillas</Text>
      <FlatList
        data={cotizaciones}
        keyExtractor={(item) => item.symbol}
        renderItem={renderItem}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCE3',
    paddingTop: 40,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    alignSelf: 'center',
    color: '#665996',
    textTransform: 'uppercase',
  },
  list: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  image: {
    width: 40,
    height: 40,
    resizeMode: 'contain',
    marginRight: 12,
  },
  symbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#2a7d62',
  },
  price: {
    fontSize: 16,
    marginTop: 4,
  },
  date: {
    fontSize: 14,
    marginTop: 4,
    color: '#666',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#665996',
    textAlign: 'center',
  },
});

export default HomeScreen;
