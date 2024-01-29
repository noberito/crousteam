import React, { useState, useContext } from 'react';
import { Text, Button, View, StyleSheet, } from 'react-native';
import AppContext from '../common/appcontext';

export default function GeneralSettingsView() {

    const { username, setUsername } = useContext(AppContext);

    return (
        <View>
            <Text> General Settings</Text>
            <Text> Username : {username}</Text>
        </View>
    )
}