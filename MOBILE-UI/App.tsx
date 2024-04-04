import React, { useState } from 'react';
import { View } from 'react-native';
import Header from './src/common/Header';
import HomeScreen from './src/screens/HomeScreen';
import LoginScreen from './src/screens/userScreens/LoginScreen';
import SemillasScreen from './src/screens/semillasScreens/SemillasScreen';
import ParcelasScreen from './src/screens/parcelasScreens/ParcelasScreen';
import CalendarScreen from './src/screens/CalendarScreen';
import CosechasScreen from './src/screens/cosechasScreens/CosechasScreen';

const App: React.FC = () => {
  const [activeContent, setActiveContent] = useState('login');

  const renderContent = () => {
    switch (activeContent) {
      case 'home':
        return <HomeScreen />;

      case 'parcelas':
        return <ParcelasScreen />;

      case 'calendar':
        return <CalendarScreen />;

      case 'semillas':
        return <SemillasScreen />;

      case 'cosechas':
        return <CosechasScreen />;

      case 'login':
        return <LoginScreen  setActiveContent={setActiveContent}/>;

      default:
        return <LoginScreen  setActiveContent={setActiveContent}/>;
    }
  };

  const renderHeader = () => {
    if (activeContent !== 'login') {
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

