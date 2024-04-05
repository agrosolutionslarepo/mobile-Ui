import React, { useState } from 'react';
import { View } from 'react-native';
import Header from './src/common/Header';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/userScreens/LoginScreen';
import SemillasScreen from './src/screens/seedsScreens/SeedsScreen';
import ParcelasScreen from './src/screens/plotsScreens/PlotsScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import CosechasScreen from './src/screens/cropsScreens/CropsScreen';
import RegisterScreen from './src/screens/userScreens/RegisterScreen';
import RecoverScreen from './src/screens/userScreens/RecoverScreen';

const App: React.FC = () => {
  const [activeContent, setActiveContent] = useState('login');

  const renderContent = () => {
    switch (activeContent) {
      case 'home':
        return <HomeScreen />;

      case 'plots':
        return <ParcelasScreen />;

      case 'calendar':
        return <CalendarScreen />;

      case 'seeds':
        return <SemillasScreen />;

      case 'crops':
        return <CosechasScreen />;

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

