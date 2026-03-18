import NoteCard from '@/components/notecard';
import { Note, useNotes } from '@/storage/storagecontext';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotesScreen() {
  const { notes, refresh } = useNotes();
  const router = useRouter();

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  const onEdit = (note: Note) => {
    router.push({
      pathname: '/(tabs)/(pages)/editnote',
      params: { id: note.id, title: note.title, content: note.content },
    });
  };

  return (
  <SafeAreaView style={{flex:1}}>
        <Text style={styles.text}>Work Notes</Text>
      <View style={styles.edit}>
        <Link href="/(tabs)/(pages)/newnote">
          <Text style={styles.editText}>New note</Text>
        </Link>
      </View>
      <FlatList
        contentContainerStyle={{ padding: 16, paddingBottom: 15 }}
        data={notes}
        renderItem={({ item, index }) => <NoteCard note={item} index={index} onEdit={onEdit} />}
        refreshControl=
        {
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
  </SafeAreaView>


  );
};

const styles = StyleSheet.create({
    text: {
        fontSize: 20,
        marginTop: 10,
        marginLeft: 10,
    },
    edit: {
      marginTop: 15,
      padding: 10,
      backgroundColor: '#223045',
        
    },
    editText: {
        color: 'white',
    },

});
