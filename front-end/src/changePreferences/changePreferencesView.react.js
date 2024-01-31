
import React, { useState, useEffect, useContext } from 'react';
import { Text, Button, View, StyleSheet, } from 'react-native';
import axios from 'axios';
import { baseUrl } from '../common/const';
import KivTextInput from '../common/CrousteamTextInput.react';
import KivCard from '../common/CrousteamCard.react';
import AppContext from '../common/appcontext';
import CrousteamButton from '../common/CrousteamButton.react';

export default function ChangePreferencesView({ }) {
    const [info, setInfo] = useState([]);
    const [lid, setLid] = useState();
    const { username, setUsername, setPage } = useContext(AppContext);

    const [login, setLogin] = useState('');
    const [firstName, setFirstName] = useState();
    const [lastName, setLastName] = useState();
    const [naissance, setNaissance] = useState();
    const [photoPath, setPhotopath] = useState();
    const [bio, setBio] = useState();


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
            setFirstName(result.data[1])
            setLastName(result.data[2])
            setBio(result.data[3])
            setNaissance(result.data[4])
            setPhotopath(result.data[5])
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

        console.log(`Request GET on ${baseUrl}/profile`)

        axios({
            baseURL: baseUrl,
            url: `/profile/${username}`,
            method: 'PATCH',
            params: { firstName, lastName, bio, naissance, photoPath }
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
        loadInfo()
    }, []);

    return (
        <View>

            <KivCard>

                <Text> Change Preferences </Text>
                <KivTextInput label="Login" value={username} onChangeText={value => setPseudo(value)} />
                <KivTextInput label="First Name" value={firstName} onChangeText={value => setFirstName(value)} />
                <KivTextInput label="Last Name" value={lastName} onChangeText={value => setLastName(value)} />
                <KivTextInput label="naissance" value={naissance} onChangeText={value => setNaissance(value)} />
                <KivTextInput label="bio" value={bio} onChangeText={value => setBio(value)} />
                <KivTextInput label="photopath" value={photoPath} onChangeText={value => setPhotopath(value)} />
                <Button title="Submit changes" disabled={isLoading} onPress={() => { SubmitInfo() }} />
                <Text>{firstName}</Text>


            </KivCard>
            <CrousteamButton title="Retour" onPress={() => { setPage("myprofile") }}></CrousteamButton>
        </View>



    )
}
