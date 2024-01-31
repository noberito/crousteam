import React, {useContext, useState} from 'react';
import { Text, Button, View, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../common/Colors.react';
import AppContext from '../common/appcontext';

const messageStyles = StyleSheet.create({
  messageRightContainer: {
    width:'50%',
    heigt:'8%',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 20,
    justifyContent:'center',
    alignItems:'right',
    margin: 10,
    elevation: 3, // for Android
    shadowColor: colors.secondaryText, 
    shadowOffset: { width: 0, height: 7 }, 
  },
  messageLeftContainer: {
    width:'50%',
    heigt:'8%',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 20,
    justifyContent:'center',
    alignItems:'right',
    margin: 10,
    elevation: 3, // for Android
    shadowColor: colors.secondaryText, 
    shadowOffset: { width: 0, height: 7 }, 
  },
  messageText: {
    color: colors.primaryText,
    fontSize: 24,
    fontFamily:'Arista-Pro-Alternate-Bold-trial',
  },
  right:{
    justifyContent:'center',
    alignItems:'right',
  },
  left:{
    justifyContent:'center',
    alignItems:'left',
  }
});

const CrousteamMessage = ({ content, sender, time }) => {

    const {username} = useContext(AppContext)

    if (sender==username) {
    return (
      <TouchableOpacity style={messageStyles.messageRightContainer}>
          <Text style={messagetyles.messageText}>{content}</Text>
      </TouchableOpacity>
    )}
    else {
        return(
        <TouchableOpacity style={messageStyles.messageLeftContainer}>
          <Text style={messageStyles.messageText}>{content}</Text>
      </TouchableOpacity>)
    }

};

export default CrousteamMessage;