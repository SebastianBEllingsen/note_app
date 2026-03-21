import { Image } from "expo-image";
import React, { useEffect, useState } from "react";
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
import { SafeAreaView } from "react-native-safe-area-context";

import { useLocalSearchParams, useRouter } from "expo-router";

export default function EditNoteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    id: string;
    title: string;
    content: string;
    imageUrl: string;
    photoUri: string;
  }>();
  const [title, setTitle] = useState(params.title ?? "");
  const [content, setContent] = useState(params.content ?? "");
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setTitle(params.title ?? "");
    setContent(params.content ?? "");
  }, [params.id]);

  const { editNote, deleteNote } = useNotes();

  const onEdit = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (!trimmedTitle) return;

    setUploading(true);
    try {
      let imageUrl = params.imageUrl ?? "";
      if (params.photoUri) {
        imageUrl = await uploadImage(
          params.photoUri,
          "images",
          `photos/${Date.now()}.jpg`,
        );
      }
      const { error } = await editNote(
        Number(params.id),
        trimmedTitle,
        trimmedContent,
        imageUrl,
      );

      if (error) {
        Alert.alert("Feil", "Kunne ikke lagre endringene. Prøv igjen.");
      } else {
        router.navigate("/(tabs)/notes");
      }
    } catch (e: any) {
      Alert.alert("Feil", e.message ?? "Noe gikk galt under opplasting.");
    } finally {
      setUploading(false);
    }
  };

  const onDelete = async () => {
    Alert.alert(
      "Slett notat",
      "Er du sikker på at du vil slette dette notatet?",
      [
        { text: "Avbryt", style: "cancel" },
        {
          text: "Slett",
          style: "destructive",
          onPress: async () => {
            const { error } = await deleteNote(Number(params.id));
            if (error) {
              Alert.alert("Feil", "Kunne ikke slette notatet. Prøv igjen.");
            } else {
              router.navigate("/(tabs)/notes");
            }
          },
        },
      ],
    );
  };

  return (
    <SafeAreaView>
      <View>
        <View>
          <Text style={styles.sitetext}>Rediger notat</Text>
        </View>

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
        {params.photoUri || params.imageUrl ? (
          <View>
            <Image
              source={{ uri: params.photoUri || params.imageUrl || undefined }}
              contentFit="cover"
              style={{
                width: "100%",
                aspectRatio: 16 / 9,
                marginTop: 10,
              }}
            />
          </View>
        ) : null}

        <TouchableOpacity
          style={[styles.edit, uploading && styles.disabled]}
          onPress={onEdit}
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
            <Text style={styles.editText}>Lagre</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.edit}
          disabled={uploading}
          onPress={() => router.back()}
        >
          <Text style={styles.editText}>Avbryt</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.edit}
          disabled={uploading}
          onPress={() =>
            router.push({
              pathname: "/(tabs)/(pages)/camera",
              params: { source: "editnote", id: params.id, title, content },
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
              params: { source: "editnote", id: params.id, title, content },
            })
          }
        >
          <Text style={styles.editText}>Kamerarulle</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.delete}
          onPress={onDelete}
          disabled={uploading}
        >
          <Text style={styles.editText}>Slett</Text>
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
  delete: {
    backgroundColor: "red",
    marginTop: 15,
    padding: 10,
  },
});
