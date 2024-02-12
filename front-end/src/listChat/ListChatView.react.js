import React, { useCallback, useContext, useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import AppContext from '../common/appcontext';
import BottomBar from '../friender/BottomBar.react';
import axios from 'axios';
import { baseUrl } from '../common/const';
import Line from '../common/Line.react';
import CrousteamTextInput from '../common/CrousteamTextInput.react';
import colors from '../common/Colors.react';

const ChatList = [
    { id: '1', contactName: 'John Doe', lastMessage: 'Hello!', lastMessageTime: '10:30 AM' },
    { id: '2', contactName: 'Jane Smith', lastMessage: 'How are you?', lastMessageTime: '11:45 AM' },
    { id: '3', contactName: 'Bob', lastMessage: 'Hi!', lastMessageTime: '12:00 PM' },
    { id: '4', contactName: 'Alice', lastMessage: 'Bye!', lastMessageTime: '12:30 PM' },

    // ... Autres chats
];

const styles = StyleSheet.create({
    titleContainer: {



        alignItems: 'center',

        width: '100%'

    },

    title: {

        fontSize: 40,
        fontFamily: 'Arista-Pro-Alternate-Bold-trial',
        color: colors.secondaryText,
        marginBottom: 10

    },
    container: {
        flex: 1,
        padding: 16,
        fontFamily: 'Arista-Pro-Alternate-Bold-trial'
    },
    searchInput: {
        height: 40,
        borderColor: colors.secondaryText,
        borderWidth: 1,
        marginBottom: 16,
        paddingHorizontal: 10,
        borderRadius: 13,
        color: 'black',
        fontFamily: 'Arista-Pro-Alternate-Bold-trial'

    },
    chatItem: {
        padding: 16,
        borderBottomWidth: 0,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderTopWidth: 2,
        borderRightColor: colors.secondaryText,
        borderBottomColor: colors.secondaryText,
        borderLeftColor: colors.secondaryText,
        borderTopColor: colors.secondaryText,
        borderRadius: 13,
        marginBottom: 0,
        color: 'black',
        fontFamily: 'Arista-Pro-Alternate-Bold-trial'
    },
    contactName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 8,
        color: 'black',
        fontFamily: 'Arista-Pro-Alternate-Bold-trial'
    },
    lastMessageTime: {
        color: colors.primaryText,
    },
    mainContainer: {
        flex: 1,
        padding: 16,
        justifyContent: "space-between",
        fontFamily: 'Arista-Pro-Alternate-Bold-trial'
    },
    footer: {
        flexBasis: '8%',
    }
});

export default function ListChatView({ gid, setGid }) {
    const [searchText, setSearchText] = useState('');
    const { username, page, setPage, authToken } = useContext(AppContext)
    const [chats, setChats] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasPermissionError, setPermissionError] = useState(false);

    const getAllChats = useCallback(() => {
        setIsLoading(true);
        // Set refreshing to true when we are loading data on pull to refresh
        setRefreshing(true);
        axios({
            baseURL: baseUrl,
            url: '/all-conversations',
            method: 'GET',
            headers: { Authorization: 'Bearer ' + authToken },
        }).then(response => {
            setIsLoading(false);
            setRefreshing(false); // Set refreshing to false when data is loaded
            if (response.status == 200) {
                const parsedData = response.data.map(chat => ({
                    name: chat[0], gid: chat[2], time: chat[1]
                }));
                console.log(parsedData);
                setChats(parsedData);
                setPermissionError(false);
            } else if (response.status == 403) {
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

    const [filteredChats, setFilteredChats] = useState(null);

    // Mets à jour les chats filtrés lorsque le texte de recherche change
    useEffect(() => {
        if (!searchText) {
            // Si le champ de recherche est vide, affiche tous les chats
            setFilteredChats(chats);
        } else {
            // Sinon, filtre les chats en fonction du texte de recherche
            const filtered = chats.filter(chat => chat.name.toLowerCase().includes(searchText.toLowerCase()));
            setFilteredChats(filtered);
        }
    }, [searchText, chats]);

    const renderChatItem = ({ item }) => (
        <TouchableOpacity onPress={() => { setGid(item.gid), setPage('chatdisplay') }}>

            <View style={styles.chatItem}>
                <Text style={styles.contactName}>{item.name}</Text>
                <Text style={styles.lastMessageTime}>{item.time}</Text>
            </View>
        </TouchableOpacity>
    );

    return (




        <View style={styles.mainContainer}>
            <View style={styles.titleContainer}>

                <Text style={styles.title}>CROUSTEXT</Text>
            </View>
            <View style={styles.mainContainer}>
                <CrousteamTextInput
                    style={styles.searchInput}
                    placeholder="Search..."
                    value={searchText}
                    onChangeText={(text) => setSearchText(text)}
                />

                <FlatList
                    data={filteredChats}
                    keyExtractor={(item) => item.gid}
                    renderItem={renderChatItem}
                />

            </View>
            <View style={styles.footer}>
                <BottomBar page={page} setPage={setPage} />
            </View>
        </View>
    );
};
