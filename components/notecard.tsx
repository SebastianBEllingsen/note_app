/* Components are used often to build reusable pieces of UI
 * Here we use it to create a card that displays a cat fact
 * This makes the component reusable throughout the app, and
 * makes it easier to multiply, maintain and update
 */
import { Note } from "@/storage/storagecontext";
import { Image } from "expo-image";
import { Pressable, StyleSheet, Text, View } from "react-native";

interface Props {
  note: Note;
  onEdit: (note: Note) => void;
}

const NoteCard = ({ note, onEdit }: Props) => {
  return (
    <Pressable
      style={styles.card}
      onPress={() => {}}
      android_ripple={{ color: "#ccc" }}
    >
      <Text style={styles.title}>{note.title}</Text>
      <Text style={styles.text}>{note.content}</Text>
      <View>
        <Image
          source={{ uri: note.imageUrl ?? undefined }}
          contentFit="cover"
          style={{
            width: "100%",
            aspectRatio: 16 / 9,
            marginTop: 10,
          }}
        />
      </View>
      <Pressable style={styles.edit} onPress={() => onEdit(note)}>
        <Text style={styles.editText}>Rediger</Text>
      </Pressable>
      <Text style={styles.usernametext}>{note.username}</Text>
      <Text style={styles.timetext}>
        {note.updated_at ? `Redigert ${note.updated_at}` : note.created_at}
      </Text>
    </Pressable>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    padding: 10,
    borderRadius: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 4,
  },
  text: {
    fontSize: 16,
  },
  usernametext: {
    fontSize: 16,
    padding: 5,
    color: "#9116a1",
  },
  timetext: {
    fontSize: 10,
    padding: 3,
    marginTop: 10,
    color: "gray",
  },
  edit: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#223045",
  },
  editText: {
    color: "white",
  },
});

// Exporting the component so it can be used in other parts of the app
export default NoteCard;
