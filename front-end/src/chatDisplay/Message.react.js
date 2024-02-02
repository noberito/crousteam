import React, {useContext, useState} from 'react';
import { Text, Button, View, StyleSheet, TouchableOpacity } from 'react-native';
import colors from '../common/Colors.react';
import AppContext from '../common/appcontext';

const messageStyles = StyleSheet.create({
  messageRightContainer: {
    width:'50%',
    height:'auto',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 20,
    alignItems:'flex-end',
    margin: 10,
    elevation: 3, // for Android
    shadowColor: colors.secondaryText, 
    shadowOffset: { width: 0, height: 7 }, 
  },
  messageLeftContainer: {
    width:'50%',
    height:'auto',
    backgroundColor: colors.background,
    borderRadius: 10,
    padding: 20,
    alignItems:'flex-start',
    margin: 10,
    elevation: 3, // for Android
    shadowColor: colors.secondaryText, 
    shadowOffset: { width: 0, height: 7 }, 
  },
  messageText: {
    color: 'black',
    justifyContent:'flex-end',
    fontSize: 20,
    fontFamily:'Arista-Pro-Alternate-Light-trial',
  },

  sender:{
    fontFamily:'Arista-Pro-Alternate-Bold-trial',
    fontSize:30,
    color:colors.primaryText,
  },
});

const CrousteamMessage = ({ item}) => {

    const {username} = useContext(AppContext)
    if (item.sender==username) {
    return (
      <View style={{justifyContent:'flex-end', flexDirection: 'row'}}>
      <TouchableOpacity style={messageStyles.messageRightContainer}>
          <Text style={messageStyles.sender}>{item.sender}</Text>
          <Text style={messageStyles.messageText}>{item.content}</Text>
      </TouchableOpacity>
      </View>
    )}
    else {
        return(
        <TouchableOpacity style={messageStyles.messageLeftContainer}>
          <Text style={messageStyles.sender}>{item.sender}</Text>
          <Text style={messageStyles.messageText}>{item.content}</Text>
      </TouchableOpacity>)
    }

};

export default CrousteamMessage;