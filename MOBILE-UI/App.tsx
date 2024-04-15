import React, { useState } from 'react';
import { View } from 'react-native';

import SeedsScreen from './src/screens/seedsScreens/SeedsScreen';
import AddSeedScreen from './src/screens/seedsScreens/AddSeedScreen';
import ViewSeedScreen from './src/screens/seedsScreens/ViewSeedScreen';
import EditSeedScreen from './src/screens/seedsScreens/EditSeedScreen';

import PlotsScreen from './src/screens/plotsScreens/PlotsScreen';
import AddPlotScreen from './src/screens/plotsScreens/AddPlotScreen';
import ViewPlotScreen from './src/screens/plotsScreens/ViewPlotScreen';
import EditPlotScreen from './src/screens/plotsScreens/EditPlotScreen';

import CalendarScreen from './src/screens/CalendarScreen';

import CropsScreen from './src/screens/cropsScreens/CropsScreen';
import AddCropScreen from './src/screens/cropsScreens/AddCropScreen';
import ViewCropScreen from './src/screens/cropsScreens/ViewCropScreen';
import EditCropScreen from './src/screens/cropsScreens/EditCropScreen';

import Header from './src/common/Header';
import HomeScreen from './src/screens/HomeScreen';

import LoginScreen from './src/screens/userScreens/LoginScreen';
import RegisterScreen from './src/screens/userScreens/RegisterScreen';
import RecoverScreen from './src/screens/userScreens/RecoverScreen';


const App: React.FC = () => {
  const [activeContent, setActiveContent] = useState('login');

  const renderContent = () => {
    switch (activeContent) {
      case 'home':
        return <HomeScreen />;

      case 'calendar':
        return <CalendarScreen />;


      {/*Plots screens*/ }
      case 'plots':
        return <PlotsScreen setActiveContent={setActiveContent} />;

      case 'addPlot':
        return <AddPlotScreen setActiveContent={setActiveContent} />;

      case 'editPlot':
        return <EditPlotScreen setActiveContent={setActiveContent} />;

      case 'viewPlot':
        return <ViewPlotScreen setActiveContent={setActiveContent} />;


      {/*Seeds screens*/ }
      case 'seeds':
        return <SeedsScreen setActiveContent={setActiveContent} />;

      case 'addSeed':
        return <AddSeedScreen setActiveContent={setActiveContent} />;
        
      case 'editSeed':
        return <EditSeedScreen setActiveContent={setActiveContent} />;

      case 'viewSeed':
        return <ViewSeedScreen setActiveContent={setActiveContent} />;



      {/*Crops screens*/ }
      case 'crops':
        return <CropsScreen setActiveContent={setActiveContent} />;

      case 'addCrop':
        return <AddCropScreen setActiveContent={setActiveContent} />;

      case 'editCrop':
        return <EditCropScreen setActiveContent={setActiveContent} />;

      case 'viewCrop':
        return <ViewCropScreen setActiveContent={setActiveContent} />;


      {/*User screens*/ }
      case 'login':
        return <LoginScreen setActiveContent={setActiveContent} />;

      case 'register':
        return <RegisterScreen setActiveContent={setActiveContent} />;

      case 'recover':
        return <RecoverScreen setActiveContent={setActiveContent} />;

      default:
        return <LoginScreen setActiveContent={setActiveContent} />;
    }
  };

  const renderHeader = () => {
    if (activeContent !== 'login' && activeContent !== 'register' && activeContent !== 'recover') {
      return <Header onMenuClick={(menuItem) => setActiveContent(menuItem)} />;
    }
    return null;
  };

  return (
    <View style={{ flex: 1 }}>
      {renderHeader()}
      {renderContent()}
    </View>
  );
}

export default App;

