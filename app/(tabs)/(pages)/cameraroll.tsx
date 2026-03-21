import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
    Alert,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

export default function CameraRollScreen() {
  const { source, id, title, content } = useLocalSearchParams<{
    source: string;
    id: string;
    title: string;
    content: string;
  }>();
  const [image, setImage] = useState<string | null>(null);

  const pickImage = async () => {
    const permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (!permissionResult.granted) {
      Alert.alert(
        "Tillatelse kreves",
        "Tillatelse til å få tilgang til mediebiblioteket er påkrevd.",
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ["images"],
      allowsEditing: true,
      aspect: [16, 9],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  const onSave = () => {
    if (!image) {
      Alert.alert("Ingen bilde valgt", "Vennligst velg et bilde først.");
      return;
    }
    if (source === "editnote") {
      router.push({
        pathname: "/(tabs)/(pages)/editnote",
        params: { id, title, content, photoUri: image },
      });
    } else {
      router.push({
        pathname: "/(tabs)/(pages)/newnote",
        params: { photoUri: image },
      });
    }
  };

  return (
    <View style={styles.container}>
      <View>
        {image && <Image source={{ uri: image }} style={styles.image} />}
      </View>
      <View style={styles.edit}>
        <TouchableOpacity onPress={pickImage}>
          <Text style={styles.editText}>Velg bilde fra kamerarullen</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.edit}>
        <TouchableOpacity onPress={onSave}>
          <Text style={styles.editText}>Lagre</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.edit}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.editText}>Avbryt</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: 300,
    height: 200,
  },
  edit: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#223045",
  },
  editText: {
    color: "white",
  },
});
