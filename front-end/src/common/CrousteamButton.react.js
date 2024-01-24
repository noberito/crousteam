import React, {useState} from 'react';
import { Text, Button, View, StyleSheet, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';


const buttonStyles = StyleSheet.create({
  buttonContainer: {
    borderRadius: 10,
    overflow: 'hidden',
    height:100,
    padding:5
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 15,
    marginHorizontal:70,
    borderRadius: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 40,
    fontFamily:'Arista-Pro-Alternate-Bold-trial',
  },
});

const CrousteamButton = ({ onPress, title }) => {
    return (
      <TouchableOpacity onPress={onPress} style={buttonStyles.buttonContainer}>
        <LinearGradient
          colors={['#fcb63c', '#fcb63c', '#fcb63c']}
          style={buttonStyles.gradient}
        >
          <Text style={buttonStyles.buttonText}>{title}</Text>
        </LinearGradient>
      </TouchableOpacity>
    );

};

export default CrousteamButton;