import React from 'react'
import { Button, View, StyleSheet } from 'react-native';

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#3498db', // You can change the background color as needed
    height: 50, // Set the height of the bar
    width: '100%', // Make it take the entire width
  }

});


export default function BottomBar ({page, setPage}) {
    return (
      <View style={styles.bottomBar}>
        <Button title = "My Profile" style={{marginRight: '10px' }} onPress = {() => {setPage('myprofile')}}/>
        <Button title = "Friender" style={{ marginRight: '10px' }} onPress = {() => {setPage('friender')}}/>
        <Button title = "Chat" style={{ marginRight: '10px' }} onPress = {() => {setPage('chat')}}/>
        <Button title = "Event" style={{ marginRight: '10px' }} onPress = {() => {setPage('event')}}/>
      </View>
    );
  };