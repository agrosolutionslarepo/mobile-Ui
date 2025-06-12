import React, { useState, useEffect } from "react";
import {
  View,
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  Modal,
} from "react-native";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_URL } from "../../config";

interface Semilla {
  _id: string;
  nombreSemilla: string;
  tipoSemilla: string;
  cantidadSemilla: number;
  unidad: string;
}

const SeedsScreen = ({
  setActiveContent,
}: {
  setActiveContent: (content: string, data?: any) => void;
}) => {
  const [semillas, setSemillas] = useState<Semilla[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSemillas = async () => {
      try {
        const token = await AsyncStorage.getItem("userToken");
        if (!token) return;

        const response = await axios.get(`${API_URL}/semillas/getAllSemillas`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSemillas(response.data);
      } catch (error) {
        console.error("Error al obtener semillas:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSemillas();
  }, []);

  const goToAddSeedScreen = () => {
    setActiveContent("addSeed");
  };

  const goToViewSeedScreen = (semilla: Semilla) => {
    setActiveContent("viewSeed", semilla);
  };

  const goToEditSeedScreen = (semilla: Semilla) => {
    setActiveContent("editSeed", semilla);
  };

  const getSeedImage = (nombreSemilla: string) => {
    const lower = nombreSemilla
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .trim();

    if (lower.includes("maiz")) return require("../../assets/img/maiz.png");
    if (lower.includes("trigo")) return require("../../assets/img/trigo.png");
    if (lower.includes("soja")) return require("../../assets/img/soja.png");

    return require("../../assets/img/seed.png");
  };

  return (
    <View style={styles.seedsContainer}>
      <Text style={styles.seedsTitle}>Semillas</Text>

      <View style={styles.seedsListContainer}>
        {loading ? (
          <Text style={{ textAlign: "center" }}>Cargando semillas...</Text>
        ) : (
          semillas.map((semilla) => (
            <TouchableOpacity
              key={semilla._id}
              style={styles.seedItemContainer}
              onPress={() => setActiveContent("viewSeed", semilla)}
            >
              <Image
                source={getSeedImage(semilla.nombreSemilla)}
                style={styles.seedItemImage}
                resizeMode="contain"
              />

              <View style={styles.seedTextContainer}>
                <Text style={styles.seedName}>
                  {typeof semilla.nombreSemilla === "string"
                    ? semilla.nombreSemilla.charAt(0).toUpperCase() +
                      semilla.nombreSemilla.slice(1)
                    : "Nombre de Semilla"}
                </Text>
                <Text style={styles.seedText}>
                  {`${semilla.cantidadSemilla} ${semilla.unidad}`}
                </Text>
              </View>

              <TouchableOpacity onPress={() => goToEditSeedScreen(semilla)}>
                <Image
                  source={require("../../assets/img/edit.png")}
                  style={styles.editImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              {/*
              <TouchableOpacity onPress={deleteSeed}>
                <Image
                  source={require('../../assets/img/delete.png')}
                  style={styles.deleteImage}
                  resizeMode="contain"
                />
              </TouchableOpacity>*/}
            </TouchableOpacity>
          ))
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  seedsContainer: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFFCE3",
  },

  seedsTitle: {
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 20,
    textAlign: "center",
    fontSize: 22,
    color: "#665996",
    textTransform: "uppercase",
  },

  addSeedButton: {
    marginTop: 10,
    marginBottom: 20,

    backgroundColor: "#D9D9D9",
    width: "90%",
    height: 50,

    display: "flex",
    alignItems: "center",
    justifyContent: "center",

    borderRadius: 25,
  },

  addSeedImage: {
    width: 32,
    height: 36,
  },

  seedsListContainer: {
    width: "100%",
  },

  seedItemContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",

    width: "90%",

    marginLeft: "5%",
    marginRight: "5%",

    marginBottom: 20,

    paddingTop: 20,
    paddingBottom: 20,

    backgroundColor: "#fff",

    borderWidth: 1,
    borderRadius: 10,
    borderColor: "#96947B",

    shadowColor: "#96947B",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.75,
    shadowRadius: 3.84,
    elevation: 5,
  },

  seedItemImage: {
    width: 64,
    height: 64,
    marginRight: 10,
  },

  seedTextContainer: {
    width: "50%",
  },

  seedName: {
    fontSize: 18,
    fontWeight: "bold",
    color: "rgb(42, 125, 98)",
  },

  seedText: {
    fontSize: 14,
  },

  editImage: {
    width: 32,
    height: 32,
    marginLeft: 10,
  },

  deleteImage: {
    width: 32,
    height: 32,
    marginLeft: 10,
  },

  // Estilos para las alertas
  modalView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },

  alertView: {
    backgroundColor: "#FFFCE3",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },

  alertTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },

  alertMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: "center",
  },

  alertButtonsContainer: {
    flexDirection: "row",
  },

  alertButton: {
    backgroundColor: "#A01BAC",
    borderRadius: 20,
    marginHorizontal: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
  },

  alertButtonText: {
    fontSize: 18,
    color: "white",
    fontWeight: "bold",
  },
});

export default SeedsScreen;