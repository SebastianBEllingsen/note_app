/* Components are used often to build reusable pieces of UI
 * Here we use it to create a card that displays a cat fact
 * This makes the component reusable throughout the app, and
 * makes it easier to multiply, maintain and update 
*/
import { Note } from '@/storage/storagecontext';
import { Pressable, StyleSheet, Text } from 'react-native';

interface Props {
    note: Note;
    index: number;
}

const NoteCard = ({ note, index }: Props) => {
    return (
        <Pressable
            style={styles.card}
            onPress={() => console.log(`Note ${index + 1} pressed`)}
            android_ripple={{ color: '#ccc' }}>
            <Text style={styles.title}>{note.title}</Text>
            <Text style={styles.text}>{note.content}</Text>
        </Pressable>
    );
};

// Styles for the component
const styles = StyleSheet.create({
    card: {
        backgroundColor: 'white',
        padding: 15,
        marginBottom: 10,
        borderRadius: 10},
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 4,
    },
    text: {
        fontSize: 16,
    },
});

// Exporting the component so it can be used in other parts of the app
export default NoteCard;