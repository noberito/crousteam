import React, {useState} from 'react';
import { Button, View, StyleSheet, } from 'react-native';
import AllUsers from './AllUsers.react';
import BottomBar from './BottomBar.react';
import Menu from './Menu.react';

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow:1,
  },
  cardContainer: {
    flexGrow:1,
    justifyContent:'center',
    marginBottom:8,
  },
  bottom: {
    flexBasis:100,
  },
});

/**
 *
 * @param {string} authToken authToken for the authenticated queries
 * @param {()=>{}} logOutUser return to the logged out state
 * @returns
 */


export default function MainView({ authToken, logoutUser}) {
  const [page, setPage] = useState('friender')
  return (
    <View style={styles.mainContainer}>
      <Menu choixPage={page} authToken={authToken}/>
      <View style={styles.bottom}>
        <BottomBar page={page} setPage={setPage}/>
      </View>
    </View>
  );
}
