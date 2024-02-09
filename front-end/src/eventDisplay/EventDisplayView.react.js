import React, { useContext, useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Button } from 'react-native';
import axios from 'axios';
import { baseUrl } from '../common/const';
import AppContext from '../common/appcontext';
import CrousteamButton from '../common/CrousteamButton.react';

export default function EventDisplayView({eid, setEid, gid, setGid}){
    const {username, setPage, authToken} = useContext(AppContext)

    return(
        <View>
            <Text> C'est la page d'event de {gid} et je suis {username}</Text>

            <CrousteamButton title="Chat" onPress ={() => {setPage("chatdisplay")}}></CrousteamButton>

            <Button title="Retour" onPress={() => { setGid(-1); setPage("listevent") }}></Button>
        </View>
    )
};