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
            console.error(`something went wrong: ${err.message}`)
            alert(`something went wrong: ${err.message}`)
            setIsLoading(false)
        })
    }

    useEffect(() => {
        loadInfo();
    }, []);
    return (
        <View style={{ flex: 1 }}>
            <Text>{info[1]}</Text>
            <Text>{info[2]}</Text>
            <Text>{info[3]}</Text>
            <Text>{info[4]}</Text>
            <CrousteamButton title="Chat" onPress={() => {getGid(), setPage("chatdisplay")}}/>
            <Button title="Retour" onPress={() => { setLog('null'); setPage("friender") }}></Button>
        </View>
    )
};