import React, { useContext, useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Button } from 'react-native';
import axios from 'axios';
import { baseUrl } from '../common/const';
import AppContext from '../common/appcontext';
import CrousteamButton from '../common/CrousteamButton.react';

export default function EventDisplayView({eid, setEid, gid, setGid}){
    const {username, setPage, authToken} = useContext(AppContext)

    const [isLoading, setIsLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [hasPermissionError, setPermissionError] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [postError, setPostError] = useState(false);

        const getGroup = useCallback(() => {
            setIsLoading(true);
            // Set refreshing to true when we are loading data on pull to refresh
            setRefreshing(true);
            axios({
              baseURL : baseUrl,
              url : '/event-gid',
              method : 'GET',
              headers : { Authorization : 'Bearer ' + authToken},
              params:{
                eid:eid
              }
            }).then(response => {
              setIsLoading(false);
              setRefreshing(false); // Set refreshing to false when data is loaded
              if (response.status == 200) {
                console.log(response.data[0])
                setGid(response.data[0]);
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
            getGroup();
          }, [authToken, getGroup]);

    return(
        <View>
            <Text> C'est la page d'event de {eid} et je suis {username}</Text>

            <CrousteamButton title="Chat" onPress ={() => {setPage("chatdisplay")}}></CrousteamButton>

            <Button title="Retour" onPress={() => { setEid(-1); setPage("listevent") }}></Button>
        </View>
    )
};