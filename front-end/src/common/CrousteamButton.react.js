import React, { useState } from 'react';
import { Text, Button, View, StyleSheet, TouchableOpacity } from 'react-native';
import colors from './Colors.react';

const buttonStyles = StyleSheet.create({
  buttonContainer: {
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 20,
    elevation: 3, // for Android
    shadowColor: colors.secondaryText,
    shadowOffset: { width: 0, height: 7 },
  },
  buttonText: {
    color: colors.primaryText,
    fontFamily: 'Arista-Pro-Alternate-Bold-trial',
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  }
});

const CrousteamButton = ({ onPress, title, styleText }) => {
  return (
    <TouchableOpacity onPress={onPress} style={buttonStyles.buttonContainer}>
      <Text style={[buttonStyles.buttonText, styleText]}>{title}</Text>
    </TouchableOpacity>
  );

};

export default CrousteamButton;