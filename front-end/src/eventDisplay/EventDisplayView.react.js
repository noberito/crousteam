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

    const joinGroup = useCallback(() => {
        setIsPosting(true);
        axios({
            baseURL: baseUrl, // Assurez-vous que baseUrl est défini quelque part dans votre code
            url: '/event/' + username, // Modifiez ceci par l'URL appropriée pour poster un message
            method: 'POST',
            headers: { Authorization: 'Bearer ' + authToken },
            data: {
                eid: eid // Ajustez le nom de cette propriété selon votre API
            }
        }).then(response => {
            setIsPosting(false);
            if (response.status === 200 || response.status === 201) {
        // Message posté avec succès
                console.log('User added to the group successfully');
        // Vous pouvez ici actualiser la liste des messages ou gérer la réponse comme souhaité
            } else {
        // Gérer d'autres codes de statut selon votre API
                setPostError(true);
            }
        }).catch(err => {
            console.error(`Something went wrong while adding you to the group: ${err.message}`);
            setIsPosting(false);
             setPostError(true);
            });
        }, ); // Ajoutez d'autres dépendances si nécessaire

        const getGroup = useCallback(() => {
            setIsLoading(true);
            // Set refreshing to true when we are loading data on pull to refresh
            setRefreshing(true);
            axios({
              baseURL : baseUrl,
              url : '/event-gid',
              method : 'GET',
              headers : { Authorization : 'Bearer ' + authToken},
            }).then(response => {
              setIsLoading(false);
              setRefreshing(false); // Set refreshing to false when data is loaded
              if (response.status == 200) {
                setGid(response.data);
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
            <CrousteamButton title="Rejoindre le groupe" onPress ={() => {joinGroup()}}></CrousteamButton>
            <CrousteamButton title="Chat" onPress ={() => {setGid(gid); setPage("chatdisplay")}}></CrousteamButton>
            

            <Button title="Retour" onPress={() => { setEid(-1); setPage("listevent") }}></Button>
        </View>
    )
};