import React, {useState} from 'react';
import { Text, Button, View, StyleSheet, TouchableOpacity } from 'react-native';
import colors from './Colors.react';

const styles = StyleSheet.create({
    buttonContainer: {
      backgroundColor: colors.background,
      width:'50%',
      borderRadius: 10,
      padding: 20,
      alignItems: 'center',
      justifyContent: 'center',
      margin: 10,
      elevation: 3, // for Android
      shadowColor: colors.accent
    },
    buttonText: {
        color: colors.accent,
        fontSize: 20,
        fontFamily:'Arista-Pro-Alternate-Bold-trial',
      },
});

const LogOutButton = ({title, onPress}) => {
    return(
        <TouchableOpacity onPress={onPress} style = {styles.buttonContainer}>
          <Text style={styles.buttonText}>{title}</Text>
        </TouchableOpacity>
    )
};

export default LogOutButton;