
import React, { useState, useEffect, useContext } from 'react';
import { Text, Button, View, StyleSheet, } from 'react-native';
import axios from 'axios';
import { baseUrl } from '../common/const';
import KivTextInput from '../common/CrouisteamTextInput.react';
import KivCard from '../common/CrousteamCard.react';
import AppContext from '../common/appcontext';
import CrousteamButton from '../common/CrousteamButton.react';

export default function ChangePreferencesView({ }) {
    const [info, setInfo] = useState('');
    const [lid, setLid] = useState();
    const { username, setUsername, setPage } = useContext(AppContext);

    const [pseudo, setPseudo] = useState('');
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [naissance, setNaissance] = useState();
    const [photopath, setPhotopath] = useState();


    const [isLoading, setIsLoading] = useState(false);

    const loadInfo = () => {
        setIsLoading(true);

        console.log(`Request GET on ${baseUrl}/all-info`)

        axios({
            baseURL: baseUrl,
            url: `/all-info/${username}`,
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


    // le projet de cette requête est d'ALTER une table avec des nouvelles informations, on va donc faire une requête PATCH
    const SubmitInfo = () => {
        setIsLoading(true);

        console.log(`Request GET on ${baseUrl}/all-info`)

        axios({
            baseURL: baseUrl,
            url: '/all-info/delanoberite',
            method: 'PATCH',
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
        <View>

            <KivCard>

                <Text> Change Preferences </Text>
                <KivTextInput label="Pseudo" value={info[1]} onChangeText={value => setPseudo(value)} />
                <KivTextInput label="First Name" value={info[2]} onChangeText={value => setFirstName(value)} />
                <KivTextInput label="Last Name" value={info[3]} onChangeText={value => setLastName(value)} />
                <KivTextInput label="naissance" value={info[4]} onChangeText={value => setNaissance(value)} />
                <KivTextInput label="photopath" value={info[5]} onChangeText={value => setPhotopath(value)} />
                <Button title="Submit changes" disabled={isLoading} onPress={() => { SubmitInfo() }} />



            </KivCard>
            <CrousteamButton title="Retour" onPress={() => { setPage("myprofile") }}></CrousteamButton>
        </View>



    )
}
