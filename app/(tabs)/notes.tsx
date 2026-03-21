import NoteCard from '@/components/notecard';
import { Note, useNotes } from '@/storage/storagecontext';
import { Link, useRouter } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, FlatList, RefreshControl, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotesScreen() {
  const { notes, refresh, loading, loadMore, hasMore } = useNotes();
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
      params: { id: note.id, title: note.title, content: note.content, imageUrl: note.imageUrl ?? '' },
    });
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Text style={styles.text}>Arbeidsnotater</Text>
      <View style={styles.edit}>
        <Link href="/(tabs)/(pages)/newnote">
          <Text style={styles.editText}>Nytt notat</Text>
        </Link>
      </View>
      {loading && notes.length === 0 ? (
        <ActivityIndicator testID="loading-indicator" size="large" style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          contentContainerStyle={{ padding: 16, paddingBottom: 15 }}
          data={notes}
          renderItem={({ item }) => <NoteCard note={item} onEdit={onEdit} />}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
          ListFooterComponent={
            hasMore ? (
              <TouchableOpacity style={styles.loadMore} onPress={loadMore} disabled={loading}>
                {loading ? (
                  <ActivityIndicator testID="loading-indicator" color="white" size="small" />
                ) : (
                  <Text style={styles.editText}>Last mer</Text>
                )}
              </TouchableOpacity>
            ) : null
          }
        />
      )}
    </SafeAreaView>
  );
}

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
  loadMore: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#223045',
    alignItems: 'center',
  },
});
