

import React, { useCallback, useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import AppContext from '../common/appcontext';
import BottomBar from '../friender/BottomBar.react';
import axios from 'axios';
import { baseUrl } from '../common/const';
import Line from '../common/Line.react';
import CrousteamTextInput from '../common/CrousteamTextInput.react';

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
        flex: 1,
        padding: 16,
        justifyContent: "space-between"
    },
    footer: {
        flexBasis: '8%',
    }
});

export default function ListChatView({gid, setGid}) {
    const [searchText, setSearchText] = useState('');
    const {username, page, setPage, authToken} = useContext(AppContext)
    const [chats, setChats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasPermissionError, setPermissionError] = useState(false);
  
    const getAllChats = useCallback(() => {
      setIsLoading(true);
      // Set refreshing to true when we are loading data on pull to refresh
      setRefreshing(true);
      axios({
        baseURL : baseUrl,
        url : '/all-conversations/' + username,
        method : 'GET',
        headers : { Authorization : 'Bearer ' + authToken},
      }).then(response => {
        setIsLoading(false);
        setRefreshing(false); // Set refreshing to false when data is loaded
        if (response.status == 200) {
          const parsedData = response.data.map(chat => ({
            name: chat[0], gid:chat[2], time: chat[1]
          }));
          console.log(parsedData);
          setChats(parsedData);
          setPermissionError(false);
        } else if(response.status == 403) {
          setPermissionError(true);
        }
      }).catch(err => {
        console.error(`Something went wrong ${err.message}`);
        setIsLoading(false);
        setRefreshing(false); 
      });
    }, [authToken]);
  
    useEffect(() => {
      getAllChats();
    }, [authToken, getAllChats]);

    const renderChatItem = ({ item }) => (
        <TouchableOpacity onPress={() => {setGid(gid), setPage('chatdisplay')}}>

            <View style={styles.chatItem}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.lastMessageTime}>{item.time}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.mainContainer}>
            <CrousteamTextInput
                style={styles.searchInput}
                placeholder="Search..."
                value={searchText}
                onChangeText={(text) => setSearchText(text)}
            />

            <FlatList
                data={chats}
                keyExtractor={(item) => item.gid}
                renderItem={renderChatItem}
            />
            <View style={styles.footer}>
                <BottomBar page={page} setPage={setPage} />
            </View>
        </View>
    );
};

