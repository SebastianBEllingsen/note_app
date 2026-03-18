import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Here we import the KeyboardAvoidingView from react-native-keyboard-controller,
// instead of the original from react-native. Because it works better in many cases.


import { useNotes } from '@/storage/storagecontext';
import { SafeAreaView } from 'react-native-safe-area-context';

import { useLocalSearchParams, useRouter } from 'expo-router';

export default function NewNoteScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id: string; title: string; content: string }>();
  const [title, setTitle] = useState(params.title ?? '');
  const [content, setContent] = useState(params.content ?? '');

  useEffect(() => {
    setTitle(params.title ?? '');
    setContent(params.content ?? '');
  }, [params.id]);
  const { editNote, deleteNote } = useNotes();
  
  const onEdit = async () => {
    const trimmedTitle = title.trim();
    const trimmedContent = content.trim();
    if (trimmedTitle) {
      const { error } = await editNote(Number(params.id), trimmedTitle, trimmedContent);

      if (error) {
        console.error('Error editing note:', error);
      } else {
        router.navigate("/(tabs)/notes");
      }
    }
  };

  const onDelete = async () => {
    const { error } = await deleteNote(Number(params.id))
  };



  return (
    <SafeAreaView>
      <View>
        <View >
          <Text style={styles.sitetext}>Edit note</Text>
        </View>
        
        <TextInput
        style ={styles.text}
          placeholder="Title"
          value={title}
          onChangeText={setTitle}
        />
        <TextInput
        style ={styles.text}
          placeholder="Content"
          multiline
          editable
          numberOfLines={4}
          value={content}
          onChangeText={setContent}
        />
<TouchableOpacity style={styles.edit} onPress={onEdit}>
  <Text style={styles.editText}>Save</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.edit} onPress={() => router.back()}>
  <Text style={styles.editText}>Cancel</Text>
</TouchableOpacity>

<TouchableOpacity style={styles.delete} onPress={onDelete}>
  <Text style={styles.editText}>Delete</Text>
</TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
    sitetext: {
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
        title: {
        fontSize: 18,
        fontWeight: 'bold',
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
    }
});