import React, {useContext} from 'react'
import { Button, View, StyleSheet, Image } from 'react-native';
import BottomBarIcon from '../common/BottomBarIcon';
import Line from '../common/Line.react';
import AppContext from '../common/appcontext';

const styles = StyleSheet.create({
  bottomBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center', // You can change the background color as needed
    height: '100%', // Set the height of the bar
    width: '100%', // Make it take the entire width
  }

});




export default function BottomBar ({}) {

    const {page, setPage} = useContext(AppContext)
    return (
      <View style={{bottom:"40%"}}>
        <Line/>
      <View style={styles.bottomBar}>
        <BottomBarIcon title = "My Profile" style={{marginRight: '10px' }} imagePath = {require("../images/myprofile.png")} onPress = {() => {setPage('myprofile')}}/>
        <BottomBarIcon title = "Friender" style={{ marginRight: '10px' }} imagePath = {require('../images/myprofile.png')} onPress = {() => {setPage('friender')}}/>
        <BottomBarIcon title = "Chat" style={{ marginRight: '10px' }} imagePath = {require('../images/chat.png')} onPress = {() => {setPage('listchat')}}/>
        <BottomBarIcon title = "Event" style={{ marginRight: '10px' }} imagePath = {require('../images/event.png')} onPress = {() => {setPage('listevent')}}/>
      </View>
      </View>)
  };