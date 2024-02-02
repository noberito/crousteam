import React, {useState, useContext} from 'react';
import { Text, Button, View, StyleSheet, TouchableOpacity } from 'react-native';
import AppContext from './appcontext';
import colors from './Colors.react';

const styles = StyleSheet.create({
    button:{
        width:'10%',
        height:'10%',
    },
    text:{
        fontFamily:'Arista-Pro-Alternate-Light-trial',
        fontSize:100
    }
})

const ReturnButton = ({onPress}) => {

    return(
        <TouchableOpacity style = {styles.button} onPress={onPress}>
            <Text style={styles.text}> {'<'} </Text>
        </TouchableOpacity>
    )
}

export default ReturnButton;