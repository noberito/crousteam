import React, { useEffect, useState, useContext, useCallback, useSyncExternalStore } from 'react';
import { View, Text, Button, StyleSheet } from "react-native"
import { baseUrl } from '../common/const';
import axios from 'axios';
import CrousteamButton from '../common/CrousteamButton.react';
import AppContext from '../common/appcontext';
import ReturnButton from '../common/ReturnButton.react';

const styles = StyleSheet.create({
    mainContainer :{
        justifyContent:"",
        flex:1
    }
}
)

export default function AddEventView({}){

    const {setPage} = useContext(AppContext)
    return(
        <View style={styles.mainContainer}>
            <Text> Ceci est la page event, fais ce que tu veux Simon, un modèle de requete post dans change preferences / chatdisplay, bisous</Text>
            <ReturnButton onPress = {() => {setPage('listevent')}}/>
        </View>
    );
}