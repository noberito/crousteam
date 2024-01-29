import React, { useState } from 'react';
import { Text, Button, View, StyleSheet, } from 'react-native';
import axios from 'axios';

export default function ChangePreferencesView({setPage}) {
    return (
        <View>
            <Text> Change Preferences </Text>
            <Button title = "Retour" onPress= {() => {setPage("myprofile")}}></Button>

        </View>
    )
}
