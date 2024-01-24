import React, { useState } from 'react';
import { Button, View, StyleSheet, } from 'react-native';
import BottomBar from './BottomBar.react';

import MyProfileView from '../myProfile/MyProfileView.react';
import ChatView from '../chat/ChatView.react';
import EventView from '../event/EventView.react';
import AllUsers from './AllUsers.react';
import Chat from '../chat/Chat.react';

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
    flexBasis: 100,
  }
});

/**
 *
 * @param {string} authToken authToken for the authenticated queries
 * @param {()=>{}} logOutUser return to the logged out state
 * @returns
 */


export default function FrienderView({ authToken, logoutUser }) {
  const [page, setPage] = useState('friender')

  if (page == 'friender') {
    return (<View style={styles.mainContainer}>
      <AllUsers authToken={authToken} />
      <View style={styles.footer}>
        <BottomBar page={page} setPage={setPage} />
      </View>
    </View>)
  }
  if (page == 'myprofile') {
    return (<MyProfileView page={page} setPage={setPage}></MyProfileView>)
  }
  if (page == 'chat') {
    return (<ChatView page={page} setPage={setPage}></ChatView>)
  }

  if (page == 'event') {
    return (<EventView page={page} setPage={setPage}></EventView>)
  }
}