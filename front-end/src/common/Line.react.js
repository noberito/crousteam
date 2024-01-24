import React, {useState} from 'react';
import { Text, Button, View, StyleSheet, TouchableOpacity } from 'react-native';

const styles = StyleSheet.create({
    line:{
        width:'100%',
        height:1,
        backgroundColor:'grey'
    }
})

const Line = () => {
    return(<View style = {styles.line}/>)
}

export default Line;