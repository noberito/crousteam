import React, { useState, useContext } from 'react';
import { Text, Button, View, StyleSheet, TouchableOpacity, } from 'react-native';
import AppContext from '../common/appcontext';
import CrousteamButton from '../common/CrousteamButton.react';

export default function GeneralSettingsView() {

    const { username, setUsername, setPage} = useContext(AppContext);

    return (
        <View>
            <Text> General Settings</Text>
            <Text> Username : {username}</Text>
            <CrousteamButton onPress = {() => {setPage("myprofile")}} title = "Retour">
            </CrousteamButton>
        </View>
    )
}