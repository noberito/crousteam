import React, { useContext, useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { baseUrl } from '../common/const';
import AppContext from '../common/appcontext';
import CrousteamButton from '../common/CrousteamButton.react';
import CrousteamMessage from './Message.react';

styles = StyleSheet.create({
    textstyle:{
        fontFamily:'Arista-Pro-Alternate-Bold-trial'
    }
})

export default function ChatDisplayView({log, setLog, event}) {
    const {username, setPage, authToken} = useContext(AppContext)
    const [messages, setMessages] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasPermissionError, setPermissionError] = useState(false);

    const getAllMessagesRequest = useCallback(() => {
    setIsLoading(true);
    // Set refreshing to true when we are loading data on pull to refresh
    setRefreshing(true);
    axios({
      baseURL : baseUrl,
      url : '/users-with-preferences/' + username,
      method : 'GET',
      headers : { Authorization : 'Bearer ' + authToken},
    }).then(response => {
      setIsLoading(false);
      setRefreshing(false); // Set refreshing to false when data is loaded
      if (response.status == 200) {
        const parsedData = response.data.map(message => ({
          mid: message[0], content: message[1], sender: message[2], time:message[3]
        }));
        console.log(parsedData);
        setMessages(parsedData);
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
    getAllMessagesRequest();
  }, [authToken, getAllMessagesRequest]);

  const renderItem = ({item}) => <CrousteamMessage item={item}/>;

    return(
    <View>
        <Text style={styles.textstyle}> C'est un chat entre {username} et {log} </Text>
        <View>
      {hasPermissionError && <View style={styles.incorrectWarning}>
        <Text style={styles.inputLabel}>
          Access Forbidden
        </Text>
      </View>}
      {isLoading && <ActivityIndicator size='large' animating={true} color='#FF0000' />}
      <FlatList
        data={messages}
        renderItem={renderItem}
        keyExtractor={item => item.login} // Customize the color of the spinner
          />
    </View>
        <CrousteamButton onPress={() => {setLog('null'), setPage('listchat')}} title='Retour'></CrousteamButton>
    </View>)
}