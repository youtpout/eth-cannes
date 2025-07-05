import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import {
    Image,
    StyleSheet,
    Button,
    TextInput,
    View,
    Text,
    Platform,
    Pressable,
    ScrollView,
} from "react-native";

export default function App() {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission refusée');
        return;
      }

      let loc = await Location.getCurrentPositionAsync({});
      setLocation(loc);
    })();
  }, []);

  return (
    <Text>
      Latitude: {location?.coords.latitude}, Longitude: {location?.coords.longitude}
    </Text>
  );
}
