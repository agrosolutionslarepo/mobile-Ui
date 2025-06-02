import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';

const HomeScreen = () => {
  const [cotizaciones, setCotizaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulación de datos
    setTimeout(() => {
      const fakeData = [
        { symbol: 'ZSUSX', price: 520.5, ts: '2025-05-31T14:00:00Z' },
        { symbol: 'CZCUSX', price: 480.3, ts: '2025-05-31T14:00:00Z' },
        { symbol: 'KEUSX', price: 350.1, ts: '2025-05-31T14:00:00Z' },
      ];
      setCotizaciones(fakeData);
      setLoading(false);
    }, 1000);
  }, []);

  const getNombreSemilla = (symbol: string) => {
    switch (symbol) {
      case 'ZSUSX':
        return 'Soja';
      case 'CZCUSX':
        return 'Maíz';
      case 'KEUSX':
        return 'Trigo';
      default:
        return symbol;
    }
  };

  const getImageSource = (symbol: string) => {
    switch (symbol) {
      case 'ZSUSX':
        return require('../assets/img/soja.png');
      case 'CZCUSX':
        return require('../assets/img/maiz.png');
      case 'KEUSX':
        return require('../assets/img/trigo.png');
      default:
        return require('../assets/img/seed.png');
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.row}>
        <Image source={getImageSource(item.symbol)} style={styles.image} />
        <View>
          <Text style={styles.symbol}>{getNombreSemilla(item.symbol)}</Text>
          <Text style={styles.price}>Precio: ${item.price}</Text>
          <Text style={styles.date}>
            Fecha: {new Date(item.ts).toLocaleString()}
          </Text>
        </View>
      </View>
    </View>
  );

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
    textTransform: 'uppercase'
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
    textAlign: 'center'
  },
});

export default HomeScreen;