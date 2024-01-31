import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import LoggedOutView from './loggedOut/LoggedOutView.react';
import FrienderView from './friender/FrienderView.react';
import Header from './header/Header.react';
import AppContext from './common/appcontext';
import colors from './common/Colors.react';
import CrousteamButton from './common/CrousteamButton.react';

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f6edce',
    padding: 16,
    width: '100%',
    height: '100%',
  }
});

export default function Root() {
  const [username, setUsername] = useState();
  const [authToken, setAuthToken] = useState();
  const [lastUid, setLastUid] = useState();
  const [page, setPage] = useState('friender')

  const onLogUser = (username, authToken) => {
    setUsername(username);
    setAuthToken(authToken);
  }

  const logoutUser = () => {
    setUsername(null);
    setAuthToken(null);
  }

  return (
    <AppContext.Provider value={{ username, setUsername, authToken, setAuthToken, lastUid, setLastUid, page, setPage }}>
      <View>
        <Header username={username} />
        <View style={styles.container}>
          {authToken != null ?
            <FrienderView authToken={authToken} logoutUser={logoutUser} username={username} />
            : <LoggedOutView onLogUser={onLogUser} />}
        </View>
      </View>
    </AppContext.Provider>
  );
}
