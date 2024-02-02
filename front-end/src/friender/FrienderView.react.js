import React, { useState, useContext, useEffect } from 'react';
import { Button, View, StyleSheet, } from 'react-native';
import BottomBar from './BottomBar.react';
import AllFriends from './AllFriends.react';

import MyProfileView from '../myProfile/MyProfileView.react';
import ListChatView from '../listChat/ListChatView.react';
import EventView from '../event/EventView.react';
import GeneralSettingsView from '../generalSettings/GeneralSettingsView.react';
import ChangePreferencesView from '../changePreferences/changePreferencesView.react';
import ProfileDisplayView from '../profileDisplay/profileDisplayView.react';
import AppContext from '../common/appcontext';
import ChatDisplayView from '../chatDisplay/ChatDisplayView.react';

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

  if (page == 'friender') {


      return (

      <View style={styles.mainContainer}>
        <View style={{flex:0.8}}>
          <AllFriends username={username}  setLog={setLog} authToken={authToken}/>
        </View>
        <View style = {styles.footer}>
          <BottomBar page={page} setPage={setPage}/>
        </View>
      </View>)
    }
    if (page == 'myprofile') {
      return (<MyProfileView logoutUser = {logoutUser}></MyProfileView>)
    } 
    if (page == 'listchat') {
      return (<ListChatView page={page} setPage={setPage}></ListChatView>)
    }
    if (page == 'event') {
      return (<EventView page={page} setPage={setPage}></EventView>)
    }
    if (page == 'changepreferences') {
      return (<ChangePreferencesView page={page} setPage={setPage}></ChangePreferencesView>)
    }
    if (page == 'generalsettings') {
      return (<GeneralSettingsView page={page} setPage={setPage}></GeneralSettingsView>)
    }
    if (page == 'profiledisplay') {
      return (<ProfileDisplayView page={page} setPage={setPage} log={log} setLog={setLog}></ProfileDisplayView>)
    }
    if (page == 'chatdisplay'){
      return (<ChatDisplayView log={log} setLog={setLog}></ChatDisplayView>)
    }

}