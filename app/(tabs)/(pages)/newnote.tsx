import React, { useState } from 'react';
import { Button, Text, TextInput, View } from 'react-native';

// Here we import the KeyboardAvoidingView from react-native-keyboard-controller,
// instead of the original from react-native. Because it works better in many cases.


import { useNotes } from '@/storage/storagecontext';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useRouter } from 'expo-router';

export default function NewNoteScreen() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const { refresh, addNote } = useNotes();

  const onAdd = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (trimmedTitle) {
      const { error } = await addNote(trimmedTitle, trimmedContent);

      if (error) {
        console.error('Error adding a note:', error);
      } else {
        setTitle('');
        setContent('');
        refresh();
        router.push('/(tabs)');
      }
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text>Add a note</Text>
        <TextInput
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
          placeholder="Content"
          multiline
          editable
          numberOfLines={4}
          value={content}
          onChangeText={setContent}
        />
        <Button title="Add" onPress={onAdd} />
        <Button title="Cancel"/>
      </View>
    </SafeAreaView>
  );
}

