import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Button } from "react-native"
import { baseUrl } from '../common/const';
import axios from 'axios';
import CrousteamButton from '../common/CrousteamButton.react';
import AppContext from '../common/appcontext';

export default function ProfileDisplayView({ log, setLog,}) {

    const {setPage}= useContext(AppContext)
    const [, setIsLoading] = useState(false);
    const [info, setInfo] = useState('');
    const [lid, setLid] = useState();


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
            <CrousteamButton title="Chat" onPress={() => {setPage("chatdisplay")}}/>
            <Button title="Retour" onPress={() => { setLog('null'); setPage("friender") }}></Button>
        </View>
    )
};