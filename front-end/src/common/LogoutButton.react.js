import React, {useState} from 'react';
import { Text, Button, View, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';

const styles = StyleSheet.create({
    buttonContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        height:80,
      },
    gradient: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 15,
        borderRadius: 10,
        marginHorizontal:250
      },
    buttonText: {
        color: 'white',
        fontSize: 30,
        fontFamily:'Arista-Pro-Alternate-Bold-trial',
      },
});

const LogOutButton = ({title, onPress}) => {
    return(
        <TouchableOpacity onPress={onPress} style = {styles.buttonContainer}>
            <LinearGradient
          colors={['#ec3124', '#ec3124', '#ec3124']}
          style={styles.gradient}
        >
          <Text style={styles.buttonText}>{title}</Text>
        </LinearGradient>
        </TouchableOpacity>
    )
};

export default LogOutButton;