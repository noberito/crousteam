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
    justifyContent:'right',
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
    justifyContent:'left',
    alignItems:'left',
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
    justifyContent:'flex-start',
    alignItems:'flex-end',
  },
  left:{
    justifyContent:'flex-end',
    alignItems:'flex-start',
  }
});

const CrousteamMessage = ({ item}) => {

    const {username} = useContext(AppContext)
    console.log(username)
    console.log(item.sender==username)
    if (item.sender==username) {
    return (
      <TouchableOpacity style={messageStyles.left}>
          <Text style={messageStyles.right}>{item.content}</Text>
      </TouchableOpacity>
    )}
    else {
        return(
        <TouchableOpacity style={messageStyles.right}>
          <Text style={messageStyles.left}>{item.content}</Text>
      </TouchableOpacity>)
    }

};

export default CrousteamMessage;