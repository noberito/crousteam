import React, {useEffect, useState} from 'react';
import { View, Text, Button } from "react-native"

export default function ProfileDisplay({setPage}) {
    return(
        <View>
        <Text>Coucou</Text>
        <Button title = "Retour" onPress= {() => {setPage("friender")}}></Button>
        </View>
    )
};