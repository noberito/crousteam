

import React, { useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';

import BottomBar from '../friender/BottomBar.react';

const ChatList = [
    { id: '1', contactName: 'John Doe', lastMessage: 'Hello!', lastMessageTime: '10:30 AM' },
    { id: '2', contactName: 'Jane Smith', lastMessage: 'How are you?', lastMessageTime: '11:45 AM' },
    { id: '3', contactName: 'Bob', lastMessage: 'Hi!', lastMessageTime: '12:00 PM' },
    { id: '4', contactName: 'Alice', lastMessage: 'Bye!', lastMessageTime: '12:30 PM' },

    // ... Autres chats
];

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 10,
    },
    chatItem: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#CCCCCC',
    },
    contactName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
    },
    lastMessageTime: {
        color: '#888888',
    },
    mainContainer: {
        flex:1,
        padding:16,
        justifyContent:"space-between"
      },
    footer: {
      flexBasis:100,
    }
  });

export default function ChatView({ page, setPage, navigation }) {
    const [searchText, setSearchText] = useState('');

    const handleChatSelection = (chatId) => {
        // Navigation vers l'écran de chat avec l'ID du chat sélectionné
        navigation.navigate('ChatScreen', { chatId });
    };

    const renderChatItem = ({ item }) => (
        <TouchableOpacity onPress={() => handleChatSelection(item.id)}>
            <View style={styles.chatItem}>
                <Text style={styles.contactName}>{item.contactName}</Text>
                <Text>{item.lastMessage}</Text>
                <Text style={styles.lastMessageTime}>{item.lastMessageTime}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
            />

            <FlatList
                data={ChatList.filter(chat => chat.contactName.toLowerCase().includes(searchText.toLowerCase()))}
                keyExtractor={(item) => item.id}
                renderItem={renderChatItem}
            />
            <View style = {styles.footer}>
                <BottomBar page={page} setPage={setPage}/>
            </View>
        </View>
    );
};

