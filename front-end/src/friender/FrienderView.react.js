import React, { useState, useContext, useEffect } from 'react';
import { Button, View, StyleSheet, Image } from 'react-native';
import BottomBar from './BottomBar.react';
import AllFriends from './AllFriends.react';

import MyProfileView from '../myProfile/MyProfileView.react';
import ListChatView from '../listChat/ListChatView.react';
import ListEventView from '../listEvent/ListEventView.react';
import GeneralSettingsView from '../generalSettings/GeneralSettingsView.react';
import ChangePreferencesView from '../changePreferences/changePreferencesView.react';
import ProfileDisplayView from '../profileDisplay/profileDisplayView.react';
import AppContext from '../common/appcontext';
import ChatDisplayView from '../chatDisplay/ChatDisplayView.react';
import EventDisplayView from '../eventDisplay/EventDisplayView.react';

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 16,
    justifyContent: "space-between"
  },
  cardContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    marginBottom: 8,
  },
  footer: {
    flexBasis: '8%',
  },
  logo:{
  },
  header:{
    justifyContent:'center',
    alignItems:'center',
    height:'5%'
  }
});

/**
 *
 * @param {string} authToken authToken for the authenticated queries
 * @param {()=>{}} logOutUser return to the logged out state
 * @returns
 */


export default function FrienderView({logoutUser}) {
  const { username, setUsername, authToken, setAuthToken, page, setPage } = useContext(AppContext)
  const [log, setLog] = useState('null')
  const [eid, setEid] = useState(-1)
  const [gid, setGid] = useState(-1)

  if (page == 'friender') {


      return (

      <View style={styles.mainContainer}>
        <View style={styles.header}>
          <Image style = {styles.logo} source={require('../../android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png')}></Image>
        </View>
        <View style={{height:'78%'}}>
          <AllFriends username={username}  setLog={setLog} authToken={authToken}/>
        </View>
        <View style = {styles.footer}>
          <BottomBar/>
        </View>
      </View>)
    }
    if (page == 'myprofile') {
      return (<MyProfileView logoutUser = {logoutUser}></MyProfileView>)
    } 
    if (page == 'listchat') {
      return (<ListChatView gid={gid} setGid={setGid} ></ListChatView>)
    }
    if (page == 'changepreferences') {
      return (<ChangePreferencesView></ChangePreferencesView>)
    }
    if (page == 'generalsettings') {
      return (<GeneralSettingsView></GeneralSettingsView>)
    }
    if (page == 'profiledisplay') {
      return (<ProfileDisplayView gid={gid} setGid={setGid} log={log} setLog={setLog}></ProfileDisplayView>)
    }
    if (page == 'chatdisplay'){
      return (<ChatDisplayView gid={gid} setGid={setGid} log={log} setLog={setLog}></ChatDisplayView>)
    }
    if (page == 'listevent') {
      return (<ListEventView gid={gid} setGid={setGid} eid={eid} setEid={setEid}></ListEventView>)
    }
    if (page == 'eventdisplay'){
      return(<EventDisplayView gid={gid} setGid={setGid} eid={eid} setEid={setEid}></EventDisplayView>)
    }

}