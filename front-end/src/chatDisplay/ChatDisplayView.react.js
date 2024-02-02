import React, { useContext, useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput } from 'react-native';
import axios from 'axios';
import { baseUrl } from '../common/const';
import AppContext from '../common/appcontext';
import ReturnButton from '../common/ReturnButton.react';
import CrousteamMessage from './Message.react';
import MessageInput from './MessageInput.react';

styles = StyleSheet.create({
    textstyle:{
        fontFamily:'Arista-Pro-Alternate-Bold-trial'
    }
})

export default function ChatDisplayView({log, setLog, event}) {
    const {username, setPage, authToken} = useContext(AppContext)
    const [messages, setMessages] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const [gid, setGid] = useState(-1)
    const [hasPermissionError, setPermissionError] = useState(false);

    const getGid = useCallback(() => {
      setIsLoading(true)
      axios({
        baseURL : baseUrl,
        url : '/group-gid',
        method : 'GET',
        headers : { Authorization : 'Bearer ' + authToken},
        params: {login1:username, login2:log}
      }).then(response => {
        setIsLoading(false); // Set refreshing to false when data is loaded
        if (response.status == 200) {
          const parsedData1 = response.data
          setGid(parsedData1.gid);
          setPermissionError(false);
        } else if(response.status == 403) {
          setPermissionError(true);
        }
      }).catch(err => {
        console.error(`Something went wrong ${err.message}`);
        setIsLoading(false);
      });
    }, [authToken]);

    const getAllMessagesRequest = useCallback(() => {
    setIsLoading(true);
    // Set refreshing to true when we are loading data on pull to refresh
     axios({
      baseURL : baseUrl,
      url : '/messages/gid:' + gid,
      method : 'GET',
      headers : { Authorization : 'Bearer ' + authToken},
      
    }).then(response => {
      setIsLoading(false); // Set refreshing to false when data is loaded
      if (response.status == 200) {
        const parsedData2 = response.data.map(message => ({
          mid: message[0], content: message[1], sender: message[3], time:message[2]
        }));

        setMessages(parsedData2);
        setPermissionError(false);
      } else if(response.status == 403) {
        setPermissionError(true);
      }
    }).catch(err => {
      console.error(`Something 1 went wrong ${err.message}`);
      setIsLoading(false);
    });
  }, [gid]);

  useEffect(() => {
    getGid();
  }, [authToken]
  );

  useEffect(() =>{
    if (gid != -1){
      console.log('je suis passé par ici')
      getAllMessagesRequest()
      const intervalId = setInterval(getAllMessagesRequest, 5000); // Then call it every 5 seconds

      // Clean up the interval on component unmount
      return () => clearInterval(intervalId);}}
    , [gid, getAllMessagesRequest]);

  const renderItem = ({item}) => <CrousteamMessage item={item}/>;

    return(
    <View>
        <ReturnButton onPress={() => {setLog('null'), setPage('listchat')}}></ReturnButton>
        
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
        inverted
        keyExtractor={item => item.mid} 
          />
      <MessageInput gid={gid} username={username}></MessageInput>
    </View>
        
    </View>)
}