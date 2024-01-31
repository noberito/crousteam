import React, { useState } from 'react';
import { Image, View, StyleSheet } from 'react-native';
import Login from './Login.react';
import CreateAccount from './CreateAccount.react';
import AddInfo from './AddInfo.react'
import colors from '../common/Colors.react';
import CrousteamButton from '../common/CrousteamButton.react';
import AppContext from '../common/appcontext';
import AddPreferences from './AddPreferences';

const TABS = Object.freeze({ LOGIN: 'LOGIN', CREATE_ACCOUNT: 'CREATE_ACCOUNT', INFO: 'INFO', PREFERENCES: 'PREFERENCES' });

const styles = StyleSheet.create({
  image: {
    width: 50, // Adjust the width as needed
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 100 // Adjust the height as needed
  },
})

/**
 *
 * @param {(authToken:string) => {}} onLogUser
 * @returns
 */
export default function LoggedOutView({ onLogUser }) {
  const [tab, setTab] = useState(TABS.LOGIN);

  return (

    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image source={require('./ic_launcher_round.png')}
        style={styles.image}></Image>
      {tab == TABS.LOGIN ? <Login onSuccess={onLogUser} onCancel={() => setTab(TABS.CREATE_ACCOUNT)} />
        : tab == TABS.INFO ? <AddInfo onSuccess={() => setTab(TABS.PREFERENCES)} onCancel={() => setTab(TABS.LOGIN)} />
          : tab == TABS.PREFERENCES ? <AddPreferences onSuccess={() => setTab(TABS.LOGIN)} onCancel={() => setTab(TABS.LOGIN)} />
            : <CreateAccount onSuccess={() => setTab(TABS.INFO)} onCancel={() => setTab(TABS.LOGIN)} />}
    </View>
  );
}