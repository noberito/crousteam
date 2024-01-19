import React from 'react'
import { Button, View, StyleSheet } from 'react-native';

export default function BottomBar ({page, setPage}) {
    return (
      <View style={{ flexDirection:"row",justifyContent:"center", position: 'absolute', width:'100%', bottom: 0, left: 0, right: 0,padding:0, textAlign: 'center' }}>
        <Button title = "My Profile" style={{marginRight: '10px' }} onPress = {() => {setPage('myprofile')}}/>
        <Button title = "Friender" style={{ marginRight: '10px' }} onPress = {() => {setPage('friender')}}/>
        <Button title = "Chat" style={{ marginRight: '10px' }} onPress = {() => {setPage('chat')}}/>
        <Button title = "Event" style={{ marginRight: '10px' }} onPress = {() => {setPage('event')}}/>
      </View>
    );
  };