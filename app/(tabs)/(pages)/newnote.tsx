import { Image } from "expo-image";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

import { useNotes } from "@/storage/storagecontext";
import { uploadImage } from "@/utils/upload";
import { sendLocalNotification } from "@/utils/notifications";
import { SafeAreaView } from "react-native-safe-area-context";

import { Link, useLocalSearchParams, useRouter } from "expo-router";

export default function NewNoteScreen() {
  const router = useRouter();
  const { photoUri } = useLocalSearchParams<{ photoUri: string }>();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [uploading, setUploading] = useState(false);
  const { refresh, addNote } = useNotes();

  const onAdd = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle) return;

    setUploading(true);
    try {
      let imageUrl = "";
      if (photoUri) {
        imageUrl = await uploadImage(
          photoUri,
          "images",
          `photos/${Date.now()}.jpg`,
        );
      }
      const { error } = await addNote(trimmedTitle, trimmedContent, imageUrl);

      if (error) {
        Alert.alert("Feil", "Kunne ikke lagre notatet. Prøv igjen.");
      } else {
        setTitle("");
        setContent("");
        await sendLocalNotification(trimmedTitle);
        refresh();
        Alert.alert("Suksess", "Notatet ble lagret!");
        router.push("/(tabs)");
      }
    } catch (e: any) {
      Alert.alert("Feil", e.message ?? "Noe gikk galt under opplasting.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text style={styles.sitetext}>Legg til notat</Text>
        <TextInput
          style={styles.text}
          placeholder="Tittel"
          value={title}
          onChangeText={setTitle}
          editable={!uploading}
        />
        <TextInput
          style={styles.text}
          placeholder="Innhold"
          multiline
          editable={!uploading}
          numberOfLines={4}
          value={content}
          onChangeText={setContent}
        />
        {photoUri ? (
          <View>
            <Image
              source={{ uri: photoUri }}
              contentFit="contain"
              style={{ width: "100%", aspectRatio: 16 / 9, marginTop: 10 }}
            />
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.edit, uploading && styles.disabled]}
          onPress={onAdd}
          disabled={uploading}
        >
          {uploading ? (
            <View style={styles.row}>
              <ActivityIndicator color="white" size="small" />
              <Text style={[styles.editText, { marginLeft: 8 }]}>
                Laster opp...
              </Text>
            </View>
          ) : (
            <Text style={styles.editText}>Legg til</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity style={styles.edit} disabled={uploading}>
          <Link href={"/(tabs)/notes"}>
            <Text style={styles.editText}>Avbryt</Text>
          </Link>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.edit}
          disabled={uploading}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/(pages)/camera",
              params: { source: "newnote" },
            })
          }
        >
          <Text style={styles.editText}>Kamera</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.edit}
          disabled={uploading}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/(pages)/cameraroll",
              params: { source: "newnote" },
            })
          }
        >
          <Text style={styles.editText}>Kamerarulle</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  sitetext: {
    fontSize: 20,
    marginTop: 10,
    marginLeft: 10,
  },
  edit: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#223045",
  },
  disabled: {
    backgroundColor: "#6b7a8d",
  },
  editText: {
    color: "white",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
    marginLeft: 10,
  },
});
