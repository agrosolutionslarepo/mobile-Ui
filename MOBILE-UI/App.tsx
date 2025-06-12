import React, { useState, useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Seeds
import SeedsScreen from './src/screens/seedsScreens/SeedsScreen';
import ViewSeedScreen from './src/screens/seedsScreens/ViewSeedScreen';
import EditSeedScreen from './src/screens/seedsScreens/EditSeedScreen';

// Plots
import PlotsScreen from './src/screens/plotsScreens/PlotsScreen';
import AddPlotScreen from './src/screens/plotsScreens/AddPlotScreen';
import ViewPlotScreen from './src/screens/plotsScreens/ViewPlotScreen';
import EditPlotScreen from './src/screens/plotsScreens/EditPlotScreen';

// Crops
import CropsScreen from './src/screens/cropsScreens/CropsScreen';
import AddCropScreen from './src/screens/cropsScreens/AddCropScreen';
import ViewCropScreen from './src/screens/cropsScreens/ViewCropScreen';
import EditCropScreen from './src/screens/cropsScreens/EditCropScreen';

// Plantations
import PlantationsScreen from './src/screens/plantationScreens/PlantationsScreen';
import AddPlantationScreen from './src/screens/plantationScreens/AddPlantationScreen';
import EditPlantationScreen from './src/screens/plantationScreens/EditPlantationScreen';
import ViewPlantationScreen from './src/screens/plantationScreens/ViewPlantationScreen';

// Others
import Header from './src/common/Header';
import CompanyAlert from './src/common/CompanyAlert';
import HomeScreen from './src/screens/HomeScreen';

// Users
import LoginScreen from './src/screens/userScreens/LoginScreen';
import RegisterScreen from './src/screens/userScreens/RegisterScreen';
import RecoverScreen from './src/screens/userScreens/RecoverScreen';
import UserProfileScreen from './src/screens/userScreens/UserProfileScreen';
import EditProfileScreen from './src/screens/userScreens/EditProfileScreen';
import ChangePasswordScreen from './src/screens/userScreens/ChangePasswordScreen';

// Company
import CompanyScreen from './src/screens/companyScreens/CompanyScreen';
import EditCompanyScreen from './src/screens/companyScreens/EditCompanyScreen';

// Desactiva las imprsiones por consola cuando esta en producción
if (!__DEV__) {
  console.log = () => {};
  console.warn = () => {};
  console.error = () => {};
}

const App: React.FC = () => {
  const [activeContent, setActiveContent] = useState<string | null>(null);
  const [selectedSeed, setSelectedSeed] = useState<any>(null);
  const [selectedPlot, setSelectedPlot] = useState<any>(null);
  const [selectedCultivo, setSelectedCultivo] = useState<any>(null);
  const [selectedCrop, setSelectedCrop] = useState<any>(null);
  

  useEffect(() => {
    const checkUserToken = async () => {
      try {
        const token = await AsyncStorage.getItem('userToken');
        const decoded = await AsyncStorage.getItem('decodedToken');

        if (decoded) console.log('🧠 Token decodificado:', JSON.parse(decoded));
        if (token) {
          console.log('🔑 Token recuperado:', token);
          setActiveContent('home');
        } else {
          setActiveContent('login');
        }
      } catch (error) {
        console.error('Error verificando token:', error);
        setActiveContent('login');
      }
    };

    checkUserToken();
  }, []);

  const handleSetActiveContent = (screen: string, data?: any) => {
    if (screen === 'viewSeed' || screen === 'editSeed') {
      setSelectedSeed(data);
    }

    if (screen === 'viewPlot' || screen === 'editPlot') {
      setSelectedPlot(data);
    }

    if (screen === 'editPlantation' || screen === 'viewPlantation') {
      setSelectedCultivo(data);
    }

    if (screen === 'viewCrop' || screen === 'editCrop') {
      setSelectedCrop(data);
    }

    setActiveContent(screen); 
  };

  const renderContent = () => {
    switch (activeContent) {
      case 'home':
        return <HomeScreen />;

      // Plots
      case 'plots':
        return <PlotsScreen setActiveContent={handleSetActiveContent} />;
      case 'addPlot':
        return <AddPlotScreen setActiveContent={handleSetActiveContent} />;
      case 'editPlot':
        return <EditPlotScreen setActiveContent={handleSetActiveContent} selectedPlot={selectedPlot} />;
      case 'viewPlot':
        return <ViewPlotScreen setActiveContent={handleSetActiveContent} selectedPlot={selectedPlot} />;

      // Seeds
      case 'seeds':
        return <SeedsScreen setActiveContent={handleSetActiveContent} />;
      case 'editSeed':
        return <EditSeedScreen setActiveContent={handleSetActiveContent} selectedSeed={selectedSeed} />;
      case 'viewSeed':
        return <ViewSeedScreen setActiveContent={handleSetActiveContent} selectedSeed={selectedSeed} />;

      // Crops
      case 'crops':
        return <CropsScreen setActiveContent={handleSetActiveContent} />;
      case 'addCrop':
        return <AddCropScreen setActiveContent={handleSetActiveContent} />;
      case 'editCrop':
        return (<EditCropScreen setActiveContent={handleSetActiveContent} selectedCrop={selectedCrop}/>
        );
      case 'viewCrop':
        return <ViewCropScreen setActiveContent={handleSetActiveContent} selectedCrop={selectedCrop}/>;

      // Plantaciones
      case 'plantations':
        return <PlantationsScreen setActiveContent={handleSetActiveContent} />;
      case 'addPlantation':
        return <AddPlantationScreen setActiveContent={handleSetActiveContent} />;
      case 'editPlantation':
        return <EditPlantationScreen setActiveContent={handleSetActiveContent} selectedCultivo={selectedCultivo} />;
      case 'viewPlantation':
        return <ViewPlantationScreen setActiveContent={handleSetActiveContent} selectedPlantation={selectedCultivo} />;

      // Usuario
      case 'login':
        return <LoginScreen setActiveContent={setActiveContent} />;
      case 'register':
        return <RegisterScreen setActiveContent={setActiveContent} />;
      case 'recover':
        return <RecoverScreen setActiveContent={setActiveContent} />;
      case 'profile':
        return <UserProfileScreen setActiveContent={setActiveContent} />;
      case 'editProfile':
        return <EditProfileScreen setActiveContent={setActiveContent} />;
      case 'changePassword':
        return <ChangePasswordScreen setActiveContent={setActiveContent} />;

      // Empresa
      case 'company':
        return <CompanyScreen setActiveContent={setActiveContent} />;
      case 'editCompany':
        return <EditCompanyScreen setActiveContent={setActiveContent} />;

      default:
        return <LoginScreen setActiveContent={setActiveContent} />;
    }
  };

  const renderHeader = () => {
    if (
      activeContent !== 'login' &&
      activeContent !== 'register' &&
      activeContent !== 'recover'
    ) {
      return <Header onMenuClick={(menuItem) => setActiveContent(menuItem)} />;
    }
    return null;
  };

  const renderCompanyAlert = () => {
    if (
      activeContent !== 'login' &&
      activeContent !== 'register' &&
      activeContent !== 'recover'
    ) {
      return <CompanyAlert onNavigate={(screen) => setActiveContent(screen)} />;
    }
    return null;
  };

  if (activeContent === null) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#A01BAC" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      {renderHeader()}
      {renderCompanyAlert()}
      {renderContent()}
    </View>
  );
};

export default App;
