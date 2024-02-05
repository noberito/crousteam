import React, { useEffect, useState, useContext, useCallback } from 'react';
import { View, Text, Button } from "react-native"
import { baseUrl } from '../common/const';
import axios from 'axios';
import CrousteamButton from '../common/CrousteamButton.react';
import AppContext from '../common/appcontext';

export default function ProfileDisplayView({ gid, setGid, log, setLog,}) {

    const {username, setPage, authToken}= useContext(AppContext)
    const [, setIsLoading] = useState(false);
    const [info, setInfo] = useState('');
    const [lid, setLid] = useState();
    const [hasPermissionError, setPermissionError] = useState(false);
    const [isPosting, setIsPosting] = useState(false);
    const [postError, setPostError] = useState(false);

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
          console.error(`Something went wrong when getting the gid ${err.message}`);
          setIsLoading(false);
        });
      }, [postGid]);

      
    const postGid = useCallback(() => {
        setIsPosting(true);
        axios({
            baseURL: baseUrl, // Assurez-vous que baseUrl est défini quelque part dans votre code
            url: '/group-chat-2', // Modifiez ceci par l'URL appropriée pour poster un message
            method: 'POST',
            headers: { Authorization: 'Bearer ' + authToken },
            data: {
                login1: username, // Supposé que 'username' est l'utilisateur actuel, sinon ajustez selon le contexte
                login2: log, // Ajustez le nom de cette propriété selon votre API
            }
        }).then(response => {
            setIsPosting(false);
            if (response.status === 200 || response.status === 201) {
        // Message posté avec succès
              console.log(response.data)
              setGid(response.data)
              console.log('Group posted successfully');
        // Vous pouvez ici actualiser la liste des messages ou gérer la réponse comme souhaité
            } 
            
            else {
        // Gérer d'autres codes de statut selon votre API
                setPostError(true);
            }

        }).catch(err =>{
            console.error(`Something went wrong while posting the group: ${err.message}`);
            setIsPosting(false);
             setPostError(true);
            });
        }, ); // Ajoutez d'autres dépendances si nécessaire

    const loadInfo = () => {
        setIsLoading(true);

        console.log(`Request GET on ${baseUrl}/all-info`)

        axios({
            baseURL: baseUrl,
            url: `/all-info/${log}`,
            method: 'GET',
            // auth : {username : username, password : password} "Property 'btoa' doesn't exist"
        }).then(result => {
            console.log('OK ! ' + result.data)
            setIsLoading(false)
            setInfo(result.data)
            setLid(info['naissance'])
        }).catch(err => {
            console.error(`something went wrong here: ${err.message}`)
            alert(`something went wrong: ${err.message}`)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        loadInfo();
        getGid();
    }, [authToken]);

    const BoutonChat = () => {
      if (gid==""){
        return(
        <CrousteamButton title = "Ajout ami" onPress={() => {postGid()}}/>
        )
      }
      else {
        return(
        <CrousteamButton title="Chat" onPress={() => {setPage("chatdisplay")}}/>
        )
      }
    }

    return (
        <View style={{ flex: 1 }}>
            <Text>{info[1]}</Text>
            <Text>{info[2]}</Text>
            <Text>{info[3]}</Text>
            <Text>{info[4]}</Text>
            
            <BoutonChat/>
            
            <Button title="Retour" onPress={() => { setLog('null'); setPage("friender") }}></Button>
        </View>
    )
};