import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// Here we import the KeyboardAvoidingView from react-native-keyboard-controller,
// instead of the original from react-native. Because it works better in many cases.


import { useNotes } from '@/storage/storagecontext';
import { SafeAreaView } from 'react-native-safe-area-context';

import { Link, useRouter } from 'expo-router';

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
        Alert.alert("Success")
        router.push('/(tabs)');
      }
    }
  };

  return (
    <SafeAreaView>
      <View>
        <Text style={styles.sitetext}>Add a note</Text>
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
        <TouchableOpacity style={styles.edit} onPress={onAdd}>
        <Text style={styles.editText}>Add</Text>
          </TouchableOpacity>

      <TouchableOpacity style={styles.edit}>
       
        <Link href={"/(tabs)/notes"}> <Text style={styles.editText}>Cancel </Text> </Link>
      
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
});