import { Image } from "expo-image";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { StyleSheet } from "react-native";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>
        Edit app/index.tsx to edit this screen123.
      </Text>
      {/* brings us to the about page, about.jsx */}

      <Link href={"/about"}>About</Link>
      <View>
        <Text style={{ color: "red" }}>Hello</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "purple",
  },
  heading: {
    fontSize: 40,
    color: "red",
  },
});
