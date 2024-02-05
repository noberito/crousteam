import React, { useContext, useState, useCallback, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TouchableOpacity, TextInput, Button } from 'react-native';
import axios from 'axios';
import { baseUrl } from '../common/const';
import AppContext from '../common/appcontext';

export default function EventDisplayView({log, setLog, gid, setGid}){
    const {username, setPage} = useContext(AppContext)
    return(
        <View>
        <Text> C'est la page d'event de {log} et je suis {username}</Text>
        <Button title="Retour" onPress={() => { setLog('null'); setPage("listevent") }}></Button>
        </View>
    )
};