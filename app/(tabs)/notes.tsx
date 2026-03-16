import NoteCard from '@/components/notecard';
import { useNotes } from '@/storage/storagecontext';
import { Link } from 'expo-router';
import { useState } from 'react';
import { FlatList, RefreshControl, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotesScreen() {
  const { notes, refresh } = useNotes();

  const [refreshing, setRefreshing] = useState(false);


  const onRefresh = async () => {
    setRefreshing(true);
    await refresh();
    setRefreshing(false);
  };

  return (
      <SafeAreaView>
        <Text>Notes</Text>
          <View>
        <Link href="/(tabs)/(pages)/newnote">
        New note
        </Link>
      </View>
      <FlatList
        data={notes}
        renderItem={({ item, index }) => <NoteCard note={item} index={index} />}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </SafeAreaView>
  );
}