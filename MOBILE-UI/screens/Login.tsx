import * as React from "react";
import { Image } from "expo-image";
import { StyleSheet, ImageBackground, View, Text } from "react-native";
import { Button, TextInput } from "react-native-paper";
import {useTailwind} from 'tailwind-rn';
import utilities from '../tailwind.json';

const Login = () => {

  const tailwind = useTailwind();
  const [text, setText] = React.useState("");

  return (
    <View>

      <ImageBackground
        style={tailwind('absolute inset-0 z-0')} // Estilo para que el background vaya al fondo 
        resizeMode="center"
        source={require("../assets/fondoLogin.png")}
      />

      <Image
        style={tailwind('')}
        contentFit="cover"
        source={require("../assets/agrosolutionsLogo.png")}
      />

      <TextInput
        label="Email"
        value={text}
        onChangeText={text => setText(text)}
      />
      <TextInput
        label="Contraseña"
        value={text}
        onChangeText={text => setText(text)}
      />


      {/* <View style={[styles.loginItem, styles.loginLayout]} />
      <Button
        style={styles.todaviaNoTenes}
        mode="text"
        labelStyle={styles.todaviaNoTenesBtn}
        onPress={() => {}}
      >{`¿Todavia no tenes cuenta? 
        Registrate`}</Button>
      <Button
        style={styles.olvidMiContrasea}
        mode="text"
        labelStyle={styles.olvidMiContraseaBtn}
      >
        Olvidé mi contraseña
      </Button>
      <View style={[styles.frame1, styles.frame1Layout]}>
        <Text style={[styles.usuario, styles.usuarioTypo]}>Usuario</Text>
      </View>
      <View style={[styles.frame2, styles.frame2Layout]}>
        <Text style={[styles.contrasea, styles.frame2Layout]}>Contraseña</Text>
      </View>
      <View style={[styles.frame3, styles.frame3Layout]}>
        <Text style={[styles.continuarConGoogle, styles.frame3Layout]}>
          Continuar con google
        </Text>
      </View>
      <View style={[styles.frame4, styles.frame4Layout]}>
        <Image
          style={[styles.search21, styles.frame4Layout]}
          contentFit="cover"
          source={require("../assets/search-2-1.png")}
        />
      </View>
      <View style={[styles.frame5, styles.frame5Layout]} />
      <View style={styles.frame6}>
        <Button
          style={[styles.frameChild, styles.frameBorder]}
          mode="contained"
          onPress={() => {}}
          contentStyle={styles.rectangleButtonBtn}
        >
          ingresar
        </Button>
        <Text style={[styles.ingresar, styles.frame5Layout]}>Ingresar</Text>
      </View> */}
    </View>
  );
};


export default Login;
