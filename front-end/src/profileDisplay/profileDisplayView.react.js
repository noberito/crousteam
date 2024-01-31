import React, {useEffect, useState, useContext} from 'react';
import { View, Text, Button } from "react-native"
import CrousteamButton from '../common/CrousteamButton.react';
import AppContext from '../common/appcontext';

export default function ProfileDisplayView({log, setLog}) {
    const {setPage} = useContext(AppContext)
    return(
        <View style={{flex:1}}>
        <Text>{log}</Text>
        <CrousteamButton title = "Retour" onPress= {() => {setLog('null'); setPage("friender")}}></CrousteamButton>
        </View>
    )
};