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
    onEdit: (note: Note) => void;
}

const NoteCard = ({ note, index, onEdit }: Props) => {
    return (
        <Pressable
            style={styles.card}
            onPress={() => console.log(`Note ${index + 1} pressed`)}
            android_ripple={{ color: '#ccc' }}>
            <Text style={styles.title}>{note.title}</Text>
            <Text style={styles.text}>{note.content}</Text>
            <Pressable style={styles.edit} onPress={() => onEdit(note)}>
                <Text style={styles.editText}>Edit</Text>
            </Pressable>
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
    edit: {
        marginTop: 10,
        padding: 10,
        backgroundColor: '#223045'
    },
    editText: {
        color: 'white',
    }
});

// Exporting the component so it can be used in other parts of the app
export default NoteCard;