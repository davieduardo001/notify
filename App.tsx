import { StatusBar } from 'expo-status-bar';
import React, {useEffect, useState, useRef} from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

Notifications.setNotificationHandler({
handleNotification: async () => ({
  shouldShowAlert: true,
  shouldPlaySound: true,
  shouldSetBadge: true
})
});

export default function App() {
  const [notification, setNotification] = useState(false);
  const notificationListener = useRef();
  const responseListener = useRef();
  const [cont, setCont] = useState(0)

  function sleep(ms) {
		return new Promise((accept) => {
			setTimeout(() => {
				accept()
			}, ms);
		})
	}

  const notificacoes = {
    notificacao1: async function (){await Notifications.scheduleNotificationAsync({
      content: {
        title: "PROMOÇÃO!!",
        body: "PROMOÇÃO NOVA NÃO VAI PERDER EM",
        data: { data: "" }
      },
      trigger: { seconds: 5 }
    })},
    
    notificacao2: async function (){await Notifications.scheduleNotificationAsync({
      content: {
        title: "NO PRECINHO!!",
        body: "PROMOÇÃO NOVA NÃO VAI PERDER EM",
        data: { data: "" }
      },
      trigger: { seconds: 10 }
    })},
  
    notificacao3: async function (){await Notifications.scheduleNotificationAsync({
      content: {
        title: "TEM PROMOÇÃO CHEGANDO",
        body: "APROVEITA O FERIADÃO PARA FAZER UMAS COMPRAS",
        data: { data: "" }
      },
      trigger: { seconds: 15 }
    })}
  }

  useEffect(() => {
    
    notificacoes.notificacao1()
    notificacoes.notificacao2()
    notificacoes.notificacao3()

    const getPermission = async () => {
      if (Constants.isDevice) {
          const { status: existingStatus } = await Notifications.getPermissionsAsync();
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Enable push notifications to use the app!');
            await storage.setItem('expopushtoken', "");
            return;
          }
          const token = (await Notifications.getExpoPushTokenAsync()).data;
          await storage.setItem('expopushtoken', token);
      } else {
        alert('Must use physical device for Push Notifications');
      }

        if (Platform.OS === 'android') {
          Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
          });
        }
  }
  getPermission();

  notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
    setNotification(notification);
  })

  responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {});

  return () => {
    Notifications.removeNotificationSubscription(notificationListener.current);
    Notifications.removeNotificationSubscription(responseListener.current);
  }
}, []);

{/**ONCLICK FUNCTION FOR CALL NOTIFICATIONS**/}
const onClick = async () => {
  if(cont == 0){
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "PROMOÇÃO!!",
        body: "PROMOÇÃO NOVA NÃO VAI PERDER EM",
        data: { data: "" }
      },
      trigger: { seconds: 1 }
    })
    setCont(1)
  }else if(cont == 1){
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "NO PRECINHO!!",
        body: "PROMOÇÃO NOVA NÃO VAI PERDER EM",
        data: { data: "" }
      },
      trigger: { seconds: 1 }
    })
    setCont(2)
  }else if(cont == 2){
    await Notifications.scheduleNotificationAsync({
      content: {
        title: "TEM PROMOÇÃO CHEGANDO",
        body: "APROVEITA O FERIADÃO PARA FAZER UMAS COMPRAS",
        data: { data: "" }
      },
      trigger: { seconds: 1 }
    })
    setCont(0)
  }
  
}

return (
  <View style={styles.container}>
    <TouchableOpacity onPress={onClick}>
      <Text style={{backgroundColor: 'red', padding: 10, color: 'white'}}>Click me to send a push notification</Text>
    </TouchableOpacity>
    <StatusBar style="auto" />
  </View>
);
}

const styles = StyleSheet.create({
container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
},
});
