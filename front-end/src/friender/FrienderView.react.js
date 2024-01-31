import React, { useState, useContext } from 'react';
import { Button, View, StyleSheet, } from 'react-native';
import BottomBar from './BottomBar.react';
import AllFriends from './AllFriends.react';

import MyProfileView from '../myProfile/MyProfileView.react';
import ChatView from '../chat/ChatView.react';
import EventView from '../event/EventView.react';
import GeneralSettingsView from '../generalSettings/GeneralSettingsView.react';
import ChangePreferencesView from '../changePreferences/changePreferencesView.react';
import ProfileDisplayView from '../profileDisplay/profileDisplayView.react';
import AppContext from '../common/appcontext';

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


export default function FrienderView({logoutUser }) {
  const { username, setUsername, authToken, setAuthToken, page, setPage } = useContext(AppContext)
  const [log, setLog] = useState('null')

  if (page == 'friender') {
      return (
      <View style={styles.mainContainer}>
        <View style={{flex:0.8}}>
          <AllFriends username={username} setPage={setPage} setLog={setLog} authToken={authToken}/>
        </View>
        <View style = {styles.footer}>
          <BottomBar page={page} setPage={setPage}/>
        </View>
      </View>)
    }
    if (page == 'myprofile') {
      return (<MyProfileView logoutUser = {logoutUser}></MyProfileView>)
    } 
    if (page == 'chat') {
      return (<ChatView page={page} setPage={setPage}></ChatView>)
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

}