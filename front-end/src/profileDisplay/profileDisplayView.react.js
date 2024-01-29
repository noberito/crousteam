import React, {useEffect, useState} from 'react';
import { View, Text, Button } from "react-native"

export default function ProfileDisplayView({log, setLog, setPage, }) {
    return(
        <View style={{flex:1}}>
        <Text>{log}</Text>
        <Button title = "Retour" onPress= {() => {setLog('null'); setPage("friender")}}></Button>
        </View>
    )
};