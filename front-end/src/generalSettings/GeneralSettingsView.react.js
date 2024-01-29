import React, {useState} from 'react';
import { Text, Button, View, StyleSheet, } from 'react-native';

export default function GeneralSettingsView({page, setPage}){
    return(
        <View>
            <Text> General Settings </Text>
            <Button title = "Retour" onPress= {() => {setPage("myprofile")}}></Button>
        </View>
    )
}