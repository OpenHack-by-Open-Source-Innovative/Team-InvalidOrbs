import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button } from "react-native";
import * as React from "react";
import { Audio } from "expo-av";

export default function Alarm({ navigation, route }) {
  const [isButtonClicked, setIsButtonClicked] = React.useState(true);
  const [sound, setSound] = React.useState();
  const [location, setLocation] = React.useState({
    coords: {
      latitude: route.params.location.coords.latitude,
      longitude: route.params.location.coords.longitude,
    },
  });

  async function playSound() {
    console.log("Loading Sound");
    const { sound } = await Audio.Sound.createAsync(
      require("../assets/alarm.mp3")
    );
    setSound(sound);

    console.log("Playing Sound");
    if (setIsButtonClicked) {
      await sound.playAsync();
    }
  }

  async function stopSound() {
    sound.unloadAsync();
    setIsButtonClicked(false);
    navigation.replace("Map", { location: location });
  }

  React.useEffect(() => {
    if (isButtonClicked) {
      playSound();
      setIsButtonClicked(false);
    }
  });
  return (
    <View style={styles.container}>
      <View style={styles.buttonContainer}>
        <Button title="Stop Alarm" color="black" onPress={stopSound} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "red",
    alignItems: "center",
    justifyContent: "center",
  },
  buttonContainer: {
    width: "80%",
    borderRadius: 30,
    height: "10%",
    textAlign: "middle",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
  },
});
