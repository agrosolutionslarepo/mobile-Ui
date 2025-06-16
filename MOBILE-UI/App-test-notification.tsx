import { Text, View, Button, Platform, SafeAreaView,StatusBar, StyleSheet } from 'react-native';
import UseNotification from './src/hooks/useNotification';



async function sendPushNotification(expoPushToken: string) {
  const message = {
    to: expoPushToken,
    sound: 'default',
    title: 'Testeo de notificación',
    body: 'Hola mundo',
    data: { someData: 'goes here' },
  };

  await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });
}

const App = () => {

  const expoPushToken = UseNotification();
  
  console.log("este es mi hook", expoPushToken)

  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'space-around' }}>
      <Button
        title="Press to Send Notification"
        onPress={async () => {
          await sendPushNotification(expoPushToken);
        }}
      />
    </View>
  );
}

export default App;

const styles = StyleSheet.create ({
  container: {
    flex: 1,
  }
})
