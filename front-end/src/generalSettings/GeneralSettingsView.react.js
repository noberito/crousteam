import React, { useState, useContext } from 'react';
import { Text, Button, View, StyleSheet, } from 'react-native';
import AppContext from '../common/appcontext';

<<<<<<< HEAD:front-end/src/generalSettings/GeneralSettingsView.react.js
export default function GeneralSettingsView({page, setPage}){
    return(
        <View>
            <Text> General Settings </Text>
            <Button title = "Retour" onPress= {() => {setPage("myprofile")}}></Button>
=======
export default function GeneralSettingsView() {

    const { username, setUsername } = useContext(AppContext);

    return (
        <View>
            <Text> General Settings</Text>
            <Text> Username : {username}</Text>
>>>>>>> 5606cc4 (changes before simon commit):front-end/src/myProfile/GeneralSettingsView.react.js
        </View>
    )
}